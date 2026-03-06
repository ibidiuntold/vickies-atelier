import { NextRequest, NextResponse } from "next/server";
import {
  createCalendarEvent,
  CalendarError,
  type CustomerDetails,
  type CollectionType,
} from "@/lib/google-calendar";
import { sendBookingEmails } from "@/lib/email";

/**
 * POST /api/calendar/book
 * 
 * Creates a consultation booking in Google Calendar and sends confirmation emails
 * 
 * Requirements: 1.4, 1.8, 11.2, 11.3
 * 
 * Request body:
 * - startTime: ISO 8601 datetime string
 * - name: Customer name
 * - email: Customer email
 * - phone: Customer phone number
 * - collectionType: 'bespoke' | 'bridal' | 'rtw'
 * 
 * @returns JSON response with booking confirmation
 */
export async function POST(request: NextRequest) {
  let body: any;
  try {
    // Parse request body
    body = await request.json();
    const { startTime, name, email, phone, collectionType } = body;

    // Validate required fields
    const validationError = validateBookingRequest(body);
    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          error: validationError,
        },
        { status: 400 }
      );
    }

    // Prepare customer details
    const customerDetails: CustomerDetails = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      collectionType: collectionType as CollectionType,
    };

    // Create calendar event
    // Note: Double-booking prevention is handled by the available-slots API
    // which filters out busy time slots. The frontend should only allow
    // selection from available slots fetched from /api/calendar/available-slots
    const eventResult = await createCalendarEvent(startTime, customerDetails);

    // Send confirmation emails to customer and CEO
    let emailWarning: string | undefined;
    try {
      await sendBookingEmails({
        customerDetails,
        eventDetails: eventResult,
      });
    } catch (emailError) {
      // Log detailed email error for debugging (server-side only)
      console.error("[Calendar API] Failed to send booking confirmation emails:", {
        error: emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : undefined,
        customerEmail: customerDetails.email,
        eventId: eventResult.eventId,
        timestamp: new Date().toISOString(),
      });
      // The booking was successful, so we still return success
      // but inform the user that email notification failed
      emailWarning = "Booking confirmed, but we couldn't send the confirmation email. Please save this confirmation or contact us directly at vickiesatelier@gmail.com.";
    }

    // Return success response with booking details
    return NextResponse.json({
      success: true,
      booking: {
        eventId: eventResult.eventId,
        eventLink: eventResult.eventLink,
        startTime: eventResult.startTime,
        endTime: eventResult.endTime,
        customer: {
          name: customerDetails.name,
          email: customerDetails.email,
          collectionType: customerDetails.collectionType,
        },
      },
      message: emailWarning || "Consultation booked successfully! Check your email for confirmation.",
      warning: emailWarning,
    });
  } catch (error) {
    // Log detailed error for debugging (server-side only)
    console.error("[Calendar API] Error creating booking:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      customerEmail: body?.email,
      collectionType: body?.collectionType,
      timestamp: new Date().toISOString(),
    });

    // Handle CalendarError with user-friendly messages
    if (error instanceof CalendarError) {
      return NextResponse.json(
        {
          success: false,
          error: error.getUserMessage(),
          code: error.code,
          retryable: error.code !== "AUTH_ERROR",
        },
        { status: error.code === "AUTH_ERROR" ? 401 : 503 }
      );
    }

    // Handle unexpected errors with user-friendly message
    // Don't expose technical details to the client
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't complete your booking at this time. Please try again or contact us directly at vickiesatelier@gmail.com.",
        retryable: true,
      },
      { status: 503 }
    );
  }
}

/**
 * Validates the booking request payload
 * 
 * Requirements: 1.8 (validate customer information)
 * 
 * @param body - Request body to validate
 * @returns Error message if validation fails, null if valid
 */
function validateBookingRequest(body: any): string | null {
  // Check required fields
  if (!body.startTime) {
    return "Start time is required";
  }

  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    return "Name is required";
  }

  if (body.name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!body.email || typeof body.email !== "string" || body.email.trim().length === 0) {
    return "Email is required";
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email.trim())) {
    return "Invalid email format";
  }

  if (!body.phone || typeof body.phone !== "string" || body.phone.trim().length === 0) {
    return "Phone number is required";
  }

  // Validate phone format (basic validation for Nigerian numbers)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(body.phone.trim())) {
    return "Invalid phone number format";
  }

  if (body.phone.trim().replace(/\D/g, "").length < 10) {
    return "Phone number must be at least 10 digits";
  }

  if (!body.collectionType) {
    return "Collection type is required";
  }

  // Validate collection type
  const validCollectionTypes = ["bespoke", "bridal", "rtw"];
  if (!validCollectionTypes.includes(body.collectionType)) {
    return "Invalid collection type. Must be 'bespoke', 'bridal', or 'rtw'";
  }

  // Validate startTime format
  try {
    const startDate = new Date(body.startTime);
    if (isNaN(startDate.getTime())) {
      return "Invalid start time format";
    }

    // Check if start time is in the past
    if (startDate <= new Date()) {
      return "Start time must be in the future";
    }
  } catch {
    return "Invalid start time format";
  }

  return null;
}
