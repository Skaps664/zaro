import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const { data, error } = await supabase.from("customer_orders").select("*").order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, orders: data })
}
