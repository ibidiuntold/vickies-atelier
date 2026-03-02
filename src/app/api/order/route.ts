import { NextRequest, NextResponse } from "next/server";
import { appendOrder, getConfig } from "@/lib/sheets";
import { sendOrderEmails } from "@/lib/email";
import type { OrderPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json();

    if (!body.name || !body.email || !body.collection) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const config = await getConfig();

    const daysKey = `${body.collection}_days`;
    const days = parseInt(config[daysKey] ?? "7", 10);

    const readyDate = new Date();
    readyDate.setDate(readyDate.getDate() + days);
    const readyDateStr = readyDate.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await appendOrder({ ...body, estimatedReadyDate: readyDateStr });

    await sendOrderEmails({
      ...body,
      readyDate: readyDateStr,
      adminEmail: config.admin_email ?? "",
      estimatedReadyDate: readyDateStr,
    });

    return NextResponse.json({ ok: true, readyDate: readyDateStr });
  } catch (err) {
    console.error("[/api/order]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
