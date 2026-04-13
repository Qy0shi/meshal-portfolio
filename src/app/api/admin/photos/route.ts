import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import { adminUnauthorized, isAdminRequest } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return adminUnauthorized();
  try {
    const body = await req.json();
    const { title, tag, storage_path, public_url } = body;
    if (!storage_path || !public_url) {
      return NextResponse.json({ error: "storage_path and public_url required" }, { status: 400 });
    }
    const supabase = getSupabaseAdmin();

    // Insert via RPC to bypass PostgREST schema cache issue with storage_path column.
    const { data, error } = await supabase.rpc("insert_photo_with_path", {
      p_url: public_url,
      p_title: title || "",
      p_category: tag || "general",
      p_storage_path: storage_path,
    });

    if (error) throw error;
    return NextResponse.json({ photo: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
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

    // Get file path via RPC to bypass cache, then delete from storage
    const { data: photo } = await supabase.rpc("get_photo_path_by_id", { p_id: Number(id) });

    if (photo?.storage_path) {
      await supabase.storage.from("photos").remove([photo.storage_path]);
    }

    await supabase.rpc("delete_photo", { p_id: Number(id) });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
