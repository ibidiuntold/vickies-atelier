import nodemailer from "nodemailer";
import type { OrderEmailData } from "@/types";

const COLLECTION_LABELS: Record<string, string> = {
  bespoke: "Bespoke",
  bridal: "Bridal",
  rtw: "Ready-to-Wear",
};

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function customerTemplate(data: OrderEmailData): string {
  const collectionLabel = COLLECTION_LABELS[data.collection] ?? data.collection;
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmed — Vickie's Atelier</title>
</head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:Georgia,serif;color:#f7f7f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #262626;border-radius:18px;overflow:hidden;max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c7a17a,#e7d7c9);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#111;letter-spacing:1px;">
                VICKIE'S ATELIER
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:#333;letter-spacing:2px;text-transform:uppercase;">
                bespoke &bull; bridal &bull; ready-to-wear
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#e7d7c9;margin:0 0 12px;">
                Your Order is Confirmed
              </h2>
              <p style="color:#c9c9c9;margin:0 0 24px;line-height:1.7;">
                Dear <strong style="color:#f7f7f7;">${data.name}</strong>,<br/><br/>
                Thank you for placing your <strong style="color:#c7a17a;">${collectionLabel}</strong> order with Vickie's Atelier.
                We are delighted to bring your vision to life.
              </p>

              <!-- Ready date highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(199,161,122,0.1);border:1px solid rgba(199,161,122,0.3);border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <p style="margin:0 0 4px;font-size:12px;color:#c9c9c9;text-transform:uppercase;letter-spacing:1px;">Estimated Ready Date</p>
                    <p style="margin:0;font-size:22px;font-weight:700;color:#c7a17a;">${data.readyDate}</p>
                  </td>
                </tr>
              </table>

              <!-- Measurements summary -->
              <h3 style="font-family:Georgia,serif;font-size:16px;color:#e7d7c9;margin:0 0 14px;">
                Your Measurements
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px;">
                ${[
                  ["Bust", data.bust],
                  ["Waist", data.waist],
                  ["Hips", data.hips],
                  ["Height", data.height],
                  ["Shoulder Width", data.shoulder],
                  ["Sleeve Length", data.sleeve],
                  ["Inseam", data.inseam],
                ]
                  .filter(([, v]) => v)
                  .map(
                    ([label, value]) => `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #262626;color:#c9c9c9;font-size:14px;">${label}</td>
                  <td style="padding:8px 0;border-bottom:1px solid #262626;color:#f7f7f7;font-size:14px;text-align:right;">${value} cm</td>
                </tr>`
                  )
                  .join("")}
                ${
                  data.notes
                    ? `<tr>
                  <td style="padding:8px 0;color:#c9c9c9;font-size:14px;vertical-align:top;">Notes</td>
                  <td style="padding:8px 0;color:#f7f7f7;font-size:14px;text-align:right;">${data.notes}</td>
                </tr>`
                    : ""
                }
              </table>

              <p style="color:#c9c9c9;margin:0 0 8px;line-height:1.7;font-size:14px;">
                Our team will contact you shortly to schedule your fitting appointment.
                If you have any questions in the meantime, please reach out to us at
                <a href="mailto:hello@vickiesatelier.com" style="color:#c7a17a;">hello@vickiesatelier.com</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #262626;text-align:center;">
              <p style="margin:0;font-size:12px;color:#666;">
                &copy; ${new Date().getFullYear()} Vickie's Atelier &bull; Lagos &bull; By appointment only
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function adminTemplate(data: OrderEmailData): string {
  const collectionLabel = COLLECTION_LABELS[data.collection] ?? data.collection;
  const hasPhotos = data.photoAttachments && data.photoAttachments.length > 0;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:Georgia,serif;color:#f7f7f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #262626;border-radius:18px;overflow:hidden;max-width:600px;">
          <tr>
            <td style="background:#1a1a1a;padding:24px 40px;border-bottom:1px solid #262626;">
              <h2 style="margin:0;font-family:Georgia,serif;font-size:20px;color:#c7a17a;">
                New ${collectionLabel} Order
              </h2>
              <p style="margin:4px 0 0;color:#c9c9c9;font-size:13px;">${new Date().toLocaleString()}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px;">
              ${hasPhotos ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(199,161,122,0.1);border:1px solid rgba(199,161,122,0.3);border-radius:12px;margin-bottom:20px;">
                <tr>
                  <td style="padding:16px 20px;text-align:center;">
                    <p style="margin:0;font-size:14px;color:#c7a17a;font-weight:600;">
                      📷 ${data.photoAttachments!.length} measurement photo${data.photoAttachments!.length > 1 ? 's' : ''} attached
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                ${[
                  ["Customer Name", data.name],
                  ["Email", data.email],
                  ["Collection", collectionLabel],
                  ["Estimated Ready Date", data.readyDate],
                  ["Bust", data.bust ? `${data.bust} cm` : "—"],
                  ["Waist", data.waist ? `${data.waist} cm` : "—"],
                  ["Hips", data.hips ? `${data.hips} cm` : "—"],
                  ["Height", data.height ? `${data.height} cm` : "—"],
                  ["Shoulder Width", data.shoulder ? `${data.shoulder} cm` : "—"],
                  ["Sleeve Length", data.sleeve ? `${data.sleeve} cm` : "—"],
                  ["Inseam", data.inseam ? `${data.inseam} cm` : "—"],
                  ["Notes", data.notes || "—"],
                ]
                  .map(
                    ([label, value]) => `
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #262626;color:#c9c9c9;font-size:14px;width:40%;">${label}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #262626;color:#f7f7f7;font-size:14px;">${value}</td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;border-top:1px solid #262626;text-align:center;">
              <p style="margin:0;font-size:12px;color:#666;">Vickie's Atelier — Order Management</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderEmails(data: OrderEmailData): Promise<void> {
  const transporter = getTransporter();

  // Prepare attachments if photos are provided
  const attachments = data.photoAttachments?.map((filepath, index) => ({
    filename: `measurement-photo-${index + 1}.jpg`,
    path: filepath,
  })) || [];

  await transporter.sendMail({
    from: `"Vickie's Atelier" <${process.env.SMTP_USER}>`,
    to: data.email,
    subject: `Your order is confirmed — Vickie's Atelier`,
    html: customerTemplate(data),
  });

  if (data.adminEmail) {
    await transporter.sendMail({
      from: `"Vickie's Atelier Orders" <${process.env.SMTP_USER}>`,
      to: data.adminEmail,
      subject: `New ${COLLECTION_LABELS[data.collection] ?? data.collection} order from ${data.name}`,
      html: adminTemplate(data),
      attachments, // Attach photos to admin email
    });
  }
}

/**
 * Booking email data interface
 */
export interface BookingEmailData {
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    collectionType: string;
  };
  eventDetails: {
    eventId: string;
    eventLink: string;
    startTime: string;
    endTime: string;
  };
}

/**
 * Generates an iCalendar (.ics) file content for a consultation booking
 * 
 * The .ics file follows the RFC 5545 iCalendar specification and includes:
 * - Event details (date, time, duration)
 * - Customer and organizer information
 * - Location details
 * - 24-hour reminder alarm
 * 
 * The generated file can be imported into any calendar application
 * (Google Calendar, Outlook, Apple Calendar, etc.)
 * 
 * Requirements: 10.7 (calendar invite attachment)
 * 
 * @param data - Booking email data
 * @returns iCalendar format string (RFC 5545 compliant)
 */
function generateICalendar(data: BookingEmailData): string {
  const collectionLabel = COLLECTION_LABELS[data.customerDetails.collectionType] ?? data.customerDetails.collectionType;
  
  // Format dates for iCalendar (YYYYMMDDTHHMMSSZ format in UTC)
  const formatICalDate = (isoString: string): string => {
    return new Date(isoString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startTime = formatICalDate(data.eventDetails.startTime);
  const endTime = formatICalDate(data.eventDetails.endTime);
  const now = formatICalDate(new Date().toISOString());

  // Generate unique identifier
  const uid = `${data.eventDetails.eventId}@vickiesatelier.com`;

  // Build iCalendar content
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vickie\'s Atelier//Consultation Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${collectionLabel} Consultation - Vickie's Atelier`,
    `DESCRIPTION:Consultation for ${collectionLabel} collection with Vickie's Atelier.\\n\\nCustomer: ${data.customerDetails.name}\\nPhone: ${data.customerDetails.phone}\\n\\nLocation: Vickie's Atelier\\, Lagos\\n\\nFor questions\\, contact:\\nEmail: vickiesatelier@gmail.com\\nWhatsApp: 08118660080`,
    'LOCATION:Vickie\'s Atelier, Lagos',
    `ORGANIZER;CN=Vickie's Atelier:mailto:${process.env.SMTP_USER || 'vickiesatelier@gmail.com'}`,
    `ATTENDEE;CN=${data.customerDetails.name};RSVP=TRUE:mailto:${data.customerDetails.email}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Consultation with Vickie\'s Atelier tomorrow',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

/**
 * Formats a date/time string for display
 */
function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  };
  return date.toLocaleString("en-US", options);
}

/**
 * Customer booking confirmation email template
 */
function bookingCustomerTemplate(data: BookingEmailData): string {
  const collectionLabel = COLLECTION_LABELS[data.customerDetails.collectionType] ?? data.customerDetails.collectionType;
  const startDateTime = formatDateTime(data.eventDetails.startTime);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Consultation Confirmed — Vickie's Atelier</title>
</head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:Georgia,serif;color:#f7f7f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #262626;border-radius:18px;overflow:hidden;max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#c7a17a,#e7d7c9);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#111;letter-spacing:1px;">
                VICKIE'S ATELIER
              </h1>
              <p style="margin:6px 0 0;font-size:13px;color:#333;letter-spacing:2px;text-transform:uppercase;">
                bespoke &bull; bridal &bull; ready-to-wear
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#e7d7c9;margin:0 0 12px;">
                Your Consultation is Confirmed
              </h2>
              <p style="color:#c9c9c9;margin:0 0 24px;line-height:1.7;">
                Dear <strong style="color:#f7f7f7;">${data.customerDetails.name}</strong>,<br/><br/>
                Thank you for booking a consultation with Vickie's Atelier. We look forward to discussing your <strong style="color:#c7a17a;">${collectionLabel}</strong> vision with you.
              </p>

              <!-- Appointment details highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(199,161,122,0.1);border:1px solid rgba(199,161,122,0.3);border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 4px;font-size:12px;color:#c9c9c9;text-transform:uppercase;letter-spacing:1px;">Appointment Date & Time</p>
                    <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#c7a17a;">${startDateTime}</p>
                    <p style="margin:0;font-size:13px;color:#c9c9c9;">
                      <strong style="color:#e7d7c9;">Collection Type:</strong> ${collectionLabel}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Calendar link -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${data.eventDetails.eventLink}" style="display:inline-block;padding:14px 32px;background:#c7a17a;color:#111;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
                      Add to Calendar
                    </a>
                  </td>
                </tr>
              </table>

              <h3 style="font-family:Georgia,serif;font-size:16px;color:#e7d7c9;margin:0 0 14px;">
                What to Expect
              </h3>
              <p style="color:#c9c9c9;margin:0 0 16px;line-height:1.7;font-size:14px;">
                During your consultation, we will:
              </p>
              <ul style="color:#c9c9c9;margin:0 0 24px;padding-left:20px;line-height:1.8;font-size:14px;">
                <li>Discuss your style preferences and vision</li>
                <li>Review fabric options and design details</li>
                <li>Take precise measurements if needed</li>
                <li>Provide timeline and pricing information</li>
              </ul>

              <p style="color:#c9c9c9;margin:0 0 8px;line-height:1.7;font-size:14px;">
                If you need to reschedule or have any questions, please contact us at
                <a href="mailto:vickiesatelier@gmail.com" style="color:#c7a17a;">vickiesatelier@gmail.com</a>
                or call <a href="tel:+2348118660080" style="color:#c7a17a;">08118660080</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #262626;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#c9c9c9;">
                <strong>Contact Us</strong><br/>
                Email: vickiesatelier@gmail.com<br/>
                WhatsApp: 08118660080 &bull; Call: 081607422412
              </p>
              <p style="margin:0;font-size:12px;color:#666;">
                &copy; ${new Date().getFullYear()} Vickie's Atelier &bull; Lagos &bull; By appointment only
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * CEO booking notification email template
 */
function bookingAdminTemplate(data: BookingEmailData): string {
  const collectionLabel = COLLECTION_LABELS[data.customerDetails.collectionType] ?? data.customerDetails.collectionType;
  const startDateTime = formatDateTime(data.eventDetails.startTime);

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0c0c0c;font-family:Georgia,serif;color:#f7f7f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0c0c0c;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #262626;border-radius:18px;overflow:hidden;max-width:600px;">
          <tr>
            <td style="background:#1a1a1a;padding:24px 40px;border-bottom:1px solid #262626;">
              <h2 style="margin:0;font-family:Georgia,serif;font-size:20px;color:#c7a17a;">
                New ${collectionLabel} Consultation Booking
              </h2>
              <p style="margin:4px 0 0;color:#c9c9c9;font-size:13px;">${new Date().toLocaleString()}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 40px;">
              <!-- Appointment time highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(199,161,122,0.1);border:1px solid rgba(199,161,122,0.3);border-radius:12px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:11px;color:#c9c9c9;text-transform:uppercase;letter-spacing:1px;">Appointment Time</p>
                    <p style="margin:0;font-size:16px;font-weight:700;color:#c7a17a;">${startDateTime}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                ${[
                  ["Customer Name", data.customerDetails.name],
                  ["Email", data.customerDetails.email],
                  ["Phone", data.customerDetails.phone],
                  ["Collection Type", collectionLabel],
                  ["Event ID", data.eventDetails.eventId],
                ]
                  .map(
                    ([label, value]) => `
                <tr>
                  <td style="padding:9px 0;border-bottom:1px solid #262626;color:#c9c9c9;font-size:14px;width:40%;">${label}</td>
                  <td style="padding:9px 0;border-bottom:1px solid #262626;color:#f7f7f7;font-size:14px;">${value}</td>
                </tr>`
                  )
                  .join("")}
              </table>

              <!-- Calendar link -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <a href="${data.eventDetails.eventLink}" style="display:inline-block;padding:12px 28px;background:#c7a17a;color:#111;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
                      View in Google Calendar
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 40px;border-top:1px solid #262626;text-align:center;">
              <p style="margin:0;font-size:12px;color:#666;">Vickie's Atelier — Booking Management</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Sends booking confirmation emails to customer and CEO
 * 
 * Requirements: 1.6, 1.7, 10.1, 10.2, 10.3, 10.6, 10.7, 10.8
 * 
 * @param data - Booking email data
 * @throws Error if email sending fails (caller should handle and log)
 */
export async function sendBookingEmails(data: BookingEmailData): Promise<void> {
  const transporter = getTransporter();
  const icsContent = generateICalendar(data);

  try {
    // Send confirmation email to customer with calendar attachment
    await transporter.sendMail({
      from: `"Vickie's Atelier" <${process.env.SMTP_USER}>`,
      to: data.customerDetails.email,
      subject: `Your consultation is confirmed — Vickie's Atelier`,
      html: bookingCustomerTemplate(data),
      icalEvent: {
        filename: 'consultation.ics',
        method: 'REQUEST',
        content: icsContent,
      },
    });
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    throw new Error('Failed to send confirmation email to customer');
  }

  try {
    // Send notification email to CEO
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail) {
      await transporter.sendMail({
        from: `"Vickie's Atelier Bookings" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New ${COLLECTION_LABELS[data.customerDetails.collectionType] ?? data.customerDetails.collectionType} consultation: ${data.customerDetails.name}`,
        html: bookingAdminTemplate(data),
        icalEvent: {
          filename: 'consultation.ics',
          method: 'REQUEST',
          content: icsContent,
        },
      });
    }
  } catch (error) {
    // Log but don't throw - customer email was sent successfully
    console.error('Failed to send CEO notification email:', error);
    // We don't throw here because the customer already got their confirmation
  }
}
