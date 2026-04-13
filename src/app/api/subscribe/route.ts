import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("subscribers").insert([{ email: email.trim().toLowerCase() }]);

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Missing")) {
      return NextResponse.json({ error: "Server not configured" }, { status: 503 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
