import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase-public";

/** Returns public URL for `resume/resume.pdf` (bucket should be public read, or replace with signed URLs). */
export async function GET() {
  try {
    const { data } = supabasePublic.storage.from("resume").getPublicUrl("resume.pdf");
    if (!data?.publicUrl) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    return NextResponse.json({ url: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
