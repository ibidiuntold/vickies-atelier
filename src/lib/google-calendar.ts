import { google } from "googleapis";
import type { calendar_v3 } from "googleapis";

/**
 * Google Calendar API authentication and utility functions
 * 
 * This module provides OAuth 2.0 authentication for Google Calendar API
 * and utility functions for managing consultation bookings.
 * 
 * Requirements: 11.1, 11.8
 */

/**
 * Creates and returns an authenticated Google Calendar client
 * Uses service account authentication with JWT
 * 
 * @throws {Error} If required environment variables are missing
 * @returns {calendar_v3.Calendar} Authenticated Calendar API client
 */
export function getCalendarClient(): calendar_v3.Calendar {
  // Validate required environment variables
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL environment variable"
    );
  }

  if (!process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Missing GOOGLE_PRIVATE_KEY environment variable");
  }

  if (!process.env.GOOGLE_CALENDAR_ID) {
    throw new Error("Missing GOOGLE_CALENDAR_ID environment variable");
  }

  // Create JWT auth client with service account credentials
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  // Return authenticated calendar client
  return google.calendar({ version: "v3", auth });
}

/**
 * Gets the calendar ID from environment variables
 * 
 * @throws {Error} If GOOGLE_CALENDAR_ID is not set
 * @returns {string} The calendar ID
 */
export function getCalendarId(): string {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  
  if (!calendarId) {
    throw new Error("Missing GOOGLE_CALENDAR_ID environment variable");
  }
  
  return calendarId;
}

/**
 * Error class for Google Calendar API errors
 * Provides structured error handling with user-friendly messages
 */
export class CalendarError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "CalendarError";
  }

  /**
   * Returns a user-friendly error message
   */
  getUserMessage(): string {
    switch (this.code) {
      case "AUTH_ERROR":
        return "Unable to authenticate with Google Calendar. Please try again later.";
      case "CALENDAR_NOT_FOUND":
        return "Calendar not found. Please contact support.";
      case "PERMISSION_DENIED":
        return "Permission denied to access calendar. Please contact support.";
      case "NETWORK_ERROR":
        return "Network error. Please check your connection and try again.";
      case "INVALID_REQUEST":
        return "Invalid request. Please check your input and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
    }
  }
}

/**
 * Wraps calendar API calls with error handling
 * Converts Google API errors into CalendarError instances
 * 
 * @param fn - Async function to execute
 * @returns Promise with the function result
 * @throws {CalendarError} If the operation fails
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Handle Google API errors
    if (error.code === 401 || error.code === 403) {
      throw new CalendarError(
        "Authentication or permission error",
        error.code === 401 ? "AUTH_ERROR" : "PERMISSION_DENIED",
        error
      );
    }

    if (error.code === 404) {
      throw new CalendarError(
        "Calendar not found",
        "CALENDAR_NOT_FOUND",
        error
      );
    }

    if (error.code === 400) {
      throw new CalendarError(
        "Invalid request",
        "INVALID_REQUEST",
        error
      );
    }

    if (error.code === "ENOTFOUND" || error.code === "ETIMEDOUT") {
      throw new CalendarError(
        "Network error",
        "NETWORK_ERROR",
        error
      );
    }

    // Unknown error
    throw new CalendarError(
      error.message || "Unknown error",
      "UNKNOWN_ERROR",
      error
    );
  }
}

/**
 * Validates that the calendar client can authenticate successfully
 * Useful for testing authentication setup
 * 
 * @returns {Promise<boolean>} True if authentication is successful
 * @throws {CalendarError} If authentication fails
 */
export async function validateAuthentication(): Promise<boolean> {
  return withErrorHandling(async () => {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    // Try to fetch calendar metadata to validate authentication
    await calendar.calendars.get({ calendarId });
    
    return true;
  });
}

/**
 * Time slot interface representing an available appointment time
 */
export interface TimeSlot {
  start: string; // ISO 8601 datetime string
  end: string; // ISO 8601 datetime string
  date: string; // Date in YYYY-MM-DD format
  time: string; // Time in 12-hour format (e.g., "2:00 PM")
}

/**
 * Business hours configuration
 */
const BUSINESS_HOURS = {
  start: 9, // 9 AM
  end: 18, // 6 PM
  slotDurationMinutes: 30, // 30-minute slots
  excludeWeekends: true, // Exclude Saturday and Sunday
};

/**
 * Fetches available time slots from the CEO's calendar for the next 14 days
 * 
 * This function:
 * - Queries the Google Calendar freebusy API
 * - Filters out busy time slots
 * - Returns available slots within business hours
 * - Excludes weekends if configured
 * - Excludes past time slots
 * 
 * Requirements: 1.9, 11.10, 19.1, 19.8
 * 
 * @returns {Promise<TimeSlot[]>} Array of available time slots
 * @throws {CalendarError} If the API call fails
 */
export async function getAvailableSlots(): Promise<TimeSlot[]> {
  return withErrorHandling(async () => {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    // Calculate time range: now to 14 days from now
    const now = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    // Query freebusy information
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: endDate.toISOString(),
        items: [{ id: calendarId }],
        timeZone: "Africa/Lagos", // Nigerian timezone (WAT)
      },
    });

    // Extract busy periods
    const busyPeriods =
      response.data.calendars?.[calendarId]?.busy || [];

    // Generate all possible time slots within business hours
    const allSlots = generateBusinessHourSlots(now, endDate);

    // Filter out busy slots
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      // Check if slot overlaps with any busy period
      const isOverlapping = busyPeriods.some((busy) => {
        const busyStart = new Date(busy.start!);
        const busyEnd = new Date(busy.end!);

        // Slot overlaps if it starts before busy ends and ends after busy starts
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      return !isOverlapping;
    });

    return availableSlots;
  });
}

/**
 * Generates all possible time slots within business hours for the given date range
 * 
 * @param startDate - Start of the date range
 * @param endDate - End of the date range
 * @returns Array of time slots
 */
function generateBusinessHourSlots(
  startDate: Date,
  endDate: Date
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0); // Start at midnight

  while (currentDate <= endDate) {
    // Skip weekends if configured
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

    if (!BUSINESS_HOURS.excludeWeekends || !isWeekend) {
      // Generate slots for this day
      for (
        let hour = BUSINESS_HOURS.start;
        hour < BUSINESS_HOURS.end;
        hour++
      ) {
        // Generate slots at 30-minute intervals
        for (let minute = 0; minute < 60; minute += BUSINESS_HOURS.slotDurationMinutes) {
          const slotStart = new Date(currentDate);
          slotStart.setHours(hour, minute, 0, 0);

          const slotEnd = new Date(slotStart);
          slotEnd.setMinutes(slotEnd.getMinutes() + BUSINESS_HOURS.slotDurationMinutes);

          // Skip if slot is in the past
          if (slotStart <= new Date()) {
            continue;
          }

          // Skip if slot extends beyond business hours
          if (slotEnd.getHours() > BUSINESS_HOURS.end) {
            continue;
          }

          slots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            date: formatDate(slotStart),
            time: formatTime(slotStart),
          });
        }
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
}

/**
 * Formats a date as YYYY-MM-DD
 * 
 * @param date - Date to format
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a time in 12-hour format with AM/PM
 * 
 * @param date - Date to format
 * @returns Formatted time string (e.g., "2:00 PM")
 */
function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 to 12

  const minutesStr = String(minutes).padStart(2, "0");
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Collection type for consultation bookings
 */
export type CollectionType = "bespoke" | "bridal" | "rtw";

/**
 * Customer details for consultation booking
 */
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  collectionType: CollectionType;
}

/**
 * Calendar event creation result
 */
export interface CalendarEventResult {
  eventId: string;
  eventLink: string;
  startTime: string;
  endTime: string;
}

/**
 * Gets the event duration in minutes based on collection type
 * 
 * Requirements: 11.4, 11.5, 11.6, 11.7
 * - Bridal: 60 minutes
 * - Bespoke: 45 minutes
 * - Ready-to-Wear (RTW): 30 minutes
 * 
 * @param collectionType - The type of collection
 * @returns Duration in minutes
 */
function getEventDuration(collectionType: CollectionType): number {
  switch (collectionType) {
    case "bridal":
      return 60;
    case "bespoke":
      return 45;
    case "rtw":
      return 30;
    default:
      return 30; // Default to 30 minutes
  }
}

/**
 * Formats collection type for display
 * 
 * @param collectionType - The collection type
 * @returns Formatted collection type string
 */
function formatCollectionType(collectionType: CollectionType): string {
  switch (collectionType) {
    case "bridal":
      return "Bridal";
    case "bespoke":
      return "Bespoke";
    case "rtw":
      return "Ready-to-Wear";
    default:
      return collectionType;
  }
}

/**
 * Creates a calendar event for a consultation booking
 * 
 * This function:
 * - Creates a calendar event in the CEO's Google Calendar
 * - Sets the event duration based on collection type
 * - Includes customer details in the event description
 * - Handles event creation failures with logging
 * 
 * Requirements: 1.4, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.9
 * 
 * @param startTime - ISO 8601 datetime string for event start
 * @param customerDetails - Customer information for the booking
 * @returns {Promise<CalendarEventResult>} Created event details
 * @throws {CalendarError} If event creation fails
 */
export async function createCalendarEvent(
  startTime: string,
  customerDetails: CustomerDetails
): Promise<CalendarEventResult> {
  return withErrorHandling(async () => {
    const calendar = getCalendarClient();
    const calendarId = getCalendarId();

    // Calculate end time based on collection type
    const duration = getEventDuration(customerDetails.collectionType);
    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + duration);

    // Format collection type for display
    const collectionTypeDisplay = formatCollectionType(
      customerDetails.collectionType
    );

    // Create event description with customer details
    const description = `
Consultation Booking - ${collectionTypeDisplay}

Customer Details:
- Name: ${customerDetails.name}
- Email: ${customerDetails.email}
- Phone: ${customerDetails.phone}
- Collection Type: ${collectionTypeDisplay}

This is an automated booking from the Vickie's Atelier website.
    `.trim();

    // Create the calendar event
    try {
      const response = await calendar.events.insert({
        calendarId,
        sendUpdates: "all", // Send email notifications to attendees
        requestBody: {
          summary: `Consultation: ${customerDetails.name} (${collectionTypeDisplay})`,
          description,
          start: {
            dateTime: start.toISOString(),
            timeZone: "Africa/Lagos", // Nigerian timezone (WAT)
          },
          end: {
            dateTime: end.toISOString(),
            timeZone: "Africa/Lagos",
          },
          attendees: [
            {
              email: customerDetails.email,
              displayName: customerDetails.name,
              responseStatus: "needsAction",
            },
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 1 day before
              { method: "popup", minutes: 60 }, // 1 hour before
            ],
          },
        },
      });

      const event = response.data;

      // Log successful event creation
      console.log(
        `[Calendar] Event created successfully: ${event.id} for ${customerDetails.name}`
      );

      return {
        eventId: event.id!,
        eventLink: event.htmlLink!,
        startTime: event.start!.dateTime!,
        endTime: event.end!.dateTime!,
      };
    } catch (error: any) {
      // Log the error with customer details for debugging
      console.error(
        `[Calendar] Failed to create event for ${customerDetails.name} (${customerDetails.email}):`,
        error.message || error
      );

      // Re-throw as CalendarError for consistent error handling
      throw error;
    }
  });
}
