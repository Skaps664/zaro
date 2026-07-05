import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"

// Lightweight endpoint used by the admin panel to verify the entered key
// before granting UI access. Returns 200 on success, 401 otherwise.
export async function GET(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response
  return NextResponse.json({ success: true })
}
