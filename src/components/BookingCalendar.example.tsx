/**
 * BookingCalendar Component Usage Example
 * 
 * This file demonstrates how to use the BookingCalendar component
 * in a consultation booking page.
 * 
 * Requirements: 1.2, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.9, 19.10, 19.11, 19.12, 8.7
 */

'use client';

import { useState } from 'react';
import { BookingCalendar, TimeSlot, CollectionType } from './BookingCalendar';

export function BookingCalendarExample() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>();
  const [collectionType] = useState<CollectionType>('bespoke');

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    console.log('Selected slot:', slot);
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1>Consultation Booking</h1>
      <p>Select an available time slot for your consultation.</p>

      <BookingCalendar
        collectionType={collectionType}
        onSlotSelect={handleSlotSelect}
        selectedSlot={selectedSlot}
      />

      {selectedSlot && (
        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--card)', borderRadius: 'var(--radius)' }}>
          <h3>Selected Slot:</h3>
          <p>Date: {selectedSlot.date}</p>
          <p>Time: {selectedSlot.time}</p>
          <p>Start: {new Date(selectedSlot.start).toLocaleString()}</p>
          <p>End: {new Date(selectedSlot.end).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
