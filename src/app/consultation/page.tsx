'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingCalendar, type TimeSlot, type CollectionType } from '@/components/BookingCalendar';

/**
 * Form data interface for consultation booking
 */
interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  collectionType: CollectionType;
}

/**
 * Form validation errors
 */
interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  collectionType?: string;
  slot?: string;
}

/**
 * Inner component that uses useSearchParams
 */
function ConsultationPageContent() {
  const searchParams = useSearchParams();
  
  // Get collection from URL query parameter
  const collectionParam = searchParams.get('collection');
  const initialCollection: CollectionType = 
    collectionParam === 'bridal' || collectionParam === 'rtw' 
      ? collectionParam 
      : 'bespoke';
  
  // Form state
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    collectionType: initialCollection,
  });

  // Selected time slot
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Form validation errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Submission state
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  /**
   * Validates email format
   * Requirements: 17.2
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  /**
   * Validates phone format
   * Requirements: 17.7
   */
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = phone.trim().replace(/\D/g, '');
    return phoneRegex.test(phone.trim()) && digitsOnly.length >= 10;
  };

  /**
   * Validates the entire form
   * Requirements: 17.1, 17.8, 17.9, 17.10
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    // Validate collection type
    if (!formData.collectionType) {
      newErrors.collectionType = 'Please select a collection type';
    }

    // Validate time slot selection
    if (!selectedSlot) {
      newErrors.slot = 'Please select an available time slot';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form field changes
   * Requirements: 17.9
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handles time slot selection
   */
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    // Clear slot error when user selects a slot
    if (errors.slot) {
      setErrors((prev) => ({ ...prev, slot: undefined }));
    }
  };

  /**
   * Handles form submission
   * Requirements: 1.4, 1.8, 17.4, 17.5, 17.6, 17.12
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: selectedSlot!.start,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          collectionType: formData.collectionType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to book consultation');
      }

      // Success!
      setStatus('success');
      setSuccessMessage(
        data.message ||
          'Consultation booked successfully! Check your email for confirmation.'
      );

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        collectionType: 'bespoke',
      });
      setSelectedSlot(null);
    } catch (err) {
      // Error - preserve customer input
      console.error('Booking error:', err);
      setStatus('error');
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to book consultation. Please try again.'
      );
    }
  };

  /**
   * Handles retry after error
   * Requirements: 17.12
   */
  const handleRetry = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  // Check if all required fields are filled
  const isFormValid = 
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    (formData.collectionType === 'bespoke' || formData.collectionType === 'bridal' || formData.collectionType === 'rtw') &&
    selectedSlot !== null;

  return (
    <div className="consultation-page">
      <div className="container">
        <div className="consultation-page__header">
          <h1 className="consultation-page__title">Book a Consultation</h1>
          <p className="consultation-page__subtitle">
            Schedule a personalized consultation with our CEO to discuss your outfit
            requirements. Choose your preferred time and provide your details below.
          </p>
        </div>

        {/* Success message */}
        {status === 'success' && (
          <div className="consultation-page__success" role="alert">
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <h2>Booking Confirmed!</h2>
              <p>{successMessage}</p>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setStatus('idle');
                  setSuccessMessage('');
                }}
              >
                Book Another Consultation
              </button>
            </div>
          </div>
        )}

        {/* Booking form */}
        {status !== 'success' && (
          <form className="consultation-page__form" onSubmit={handleSubmit}>
            {/* Customer Information Section */}
            <div className="consultation-page__section">
              <h2 className="consultation-page__section-title">Your Information</h2>

              <div className="form-field">
                <label htmlFor="name">
                  Name <span className="form-field__required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" className="form-field__error" role="alert">
                    {errors.name}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="email">
                  Email <span className="form-field__required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" className="form-field__error" role="alert">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="phone">
                  Phone Number <span className="form-field__required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="08118660080"
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <span id="phone-error" className="form-field__error" role="alert">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="collectionType">
                  Collection Type <span className="form-field__required">*</span>
                </label>
                <select
                  id="collectionType"
                  name="collectionType"
                  value={formData.collectionType}
                  onChange={handleInputChange}
                  aria-required="true"
                  aria-invalid={!!errors.collectionType}
                  aria-describedby={
                    errors.collectionType ? 'collectionType-error' : undefined
                  }
                >
                  <option value="bespoke">Bespoke (45 minutes)</option>
                  <option value="bridal">Bridal (60 minutes)</option>
                  <option value="rtw">Ready-to-Wear (30 minutes)</option>
                </select>
                {errors.collectionType && (
                  <span
                    id="collectionType-error"
                    className="form-field__error"
                    role="alert"
                  >
                    {errors.collectionType}
                  </span>
                )}
              </div>
            </div>

            {/* Calendar Section */}
            <div className="consultation-page__section">
              <h2 className="consultation-page__section-title">
                Select Your Preferred Time
              </h2>
              {errors.slot && (
                <div className="form-field__error" role="alert">
                  {errors.slot}
                </div>
              )}
              <BookingCalendar
                collectionType={formData.collectionType}
                onSlotSelect={handleSlotSelect}
                selectedSlot={selectedSlot || undefined}
              />
            </div>

            {/* Error message with retry */}
            {status === 'error' && (
              <div className="consultation-page__error" role="alert">
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
                <div>
                  <p>{errorMessage}</p>
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={handleRetry}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <div className="consultation-page__actions">
              <button
                type="submit"
                className="btn"
                disabled={status === 'loading' || !isFormValid}
                title={!isFormValid ? "Please fill in all required fields and select a time slot" : ""}
              >
                {status === 'loading' ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * Consultation Booking Page
 * 
 * Full-featured booking page that integrates the BookingCalendar component
 * with a customer information form.
 * 
 * Features:
 * - Customer information form (name, email, phone)
 * - Collection type selector (Bespoke, Bridal, Ready-to-Wear)
 * - Integrated BookingCalendar component
 * - Form validation (email format, phone format, required fields)
 * - Submit button with loading state
 * - Confirmation message on successful booking
 * - Error handling with retry option
 * - Preserves customer input on errors
 * - Pre-selects collection type from URL query parameter
 * 
 * Requirements: 1.1, 1.5, 1.8, 1.10, 9.2, 9.8, 17.2, 17.4, 17.5, 17.7, 17.12
 */
export default function ConsultationPage() {
  return (
    <Suspense fallback={
      <div className="consultation-page">
        <div className="container">
          <div className="consultation-page__header">
            <h1 className="consultation-page__title">Book a Consultation</h1>
            <p className="consultation-page__subtitle">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <ConsultationPageContent />
    </Suspense>
  );
}
