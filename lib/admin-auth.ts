import { NextResponse } from "next/server"

type AdminAuthResult =
  | { ok: true }
  | {
      ok: false
      response: NextResponse<{ success: boolean; message: string }>
    }

export function isAdminAuthorized(request: Request): AdminAuthResult {
  const expected = process.env.ADMIN_DASHBOARD_KEY
  if (!expected) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: "ADMIN_DASHBOARD_KEY is not configured in environment." },
        { status: 500 },
      ),
    }
  }

  const provided = request.headers.get("x-admin-key")
  if (!provided || provided !== expected) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 }),
    }
  }

  return { ok: true }
}
