import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { adminUnauthorized, isAdminRequest } from "@/lib/admin-api";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("subscribers")
      .select("email, created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ subscribers: data || [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
