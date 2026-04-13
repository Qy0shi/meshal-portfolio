import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase-public";

export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from("career_entries")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ entries: data || [] });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
