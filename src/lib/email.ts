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
    });
  }
}
