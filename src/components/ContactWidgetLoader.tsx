'use client';

import dynamic from 'next/dynamic';

// Lazy load ContactWidget to avoid blocking page render (Requirement 16.11)
const ContactWidget = dynamic(
  () => import('./ContactWidget'),
  { ssr: false }
);

export function ContactWidgetLoader() {
  return <ContactWidget />;
}
