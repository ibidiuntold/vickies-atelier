import { google } from "googleapis";
import type { OrderPayload, EnquiryPayload, ConfigMap } from "@/types";

function getAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

export async function getConfig(): Promise<ConfigMap> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Config!A:B",
  });

  const rows = res.data.values ?? [];
  const config: ConfigMap = {
    bespoke_days: "7",
    bridal_days: "7",
    rtw_days: "7",
    admin_email: "",
  };

  for (const [key, value] of rows) {
    if (key && value !== undefined) {
      config[key as string] = value as string;
    }
  }

  return config;
}

export async function appendEnquiry(data: EnquiryPayload) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Enquiries!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [new Date().toISOString(), data.name, data.email, data.message],
      ],
    },
  });
}

export async function appendOrder(
  data: OrderPayload & { estimatedReadyDate: string }
) {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Orders!A:N",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          data.name,
          data.email,
          data.collection,
          data.bust,
          data.waist,
          data.hips,
          data.height,
          data.shoulder,
          data.sleeve,
          data.inseam,
          data.notes,
          data.estimatedReadyDate,
        ],
      ],
    },
  });
}
