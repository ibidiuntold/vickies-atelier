'use client';

import { useState, useEffect, useRef } from 'react';

interface ContactWidgetProps {
  position?: 'bottom-right' | 'bottom-left';
  offset?: { x: number; y: number };
}

export function ContactWidget({ 
  position = 'bottom-right',
  offset = { x: 20, y: 20 }
}: ContactWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Show tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isExpanded) {
        setShowTooltip(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isExpanded]);

  // Hide tooltip when widget is expanded or after 5 seconds
  useEffect(() => {
    if (showTooltip && !isExpanded) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showTooltip, isExpanded]);

  // Click outside to collapse
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded]);

  // Keyboard accessibility - Escape to close
  useEffect(() => {
    if (!isExpanded) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  const positionStyles = {
    'bottom-right': { bottom: `${offset.y}px`, right: `${offset.x}px` },
    'bottom-left': { bottom: `${offset.y}px`, left: `${offset.x}px` }
  };

  return (
    <div 
      ref={widgetRef}
      className="contact-widget"
      style={positionStyles[position]}
      role="complementary"
      aria-label="Contact options"
    >
      {/* Collapsed state - icon button */}
      {!isExpanded && (
        <>
          <button
            className="contact-widget__trigger"
            onClick={() => {
              setIsExpanded(true);
              setShowTooltip(false);
            }}
            aria-label="Open contact options"
            aria-expanded="false"
          >
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>

          {/* Tooltip */}
          {showTooltip && (
            <div 
              className="contact-widget__tooltip"
              role="tooltip"
              aria-live="polite"
            >
              Want to contact us? Click me!
            </div>
          )}
        </>
      )}

      {/* Expanded state - contact options */}
      {isExpanded && (
        <div className="contact-widget__panel" role="dialog" aria-label="Contact information">
          <div className="contact-widget__header">
            <h3 className="contact-widget__title">Get in Touch</h3>
            <button
              className="contact-widget__close"
              onClick={() => setIsExpanded(false)}
              aria-label="Close contact options"
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
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="contact-widget__content">
            {/* Email */}
            <a 
              href="mailto:vickiesatelier@gmail.com"
              className="contact-widget__item"
              aria-label="Send email to vickiesatelier@gmail.com"
            >
              <div className="contact-widget__icon">
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
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="contact-widget__text">
                <span className="contact-widget__label">Email</span>
                <span className="contact-widget__value">vickiesatelier@gmail.com</span>
              </div>
            </a>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/2348118660080"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-widget__item"
              aria-label="Contact via WhatsApp at 08118660080"
            >
              <div className="contact-widget__icon">
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
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <div className="contact-widget__text">
                <span className="contact-widget__label">WhatsApp</span>
                <span className="contact-widget__value">08118660080</span>
              </div>
            </a>

            {/* Phone */}
            <a 
              href="tel:+2348160742412"
              className="contact-widget__item"
              aria-label="Call 081607422412"
            >
              <div className="contact-widget__icon">
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
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="contact-widget__text">
                <span className="contact-widget__label">Call</span>
                <span className="contact-widget__value">081607422412</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
