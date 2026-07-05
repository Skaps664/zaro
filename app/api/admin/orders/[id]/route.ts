import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"
import { renderCustomerStatusUpdateEmail, sendResendEmail } from "@/lib/emails"

const ALLOWED_COURIERS = new Set(["TCS", "Leopard", "Postex", "M&P"])

type UpdateOrderInput = {
  status?: string
  paymentStatus?: string
  trackingInfo?: string | null
  trackingCourier?: string | null
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

  // Load current row so we can detect what changed
  const { data: existing, error: fetchError } = await supabase
    .from("customer_orders")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !existing) {
    return NextResponse.json(
      { success: false, message: fetchError?.message ?? "Order not found" },
      { status: 404 },
    )
  }

  const nextStatus = body.order.status ?? existing.status
  const nextPaymentStatus = body.order.paymentStatus ?? existing.payment_status
  const nextTracking =
    body.order.trackingInfo === undefined ? existing.tracking_info ?? null : body.order.trackingInfo
  const nextCourier =
    body.order.trackingCourier === undefined ? existing.tracking_courier ?? null : body.order.trackingCourier

  // Guard: shipped status requires both courier + tracking number
  if (nextStatus === "shipped") {
    const trackingOk = typeof nextTracking === "string" && nextTracking.trim().length > 0
    const courierOk = typeof nextCourier === "string" && ALLOWED_COURIERS.has(nextCourier)
    if (!trackingOk || !courierOk) {
      return NextResponse.json(
        {
          success: false,
          message: "Please select a courier and enter a tracking number before marking as shipped.",
        },
        { status: 400 },
      )
    }
  }

  // Validate courier value if provided
  if (
    nextCourier !== null &&
    nextCourier !== "" &&
    typeof nextCourier === "string" &&
    !ALLOWED_COURIERS.has(nextCourier)
  ) {
    return NextResponse.json(
      { success: false, message: `Courier must be one of: ${Array.from(ALLOWED_COURIERS).join(", ")}` },
      { status: 400 },
    )
  }

  const payload = {
    status: nextStatus,
    payment_status: nextPaymentStatus,
    tracking_info: nextTracking,
    tracking_courier: nextCourier || null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("customer_orders")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  const statusChanged = existing.status !== data.status
  const trackingChanged = (existing.tracking_info ?? "") !== (data.tracking_info ?? "")
  const courierChanged = (existing.tracking_courier ?? "") !== (data.tracking_courier ?? "")
  const shouldNotify = Boolean(data.customer_email) && (statusChanged || trackingChanged || courierChanged)

  let emailSent = false
  if (shouldNotify) {
    emailSent = await sendResendEmail({
      to: data.customer_email as string,
      subject: statusChanged
        ? `ZARU order ${data.status} · #${data.order_code}`
        : `Tracking updated · ZARU order #${data.order_code}`,
      html: renderCustomerStatusUpdateEmail(data.order_code, data),
    })
  }

  return NextResponse.json({ success: true, order: data, emailSent })
}
