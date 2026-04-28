'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingCalendar, type TimeSlot, type CollectionType } from '@/components/BookingCalendar';
import Button from '@/components/Button';
import { useToast } from '@/components/toast';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  collectionType: CollectionType;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  collectionType?: string;
  slot?: string;
}

const inputCls = (err?: string) =>
  `w-full mt-1 px-4 py-2 rounded-[10px] bg-[var(--bg)] border text-[var(--text)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-colors duration-150 ${err ? 'border-red-500' : 'border-[var(--border)]'}`;

const btnPrimary = 'inline-flex items-center justify-center px-6 py-3 rounded-[18px] bg-[var(--brand)] text-[#111] font-medium hover:bg-[var(--brand-hover)] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200';
const btnOutline = 'inline-flex items-center justify-center px-5 py-2 rounded-[14px] border border-[var(--border)] text-[var(--text)] text-sm font-medium hover:border-[var(--brand)] hover:text-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] transition-all duration-200';

function ConsultationPageContent() {
  const searchParams = useSearchParams();
  const collectionParam = searchParams.get('collection');
  const initialCollection: CollectionType =
    collectionParam === 'bridal' || collectionParam === 'rtw' ? collectionParam : 'bespoke';

  const { toast } = useToast();
  const [formData, setFormData] = useState<BookingFormData>({ name: '', email: '', phone: '', collectionType: initialCollection });
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  const validatePhone = (p: string) => {
    const digits = p.trim().replace(/\D/g, '');
    return /^[\d\s\-\+\(\)]+$/.test(p.trim()) && digits.length >= 10;
  };

  const validateForm = () => {
    const e: FormErrors = {};
    if (!formData.name.trim()) e.name = 'Name is required';
    else if (formData.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!validateEmail(formData.email)) e.email = 'Please enter a valid email address';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) e.phone = 'Please enter a valid phone number (at least 10 digits)';
    if (!formData.collectionType) e.collectionType = 'Please select a collection type';
    if (!selectedSlot) e.slot = 'Please select an available time slot';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    if (errors.slot) setErrors((p) => ({ ...p, slot: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus('loading');
    setErrorMessage('');
    try {
      const res = await fetch('/api/calendar/book', {
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
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to book consultation');
      setStatus('success');
      setSuccessMessage(data.message || 'Consultation booked successfully! Check your email for confirmation.');
      toast({ type: 'success', title: 'Consultation booked!', message: 'Check your email for confirmation.' });
      setFormData({ name: '', email: '', phone: '', collectionType: 'bespoke' });
      setSelectedSlot(null);
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Failed to book consultation. Please try again.';
      setErrorMessage(msg);
      toast({ type: 'error', title: 'Booking failed', message: msg });
    }
  };

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.phone.trim() !== '' &&
    !!formData.collectionType &&
    selectedSlot !== null;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-16">
      <div className="max-w-[720px] mx-auto px-6">
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(28px,3vw,40px)] font-semibold text-[var(--text)] mb-3">Book a Consultation</h1>
          <p className="text-[var(--muted)]">Schedule a personalized consultation with our CEO to discuss your outfit requirements. Choose your preferred time and provide your details below.</p>
        </div>

        {/* Success */}
        {status === 'success' && (
          <div className="flex items-start gap-4 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[18px] mb-8" role="alert">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 shrink-0 mt-0.5" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <div>
              <h2 className="font-semibold text-green-800 dark:text-green-200 mb-1">Booking Confirmed!</h2>
              <p className="text-green-700 dark:text-green-300 text-sm mb-3">{successMessage}</p>
              <Button variant="primary" size="md" onClick={() => { setStatus('idle'); setSuccessMessage(''); }}>
                Book Another Consultation
              </Button>
            </div>
          </div>
        )}

        {/* Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Your Information */}
            <div className="bg-[var(--bg-secondary)] rounded-[18px] border border-[var(--border)] p-6">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--text)] mb-5">Your Information</h2>
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-[var(--text)]">Name <span className="text-red-500">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
                    placeholder="Your full name" aria-required="true" aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined} className={inputCls(errors.name)} />
                  {errors.name && <span id="name-error" className="text-red-500 text-xs mt-1 block" role="alert">{errors.name}</span>}
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-[var(--text)]">Email <span className="text-red-500">*</span></label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                    placeholder="you@example.com" aria-required="true" aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined} className={inputCls(errors.email)} />
                  {errors.email && <span id="email-error" className="text-red-500 text-xs mt-1 block" role="alert">{errors.email}</span>}
                </div>
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="text-sm font-medium text-[var(--text)]">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                    placeholder="08118660080" aria-required="true" aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined} className={inputCls(errors.phone)} />
                  {errors.phone && <span id="phone-error" className="text-red-500 text-xs mt-1 block" role="alert">{errors.phone}</span>}
                </div>
                {/* Collection */}
                <div>
                  <label htmlFor="collectionType" className="text-sm font-medium text-[var(--text)]">Collection Type <span className="text-red-500">*</span></label>
                  <select id="collectionType" name="collectionType" value={formData.collectionType} onChange={handleInputChange}
                    aria-required="true" aria-invalid={!!errors.collectionType}
                    aria-describedby={errors.collectionType ? 'collectionType-error' : undefined}
                    className={inputCls(errors.collectionType)}>
                    <option value="bespoke">Bespoke (45 minutes)</option>
                    <option value="bridal">Bridal (60 minutes)</option>
                    <option value="rtw">Ready-to-Wear (30 minutes)</option>
                  </select>
                  {errors.collectionType && <span id="collectionType-error" className="text-red-500 text-xs mt-1 block" role="alert">{errors.collectionType}</span>}
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-[var(--bg-secondary)] rounded-[18px] border border-[var(--border)] p-6">
              <h2 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[var(--text)] mb-2">Select Your Preferred Time</h2>
              {errors.slot && <p className="text-red-500 text-sm mb-3" role="alert">{errors.slot}</p>}
              <BookingCalendar collectionType={formData.collectionType} onSlotSelect={handleSlotSelect} selectedSlot={selectedSlot || undefined} />
            </div>

            {/* Error */}
            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px]" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-2">{errorMessage}</p>
                  <Button variant="ghost" size="sm" onClick={() => { setStatus('idle'); setErrorMessage(''); }}>
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={status === 'loading'}
                disabled={status === 'loading' || !isFormValid}
                title={!isFormValid ? 'Please fill in all required fields and select a time slot' : ''}
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg)] py-16">
        <div className="max-w-[720px] mx-auto px-6">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-semibold text-[var(--text)] mb-3">Book a Consultation</h1>
          <p className="text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    }>
      <ConsultationPageContent />
    </Suspense>
  );
}
