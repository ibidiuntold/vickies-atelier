import { NextResponse } from "next/server";
import { getAvailableSlots, CalendarError } from "@/lib/google-calendar";

/**
 * GET /api/calendar/available-slots
 * 
 * Fetches available consultation time slots for the next 14 days
 * 
 * Requirements: 1.2, 19.1, 19.2, 19.7, 19.9
 * 
 * @returns JSON response with available slots grouped by date
 */
export async function GET() {
  try {
    // Fetch available slots from Google Calendar
    const slots = await getAvailableSlots();

    // Group slots by date for easier display
    const slotsByDate: Record<string, typeof slots> = {};
    
    slots.forEach((slot) => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push(slot);
    });

    return NextResponse.json({
      success: true,
      slots: slotsByDate,
      businessHours: {
        start: "9:00 AM",
        end: "6:00 PM",
        timezone: "Africa/Lagos (WAT)",
      },
    });
  } catch (error) {
    // Log detailed error for debugging (server-side only)
    console.error("[Calendar API] Error fetching available slots:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Handle CalendarError with user-friendly messages
    if (error instanceof CalendarError) {
      return NextResponse.json(
        {
          success: false,
          error: error.getUserMessage(),
          code: error.code,
          retryable: true,
        },
        { status: error.code === "AUTH_ERROR" ? 401 : 503 }
      );
    }

    // Handle unexpected errors with user-friendly message
    // Don't expose technical details to the client
    return NextResponse.json(
      {
        success: false,
        error: "We're having trouble loading available time slots. Please try again in a moment.",
        retryable: true,
      },
      { status: 503 }
    );
  }
}
