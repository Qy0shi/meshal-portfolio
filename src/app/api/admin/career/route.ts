import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { adminUnauthorized, isAdminRequest } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();
  try {
    const body = await req.json();
    const { title, company, period, description, location, order } = body;
    if (!title || !company) {
      return NextResponse.json({ error: "title and company required" }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("career_entries")
      .insert([
        {
          title,
          company,
          period: period || "",
          description: description || "",
          location: location || "",
          order: typeof order === "number" ? order : 0,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ entry: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("career_entries").delete().eq("id", Number(id));
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
