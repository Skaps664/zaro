import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"

type UpdateOrderInput = {
  status?: string
  paymentStatus?: string
  trackingInfo?: string | null
}

type Params = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const { id } = await params
  const body = (await request.json()) as { order: UpdateOrderInput }

  const payload = {
    status: body.order.status,
    payment_status: body.order.paymentStatus,
    tracking_info: body.order.trackingInfo ?? null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("customer_orders").update(payload).eq("id", id).select("*").single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, order: data })
}
