import { NextRequest, NextResponse } from "next/server";

export function isAdminRequest(req: NextRequest): boolean {
  const key = req.headers.get("x-api-key");
  const expected = process.env.ADMIN_API_KEY;
  return Boolean(expected && key && key === expected);
}

export function adminUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
