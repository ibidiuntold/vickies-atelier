import { NextRequest, NextResponse } from "next/server";
import { appendEnquiry } from "@/lib/sheets";
import type { EnquiryPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: EnquiryPayload = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await appendEnquiry(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/enquiry]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
