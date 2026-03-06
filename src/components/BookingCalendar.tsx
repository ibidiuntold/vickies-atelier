'use client';

import { useState, useEffect } from 'react';

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
 * Collection type for consultation bookings
 */
export type CollectionType = 'bespoke' | 'bridal' | 'rtw';

/**
 * Props for BookingCalendar component
 */
export interface BookingCalendarProps {
  collectionType: CollectionType;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

/**
 * API response structure for available slots
 */
interface AvailableSlotsResponse {
  success: boolean;
  slots: Record<string, TimeSlot[]>;
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
  error?: string;
}

/**
 * BookingCalendar Component
 * 
 * Interactive calendar for selecting consultation time slots.
 * 
 * Features:
 * - Fetches available slots from API on mount
 * - Groups slots by date with user-friendly formatting
 * - Displays next 14 days
 * - Highlights selected slot
 * - Loading and error states
 * - Refresh capability
 * - Mobile-optimized scrollable list
 * - Excludes past dates
 * 
 * Requirements: 1.2, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.9, 19.10, 19.11, 19.12, 8.7
 */
export function BookingCalendar({
  collectionType,
  onSlotSelect,
  selectedSlot,
}: BookingCalendarProps) {
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<{
    start: string;
    end: string;
    timezone: string;
  } | null>(null);

  /**
   * Fetches available slots from the API
   */
  const fetchSlots = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/calendar/available-slots');
      const data: AvailableSlotsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch available slots');
      }

      setSlots(data.slots);
      setBusinessHours(data.businessHours);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots on mount
  useEffect(() => {
    fetchSlots();
  }, []);

  /**
   * Formats a date string (YYYY-MM-DD) to user-friendly format
   * Example: "2024-01-15" -> "Monday, Jan 15, 2024"
   */
  const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  /**
   * Checks if a slot is currently selected
   */
  const isSlotSelected = (slot: TimeSlot): boolean => {
    if (!selectedSlot) return false;
    return (
      slot.start === selectedSlot.start &&
      slot.end === selectedSlot.end &&
      slot.date === selectedSlot.date
    );
  };

  /**
   * Handles slot selection
   */
  const handleSlotClick = (slot: TimeSlot) => {
    onSlotSelect(slot);
  };

  /**
   * Handles refresh button click
   */
  const handleRefresh = () => {
    fetchSlots();
  };

  // Get sorted dates for display
  const sortedDates = Object.keys(slots).sort();

  return (
    <div className="booking-calendar">
      {/* Header with business hours and refresh button */}
      <div className="booking-calendar__header">
        {businessHours && (
          <div className="booking-calendar__business-hours">
            <p className="booking-calendar__hours-text">
              Business Hours: {businessHours.start} - {businessHours.end}
            </p>
            <p className="booking-calendar__timezone">
              {businessHours.timezone}
            </p>
          </div>
        )}
        <button
          type="button"
          className="booking-calendar__refresh"
          onClick={handleRefresh}
          disabled={loading}
          aria-label="Refresh available slots"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={loading ? 'booking-calendar__refresh-icon--spinning' : ''}
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="booking-calendar__loading" role="status" aria-live="polite">
          <div className="booking-calendar__spinner" aria-hidden="true" />
          <p>Loading available slots...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="booking-calendar__error" role="alert">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn--outline"
            onClick={handleRefresh}
            aria-label="Retry loading available slots"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Slots display */}
      {!loading && !error && (
        <div className="booking-calendar__slots">
          {sortedDates.length === 0 ? (
            <div className="booking-calendar__no-slots">
              <p>No available slots found for the next 14 days.</p>
              <p className="booking-calendar__no-slots-hint">
                Please check back later or contact us directly.
              </p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="booking-calendar__date-group">
                <h3 className="booking-calendar__date-header">
                  {formatDateDisplay(date)}
                </h3>
                <div className="booking-calendar__time-slots">
                  {slots[date] && slots[date].length > 0 ? (
                    slots[date].map((slot) => (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        type="button"
                        className={`booking-calendar__slot ${
                          isSlotSelected(slot)
                            ? 'booking-calendar__slot--selected'
                            : ''
                        }`}
                        onClick={() => handleSlotClick(slot)}
                        aria-pressed={isSlotSelected(slot)}
                        aria-label={`Select ${slot.time} on ${formatDateDisplay(date)}`}
                      >
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <p className="booking-calendar__no-availability">
                      No availability
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
