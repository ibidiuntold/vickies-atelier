'use client';

import { useState, useEffect, useRef } from 'react';

interface ContactWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
}

export default function ContactWidget({
  position = 'bottom-right',
  offset = { x: 20, y: 20 },
}: ContactWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => { if (!isExpanded) setShowTooltip(true); }, 5000);
    return () => clearTimeout(t);
  }, [isExpanded]);

  useEffect(() => {
    if (!showTooltip || isExpanded) return;
    const t = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(t);
  }, [showTooltip, isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) setIsExpanded(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsExpanded(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isExpanded]);

  const posStyle = position === 'bottom-right'
    ? { bottom: offset.y, right: offset.x }
    : { bottom: offset.y, left: offset.x };

  const itemClass = "flex items-center gap-3 p-3 rounded-[10px] text-[var(--text)] hover:bg-[var(--bg-tertiary)] transition-colors duration-150 no-underline";
  const iconWrap = "w-9 h-9 rounded-full bg-[var(--brand-subtle)] flex items-center justify-center text-[var(--brand)] shrink-0";

  return (
    <div
      ref={widgetRef}
      className="fixed z-50"
      style={posStyle}
      role="complementary"
      aria-label="Contact options"
    >
      {/* Collapsed */}
      {!isExpanded && (
        <div className="relative">
          <button
            onClick={() => { setIsExpanded(true); setShowTooltip(false); }}
            aria-label="Open contact options"
            aria-expanded={false}
            className="w-14 h-14 rounded-full bg-[var(--brand)] text-[#111] flex items-center justify-center shadow-lg hover:bg-[var(--brand-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          {showTooltip && (
            <div className="absolute bottom-full mb-2 right-0 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-sm px-3 py-2 rounded-[10px] shadow-md whitespace-nowrap" role="tooltip" aria-live="polite">
              Want to contact us? Click me!
            </div>
          )}
        </div>
      )}

      {/* Expanded */}
      {isExpanded && (
        <div className="w-72 bg-[var(--bg)] border border-[var(--border)] rounded-[18px] shadow-xl overflow-hidden" role="dialog" aria-label="Contact information">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <h3 className="font-semibold text-[var(--text)] text-sm">Get in Touch</h3>
            <button onClick={() => setIsExpanded(false)} aria-label="Close contact options"
              className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Items */}
          <div className="p-2 flex flex-col gap-1">
            <a href="mailto:vickiesatelier@gmail.com" className={itemClass} aria-label="Send email to vickiesatelier@gmail.com">
              <div className={iconWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--muted)]">Email</span>
                <span className="text-sm font-medium">vickiesatelier@gmail.com</span>
              </div>
            </a>

            <a href="https://wa.me/2348118660080" target="_blank" rel="noopener noreferrer" className={itemClass} aria-label="Contact via WhatsApp">
              <div className={iconWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--muted)]">WhatsApp</span>
                <span className="text-sm font-medium">08118660080</span>
              </div>
            </a>

            <a href="tel:+2348160742412" className={itemClass} aria-label="Call 08160742412">
              <div className={iconWrap}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[var(--muted)]">Call</span>
                <span className="text-sm font-medium">08160742412</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
