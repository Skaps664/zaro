import { NextResponse } from "next/server"
import { getSupabaseServerAdminClient, getSupabaseServerAnonClient } from "@/lib/supabase-server"

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

const ADMIN_ORDER_EMAIL = process.env.ADMIN_ORDER_EMAIL ?? "Zarufragrancehub@gmail.com"

async function sendAdminOrderEmail(
  orderId: string,
  payload: CheckoutBody,
  subtotalAmount: number,
  discountAmount: number,
  shippingAmount: number,
  payableAmount: number,
) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return false

  const fromEmail = process.env.ORDER_EMAIL_FROM ?? "orders@zaruscents.com"

  const itemRows = payload.items
    .map((item) => `<li>${item.name} x${item.quantity} - PKR ${item.lineTotal}</li>`)
    .join("")

  const html = `
    <h2>New Order Received</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Name:</strong> ${payload.customer.fullName}</p>
    <p><strong>Email:</strong> ${payload.customer.email ?? "N/A"}</p>
    <p><strong>Phone:</strong> ${payload.customer.phone}</p>
    <p><strong>City:</strong> ${payload.customer.city}</p>
    <p><strong>Address:</strong> ${payload.customer.address}</p>
    <p><strong>Payment Type:</strong> ${payload.payment.type === "cod" ? "Cash on Delivery" : "Advance Payment"}</p>
    <p><strong>Payment Method:</strong> ${payload.payment.method}</p>
    <p><strong>Reference:</strong> ${payload.payment.reference ?? "N/A"}</p>
    <p><strong>Subtotal:</strong> PKR ${subtotalAmount}</p>
    <p><strong>Discount:</strong> PKR ${discountAmount}</p>
    <p><strong>Shipping:</strong> PKR ${shippingAmount}</p>
    <p><strong>Payable:</strong> PKR ${payableAmount}</p>
    <p><strong>Total Items:</strong> ${payload.totalItems}</p>
    <p><strong>Notes:</strong> ${payload.notes ?? "N/A"}</p>
    <h3>Items</h3>
    <ul>${itemRows}</ul>
  `

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [ADMIN_ORDER_EMAIL],
      subject: `New ZARU order: ${orderId}`,
      html,
    }),
    cache: "no-store",
  })

  return response.ok
}

function createOrderId() {
  const rand = Math.floor(Math.random() * 900 + 100)
  return `ZR-${Date.now().toString().slice(-7)}-${rand}`
}

function buildOrderMessage(
  orderId: string,
  payload: CheckoutBody,
  subtotalAmount: number,
  discountAmount: number,
  shippingAmount: number,
  payableAmount: number,
) {
  const lines = payload.items
    .map((item) => `${item.name} x${item.quantity} = PKR ${item.lineTotal}`)
    .join(" | ")

  return [
    `Order ID: ${orderId}`,
    `Name: ${payload.customer.fullName}`,
    `Phone: ${payload.customer.phone}`,
    `City: ${payload.customer.city}`,
    `Address: ${payload.customer.address}`,
    `Email: ${payload.customer.email ?? "N/A"}`,
    `Payment Type: ${payload.payment.type === "cod" ? "Cash on Delivery" : "Advance Payment"}`,
    `Payment Method: ${payload.payment.method}`,
    `Payment Ref: ${payload.payment.reference ?? "N/A"}`,
    `Total Items: ${payload.totalItems}`,
    `Subtotal: PKR ${subtotalAmount}`,
    `Discount: PKR ${discountAmount}`,
    `Shipping: PKR ${shippingAmount}`,
    `Payable Amount: PKR ${payableAmount}`,
    `Items: ${lines}`,
    `Notes: ${payload.notes ?? "N/A"}`,
    `WhatsApp: ${payload.whatsapp ?? "N/A"}`,
    `Created At: ${new Date().toISOString()}`,
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
