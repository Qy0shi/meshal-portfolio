import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { adminUnauthorized, isAdminRequest } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("settings").select("about").eq("id", 1).maybeSingle();
    if (error) throw error;
    const about = data?.about;
    const json =
      typeof about === "string"
        ? about
        : about
          ? JSON.stringify(about, null, 2)
          : "";
    return NextResponse.json({ aboutJson: json });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();
  try {
    const { aboutJson } = await req.json();
    if (typeof aboutJson !== "string") {
      return NextResponse.json({ error: "aboutJson string required" }, { status: 400 });
    }
    let parsed: unknown;
    try {
      parsed = aboutJson.trim() ? JSON.parse(aboutJson) : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("settings")
      .upsert({ id: 1, about: parsed }, { onConflict: "id" });
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
