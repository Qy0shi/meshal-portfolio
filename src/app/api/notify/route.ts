import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { adminUnauthorized, isAdminRequest } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  try {
    const { subject, body } = await req.json();
    if (!subject || !body) {
      return NextResponse.json({ error: "subject and body required" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const supabase = getSupabaseAdmin();
    const { data: subs, error } = await supabase.from("subscribers").select("email");
    if (error) throw error;

    if (!subs?.length) {
      return NextResponse.json({ error: "No subscribers" }, { status: 404 });
    }

    const emails = subs.map((s: { email: string }) => s.email);

    await resend.emails.send({
      from: "Portfolio Updates <onboarding@resend.dev>",
      to: emails,
      bcc: process.env.ADMIN_EMAIL ? [process.env.ADMIN_EMAIL] : undefined,
      subject,
      html: body,
    });

    return NextResponse.json({ success: true, sent: emails.length });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
