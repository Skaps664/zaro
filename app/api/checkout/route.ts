import { NextResponse } from "next/server"
import { getSupabaseServerAdminClient, getSupabaseServerAnonClient } from "@/lib/supabase-server"
import {
  getAdminOrderEmail,
  renderAdminOrderEmail,
  renderCustomerOrderConfirmationEmail,
  sendResendEmail,
} from "@/lib/emails"

type CheckoutItem = {
  productId: string
  name: string
  quantity: number
  price: number
  lineTotal: number
}

type CheckoutBody = {
  customer: {
    fullName: string
    phone: string
    city: string
    address: string
    email?: string | null
  }
  payment: {
    type?: "advance" | "cod"
    method: string
    reference?: string | null
  }
  notes?: string | null
  items: CheckoutItem[]
  totalItems: number
  subtotalAmount?: number
  discountAmount?: number
  shippingAmount?: number
  payableAmount?: number
  totalAmount: number
  whatsapp?: string
}

const SHIPPING_CHARGE = 200

function createOrderId() {
  const rand = Math.floor(Math.random() * 900 + 100)
  return `ZR-${Date.now().toString().slice(-7)}-${rand}`
}

function toOrderShape(
  payload: CheckoutBody,
  subtotalAmount: number,
  discountAmount: number,
  payableAmount: number,
) {
  return {
    order_code: "",
    customer_name: payload.customer.fullName,
    customer_phone: payload.customer.phone,
    customer_email: payload.customer.email ?? null,
    customer_city: payload.customer.city,
    customer_address: payload.customer.address,
    payment_type: payload.payment.type ?? "advance",
    payment_method: payload.payment.method,
    subtotal_amount: subtotalAmount,
    discount_amount: discountAmount,
    payable_amount: payableAmount,
    total_items: payload.totalItems,
    items: payload.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      lineTotal: item.lineTotal,
    })),
    status: "pending",
    payment_status: payload.payment.type === "cod" ? "pending" : "unpaid",
    tracking_info: null,
  }
}

async function sendAdminOrderEmail(
  orderId: string,
  payload: CheckoutBody,
  subtotalAmount: number,
  discountAmount: number,
  _shippingAmount: number,
  payableAmount: number,
) {
  const order = { ...toOrderShape(payload, subtotalAmount, discountAmount, payableAmount), order_code: orderId }
  return sendResendEmail({
    to: getAdminOrderEmail(),
    subject: `New ZARU order: ${orderId}`,
    html: renderAdminOrderEmail(orderId, order),
    replyTo: payload.customer.email ?? undefined,
  })
}

async function sendCustomerConfirmationEmail(
  orderId: string,
  payload: CheckoutBody,
  subtotalAmount: number,
  discountAmount: number,
  payableAmount: number,
) {
  const email = payload.customer.email?.trim()
  if (!email) return false
  const order = { ...toOrderShape(payload, subtotalAmount, discountAmount, payableAmount), order_code: orderId }
  return sendResendEmail({
    to: email,
    subject: `Thank you for your ZARU order · #${orderId}`,
    html: renderCustomerOrderConfirmationEmail(orderId, order),
  })
}

function buildOrderMessage(
  orderId: string,
  payload: CheckoutBody,
  subtotalAmount: number,
  _discountAmount: number,
  shippingAmount: number,
  payableAmount: number,
) {
  const lines = payload.items
    .map((item) => `${item.name} x${item.quantity} = PKR ${item.lineTotal}`)
    .join(" | ")

  const paymentLabel = payload.payment.type === "cod" ? "Cash on Delivery" : "Advance Payment"

  return [
    `Order ID: ${orderId}`,
    `Name: ${payload.customer.fullName}`,
    `Phone: ${payload.customer.phone}`,
    `City: ${payload.customer.city}`,
    `Address: ${payload.customer.address}`,
    `Email: ${payload.customer.email ?? "N/A"}`,
    `Payment: ${paymentLabel}`,
    `Total Items: ${payload.totalItems}`,
    `Subtotal: PKR ${subtotalAmount}`,
    `Shipping: PKR ${shippingAmount}`,
    `Payable Amount: PKR ${payableAmount}`,
    `Items: ${lines}`,
  ].join("\n")
}

async function submitToGoogleSheet(orderMessage: string, payload: CheckoutBody) {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (webhookUrl) {
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderMessage,
        payload,
      }),
      cache: "no-store",
    })

    if (!webhookResponse.ok) {
      throw new Error("Google Sheet webhook failed")
    }
    return true
  }

  const formAction = process.env.GOOGLE_FORM_ACTION_URL
  const orderField = process.env.GOOGLE_FORM_ORDER_FIELD

  if (!formAction || !orderField) {
    return false
  }

  const body = new URLSearchParams()
  body.set(orderField, orderMessage)

  const response = await fetch(formAction, {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "manual",
    cache: "no-store",
  })

  if (response.status >= 400) {
    throw new Error("Google Form submission failed")
  }

  return true
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody

    if (!body?.customer?.fullName || !body?.customer?.phone || !body?.customer?.city || !body?.customer?.address) {
      return NextResponse.json({ success: false, message: "Missing required customer fields" }, { status: 400 })
    }

    if (!body.customer.email || !body.customer.email.trim()) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" }, { status: 400 })
    }

    const subtotalAmount = body.items.reduce((sum, item) => sum + item.lineTotal, 0)
    const discountAmount = body.payment.type === "advance" ? Math.round(subtotalAmount * 0.1) : 0
    const shippingAmount = SHIPPING_CHARGE
    const payableAmount = subtotalAmount - discountAmount + shippingAmount

    const orderId = createOrderId()
    const orderMessage = buildOrderMessage(orderId, body, subtotalAmount, discountAmount, shippingAmount, payableAmount)

    const supabase = getSupabaseServerAdminClient() ?? getSupabaseServerAnonClient()
    if (supabase) {
      const { error: saveError } = await supabase.from("customer_orders").insert({
        order_code: orderId,
        customer_name: body.customer.fullName,
        customer_phone: body.customer.phone,
        customer_city: body.customer.city,
        customer_address: body.customer.address,
        customer_email: body.customer.email ?? null,
        payment_type: body.payment.type ?? "advance",
        payment_method: body.payment.method,
        payment_reference: body.payment.reference ?? null,
        subtotal_amount: subtotalAmount,
        discount_amount: discountAmount,
        payable_amount: payableAmount,
        total_items: body.totalItems,
        items: body.items,
        status: "pending",
        payment_status: body.payment.type === "cod" ? "pending" : "unpaid",
        tracking_info: null,
        notes: body.notes ?? null,
      })

      if (saveError) {
        return NextResponse.json({ success: false, message: saveError.message }, { status: 500 })
      }
    }

    await sendAdminOrderEmail(orderId, body, subtotalAmount, discountAmount, shippingAmount, payableAmount)
    await sendCustomerConfirmationEmail(orderId, body, subtotalAmount, discountAmount, payableAmount)

    try {
      const synced = await submitToGoogleSheet(orderMessage, body)
      if (synced) {
        return NextResponse.json({ success: true, orderId, payableAmount, whatsappMessage: orderMessage })
      }

      // No sheet integration configured: this is valid, admin Orders tab is source of truth.
      return NextResponse.json({ success: true, orderId, payableAmount, whatsappMessage: orderMessage })
    } catch (sheetError) {
      const sheetMessage = sheetError instanceof Error ? sheetError.message : "Google sheet sync failed"
      return NextResponse.json({
        success: true,
        orderId,
        payableAmount,
        whatsappMessage: orderMessage,
        message: `Order saved. Optional sheet sync failed: ${sheetMessage}`,
      })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
