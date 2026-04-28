import { NextRequest, NextResponse } from "next/server";
import { appendOrder, getConfig } from "@/lib/sheets";
import { sendOrderEmails } from "@/lib/email";
import type { OrderPayload, Collection } from "@/types";
import { processUploadedImages, cleanupTempFiles } from "@/lib/file-upload";

export async function POST(req: NextRequest) {
  let tempFilePaths: string[] = [];
  
  try {
    const contentType = req.headers.get("content-type") || "";
    let body: OrderPayload;
    let photoAttachments: string[] = [];

    // Handle FormData (with photos) or JSON (without photos)
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      
      // Extract form fields
      body = {
        collection: formData.get("collection") as Collection,
        bust: formData.get("bust") as string,
        waist: formData.get("waist") as string,
        hips: formData.get("hips") as string,
        height: formData.get("height") as string,
        shoulder: formData.get("shoulder") as string,
        sleeve: formData.get("sleeve") as string,
        inseam: formData.get("inseam") as string,
        notes: formData.get("notes") as string,
        name: formData.get("name") as string,
        email: formData.get("email") as string,
      };

      // Process photo uploads
      const photoCount = parseInt(formData.get("photoCount") as string || "0", 10);
      if (photoCount > 0) {
        const photoFiles: Array<{ buffer: Buffer; originalName: string; mimeType: string }> = [];
        
        for (let i = 0; i < photoCount; i++) {
          const file = formData.get(`photo_${i}`) as File;
          if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            photoFiles.push({
              buffer,
              originalName: file.name,
              mimeType: file.type,
            });
          }
        }

        // Process and compress images
        if (photoFiles.length > 0) {
          try {
            tempFilePaths = await processUploadedImages(photoFiles);
            photoAttachments = tempFilePaths;
          } catch (imageError) {
            // Log image processing error
            console.error("[Order API] Failed to process uploaded images:", {
              error: imageError instanceof Error ? imageError.message : String(imageError),
              photoCount: photoFiles.length,
              timestamp: new Date().toISOString(),
            });
            await cleanupTempFiles(tempFilePaths);
            return NextResponse.json(
              { 
                success: false,
                error: "Failed to process uploaded photos. Please try again with smaller images or contact us directly.",
                retryable: true,
              },
              { status: 400 }
            );
          }
        }
      }
    } else {
      // Handle JSON request (backward compatibility)
      body = await req.json();
    }

    // Validate required fields
    if (!body.name || !body.email || !body.collection) {
      await cleanupTempFiles(tempFilePaths);
      return NextResponse.json(
        { 
          success: false,
          error: "Please fill in all required fields (name, email, and collection type).",
          retryable: false,
        },
        { status: 400 }
      );
    }

    // Fetch configuration from Google Sheets
    let config;
    try {
      config = await getConfig();
    } catch (configError) {
      console.error("[Order API] Failed to fetch configuration:", {
        error: configError instanceof Error ? configError.message : String(configError),
        timestamp: new Date().toISOString(),
      });
      // Use default values if config fetch fails
      config = {
        bespoke_days: "7",
        bridal_days: "7",
        rtw_days: "7",
        admin_email: process.env.ADMIN_EMAIL || "",
      };
    }

    const daysKey = `${body.collection}_days`;
    const days = parseInt(config[daysKey] ?? "7", 10);

    const readyDate = new Date();
    readyDate.setDate(readyDate.getDate() + days);
    const readyDateStr = readyDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Append order to Google Sheets
    try {
      await appendOrder({ ...body, estimatedReadyDate: readyDateStr });
    } catch (sheetsError) {
      // Log error but continue - email is more critical for customer
      console.error("[Order API] Failed to append order to Google Sheets:", {
        error: sheetsError instanceof Error ? sheetsError.message : String(sheetsError),
        customerEmail: body.email,
        collection: body.collection,
        timestamp: new Date().toISOString(),
      });
      // Don't fail the request - we'll still send the email
    }

    // Send order confirmation emails
    let emailWarning: string | undefined;
    try {
      await sendOrderEmails({
        ...body,
        readyDate: readyDateStr,
        adminEmail: config.admin_email ?? "",
        estimatedReadyDate: readyDateStr,
        photoAttachments, // Pass photo attachments to email function
      });
    } catch (emailError) {
      // Log detailed email error
      console.error("[Order API] Failed to send order confirmation emails:", {
        error: emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : undefined,
        customerEmail: body.email,
        hasPhotos: photoAttachments.length > 0,
        timestamp: new Date().toISOString(),
      });
      emailWarning = "Order received, but we couldn't send the confirmation email. We'll contact you directly at the email you provided.";
    }

    // Clean up temporary files after sending emails
    await cleanupTempFiles(tempFilePaths);

    return NextResponse.json({ 
      success: true,
      ok: true, 
      readyDate: readyDateStr,
      warning: emailWarning,
    });
  } catch (err) {
    // Log detailed error for debugging (server-side only)
    console.error("[Order API] Unexpected error processing order:", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    // Clean up temporary files on error
    await cleanupTempFiles(tempFilePaths);
    
    // Return user-friendly error message without exposing technical details
    return NextResponse.json(
      { 
        success: false,
        error: "We couldn't process your order at this time. Please try again or contact us directly at vickiesatelier@gmail.com.",
        retryable: true,
      },
      { status: 503 }
    );
  }
}
