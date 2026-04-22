'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import { useToast } from './toast';

export interface TimeSlot {
  start: string;
  end: string;
  date: string;
  time: string;
}

export type CollectionType = 'bespoke' | 'bridal' | 'rtw';

export interface BookingCalendarProps {
  collectionType: CollectionType;
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot?: TimeSlot;
}

interface AvailableSlotsResponse {
  success: boolean;
  slots: Record<string, TimeSlot[]>;
  businessHours: { start: string; end: string; timezone: string };
  error?: string;
}

const slotBtn = (selected: boolean) =>
  [
    'px-4 py-2 rounded-[10px] text-sm font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]',
    selected
      ? 'bg-[var(--brand)] border-[var(--brand)] text-[#111]'
      : 'bg-[var(--bg)] border-[var(--border)] text-[var(--text)] hover:border-[var(--brand)] hover:text-[var(--brand)]',
  ].join(' ');

export function BookingCalendar({ collectionType, onSlotSelect, selectedSlot }: BookingCalendarProps) {
  const { toast } = useToast();
  const [slots, setSlots] = useState<Record<string, TimeSlot[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<{ start: string; end: string; timezone: string } | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/calendar/available-slots');
      const data: AvailableSlotsResponse = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch available slots');
      setSlots(data.slots);
      setBusinessHours(data.businessHours);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(msg);
      toast({ type: 'error', title: 'Could not load slots', message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  const isSelected = (slot: TimeSlot) =>
    selectedSlot ? slot.start === selectedSlot.start && slot.date === selectedSlot.date : false;

  const sortedDates = Object.keys(slots).sort();

  return (
    <div className="mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {businessHours && (
          <div>
            <p className="text-sm text-[var(--text)]">Business Hours: {businessHours.start} – {businessHours.end}</p>
            <p className="text-xs text-[var(--muted)]">{businessHours.timezone}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchSlots}
          disabled={loading}
          aria-label="Refresh available slots"
          className="flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            className={loading ? 'animate-spin' : ''}>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-8 justify-center text-[var(--muted)]" role="status" aria-live="polite">
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Loading available slots...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px]" role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-sm text-red-700 dark:text-red-300 mb-2">{error}</p>
            <Button variant="ghost" size="sm" onClick={fetchSlots}>Try Again</Button>
          </div>
        </div>
      )}

      {/* Slots */}
      {!loading && !error && (
        <div className="flex flex-col gap-6">
          {sortedDates.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted)]">
              <p>No available slots found for the next 14 days.</p>
              <p className="text-sm mt-1">Please check back later or contact us directly.</p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3 pb-2 border-b border-[var(--border)]">
                  {formatDate(date)}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {slots[date]?.length ? (
                    slots[date].map((slot) => (
                      <button
                        key={`${slot.start}-${slot.end}`}
                        type="button"
                        className={slotBtn(isSelected(slot))}
                        onClick={() => onSlotSelect(slot)}
                        aria-pressed={isSelected(slot)}
                        aria-label={`Select ${slot.time} on ${formatDate(date)}`}
                      >
                        {slot.time}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-[var(--muted)]">No availability</p>
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
