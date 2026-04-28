import { NextRequest, NextResponse } from "next/server";
import { appendEnquiry } from "@/lib/sheets";
import type { EnquiryPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: EnquiryPayload = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { 
          success: false,
          error: "Please fill in all required fields (name, email, and message).",
          retryable: false,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim())) {
      return NextResponse.json(
        { 
          success: false,
          error: "Please provide a valid email address.",
          retryable: false,
        },
        { status: 400 }
      );
    }

    // Append enquiry to Google Sheets
    try {
      await appendEnquiry(body);
    } catch (sheetsError) {
      // Log detailed error for debugging (server-side only)
      console.error("[Enquiry API] Failed to append enquiry to Google Sheets:", {
        error: sheetsError instanceof Error ? sheetsError.message : String(sheetsError),
        stack: sheetsError instanceof Error ? sheetsError.stack : undefined,
        customerEmail: body.email,
        timestamp: new Date().toISOString(),
      });
      
      // Return user-friendly error message without exposing technical details
      return NextResponse.json(
        { 
          success: false,
          error: "We couldn't submit your enquiry at this time. Please try again or contact us directly at vickiesatelier@gmail.com.",
          retryable: true,
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ 
      success: true,
      ok: true,
    });
  } catch (err) {
    // Log detailed error for debugging (server-side only)
    console.error("[Enquiry API] Unexpected error processing enquiry:", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    // Return user-friendly error message without exposing technical details
    return NextResponse.json(
      { 
        success: false,
        error: "We couldn't submit your enquiry at this time. Please try again or contact us directly at vickiesatelier@gmail.com.",
        retryable: true,
      },
      { status: 503 }
    );
  }
}
