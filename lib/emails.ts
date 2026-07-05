/**
 * Zaru transactional email helpers (Resend).
 *
 * Environment variables:
 *   RESEND_API_KEY      – Resend API key. If missing, all sends silently no-op (returns false).
 *   ORDER_EMAIL_FROM    – "From" address, e.g. "ZARU Orders <orders@zaruscents.com>".
 *   ADMIN_ORDER_EMAIL   – Where new-order notifications are delivered (defaults to the shop gmail).
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails"

const DEFAULT_FROM = "ZARU <orders@zaruscents.com>"
const DEFAULT_ADMIN = "Zarufragrancehub@gmail.com"

export function getAdminOrderEmail() {
  return process.env.ADMIN_ORDER_EMAIL ?? DEFAULT_ADMIN
}

function getFrom() {
  return process.env.ORDER_EMAIL_FROM ?? DEFAULT_FROM
}

type SendOptions = {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendResendEmail({ to, subject, html, replyTo }: SendOptions): Promise<boolean> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.warn("[emails] RESEND_API_KEY not set; skipping send:", subject)
    return false
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: getFrom(),
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        reply_to: replyTo,
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "")
      console.error("[emails] Resend send failed", response.status, errorText)
      return false
    }
    return true
  } catch (error) {
    console.error("[emails] Resend request threw", error)
    return false
  }
}

function formatPKR(value: number) {
  return `PKR ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(value)}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/* ============================================================
   Templates
============================================================ */

type OrderItem = {
  productId?: string
  name?: string
  quantity?: number
  price?: number
  lineTotal?: number
}

type OrderShape = {
  order_code: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  customer_city: string
  customer_address: string
  payment_type: string
  payment_method: string
  subtotal_amount: number
  discount_amount: number
  payable_amount: number
  total_items: number
  items?: OrderItem[]
  status: string
  payment_status: string
  tracking_info?: string | null
  tracking_courier?: string | null
}

function renderItemRows(items: OrderItem[] = []) {
  if (items.length === 0) {
    return `<tr><td colspan="3" style="padding:8px;color:#666;font-style:italic;">No items</td></tr>`
  }
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px;border-top:1px solid #eee;">${escapeHtml(item.name ?? "Item")}</td>
          <td style="padding:8px;border-top:1px solid #eee;text-align:center;">${item.quantity ?? 1}</td>
          <td style="padding:8px;border-top:1px solid #eee;text-align:right;">${typeof item.lineTotal === "number" ? formatPKR(item.lineTotal) : "—"}</td>
        </tr>`,
    )
    .join("")
}

function renderItemsTable(items: OrderItem[] = []) {
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">Item</th>
          <th style="text-align:center;padding:8px;border-bottom:1px solid #ddd;">Qty</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>${renderItemRows(items)}</tbody>
    </table>`
}

function renderPriceSummary(order: OrderShape) {
  const shippingAmount = Math.max(
    0,
    Number(order.payable_amount) - Number(order.subtotal_amount) + Number(order.discount_amount),
  )
  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px;">
      <tr>
        <td style="padding:6px 8px;color:#666;">Subtotal</td>
        <td style="padding:6px 8px;text-align:right;">${formatPKR(order.subtotal_amount)}</td>
      </tr>
      ${
        order.discount_amount > 0
          ? `<tr>
              <td style="padding:6px 8px;color:#666;">Discount</td>
              <td style="padding:6px 8px;text-align:right;">- ${formatPKR(order.discount_amount)}</td>
            </tr>`
          : ""
      }
      ${
        shippingAmount > 0
          ? `<tr>
              <td style="padding:6px 8px;color:#666;">Shipping</td>
              <td style="padding:6px 8px;text-align:right;">${formatPKR(shippingAmount)}</td>
            </tr>`
          : ""
      }
      <tr>
        <td style="padding:8px;font-weight:600;font-size:15px;border-top:2px solid #d4c39a;color:#1a1a1a;">Total payable</td>
        <td style="padding:8px;text-align:right;font-weight:700;font-size:16px;border-top:2px solid #d4c39a;color:#8a6d3b;">${formatPKR(order.payable_amount)}</td>
      </tr>
    </table>`
}

function renderCallout(tone: "gold" | "amber" | "emerald" | "rose", heading: string, message: string) {
  const palette = {
    gold: { bg: "#faf5e8", border: "#d4b464", accent: "#8a6d3b" },
    amber: { bg: "#fff7ed", border: "#f59e0b", accent: "#92400e" },
    emerald: { bg: "#ecfdf5", border: "#34d399", accent: "#065f46" },
    rose: { bg: "#fff1f2", border: "#fb7185", accent: "#9f1239" },
  }[tone]
  return `
    <div style="margin:20px 0;padding:16px 18px;background:${palette.bg};border-left:4px solid ${palette.border};border-radius:8px;">
      <p style="margin:0 0 4px 0;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:${palette.accent};font-weight:600;">
        ${escapeHtml(heading)}
      </p>
      <p style="margin:0;font-size:15px;line-height:1.5;color:${palette.accent};font-weight:600;">
        ${escapeHtml(message)}
      </p>
    </div>`
}

function renderShippingAddress(order: OrderShape) {
  return `
    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;font-size:13px;color:#444;">
      <p style="margin:0 0 4px 0;"><strong>Shipping to</strong></p>
      <p style="margin:0;">${escapeHtml(order.customer_name)}</p>
      <p style="margin:0;">${escapeHtml(order.customer_phone)}</p>
      <p style="margin:0;">${escapeHtml(order.customer_address)}, ${escapeHtml(order.customer_city)}</p>
    </div>`
}

function wrapShell(title: string, bodyHtml: string) {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;background:#faf7f2;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-family:Georgia,serif;font-size:24px;letter-spacing:2px;color:#8a6d3b;">ZARU</div>
      <div style="font-size:11px;letter-spacing:3px;color:#8a6d3b;text-transform:uppercase;">Fragrance Hub</div>
    </div>
    <div style="background:#fff;border:1px solid #ece5d5;border-radius:12px;padding:24px;">
      <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 16px 0;color:#1a1a1a;">${escapeHtml(title)}</h1>
      ${bodyHtml}
    </div>
    <p style="font-size:11px;color:#999;text-align:center;margin-top:16px;">
      Need help? Reply to this email or reach us on WhatsApp. — ZARU Fragrance Hub
    </p>
  </div>`
}

/**
 * Admin notification when a new order comes in.
 */
export function renderAdminOrderEmail(orderId: string, order: OrderShape) {
  const rows = renderItemRows(order.items)
  const body = `
    <p style="margin:0 0 12px 0;">A new order was placed on the storefront.</p>
    <p style="margin:0 0 4px 0;"><strong>Order ID:</strong> ${escapeHtml(orderId)}</p>
    <p style="margin:0 0 4px 0;"><strong>Customer:</strong> ${escapeHtml(order.customer_name)}</p>
    <p style="margin:0 0 4px 0;"><strong>Phone:</strong> ${escapeHtml(order.customer_phone)}</p>
    <p style="margin:0 0 4px 0;"><strong>Email:</strong> ${escapeHtml(order.customer_email ?? "N/A")}</p>
    <p style="margin:0 0 4px 0;"><strong>City:</strong> ${escapeHtml(order.customer_city)}</p>
    <p style="margin:0 0 12px 0;"><strong>Address:</strong> ${escapeHtml(order.customer_address)}</p>
    <p style="margin:0 0 4px 0;"><strong>Payment:</strong> ${escapeHtml(order.payment_type)} / ${escapeHtml(order.payment_method)}</p>
    <p style="margin:0 0 16px 0;"><strong>Payable:</strong> ${formatPKR(order.payable_amount)}</p>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd;">Item</th>
          <th style="text-align:center;padding:8px;border-bottom:1px solid #ddd;">Qty</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <p style="margin-top:16px;font-size:13px;color:#666;">
      Manage this order in the admin dashboard.
    </p>
  `
  return wrapShell(`New order · ${orderId}`, body)
}

/**
 * Customer confirmation email right after checkout.
 * Sent when an order is first placed (status = pending).
 */
export function renderCustomerOrderConfirmationEmail(orderId: string, order: OrderShape) {
  const firstName = escapeHtml(order.customer_name.split(" ")[0] || "there")
  const body = `
    <p style="margin:0 0 12px 0;font-size:15px;">Hi ${firstName}, thank you so much for your order! 🌿</p>
    <p style="margin:0 0 8px 0;">We've received your order and it's now in our queue. Here's a full summary of what you ordered and the total amount.</p>

    ${renderCallout(
      "gold",
      "What happens next",
      "Our team will contact you shortly on WhatsApp or phone to confirm your order details before we prepare it for dispatch.",
    )}

    <div style="background:#faf7f2;border:1px solid #ece5d5;border-radius:8px;padding:12px 16px;margin:16px 0;">
      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#8a6d3b;">Order</p>
      <p style="margin:2px 0 0 0;font-family:Georgia,serif;font-size:20px;">#${escapeHtml(orderId)}</p>
    </div>

    ${renderItemsTable(order.items)}
    ${renderPriceSummary(order)}
    ${renderShippingAddress(order)}

    <p style="margin-top:16px;font-size:13px;color:#666;">
      You can check the status of your order any time from the <em>My Orders</em> page on our website using this email or your phone number.
    </p>
  `
  return wrapShell("Thank you for your order!", body)
}

/**
 * Customer email when order status changes.
 */
const STATUS_HEADLINE: Record<string, string> = {
  pending: "We've received your order",
  confirmed: "Your order has been confirmed",
  shipped: "Your order is on its way",
  delivered: "Your order has been delivered",
  cancelled: "Your order has been cancelled",
}

const STATUS_INTRO: Record<string, string> = {
  pending: "Thanks for your order! We've received it and will reach out to you shortly to confirm the details.",
  confirmed:
    "Great news — we've confirmed your order and it's now being prepared for dispatch. We'll notify you the moment it ships.",
  shipped:
    "Your order has been dispatched and is on its way to you. You can track it using the details below.",
  delivered: "Your order has been delivered. We really hope you love your fragrance!",
  cancelled: "Your order has been cancelled. If this was unexpected, just reply to this email and we'll take care of it.",
}

function renderStatusCallout(status: string) {
  switch (status) {
    case "pending":
      return renderCallout(
        "gold",
        "What happens next",
        "Our team will contact you shortly on WhatsApp or phone to confirm your order before we prepare it for dispatch.",
      )
    case "confirmed":
      return renderCallout(
        "gold",
        "Order confirmed",
        "We've locked in your order and started preparing it. You'll receive another email as soon as it's dispatched.",
      )
    case "shipped":
      return renderCallout(
        "amber",
        "Delivery in 3–5 business days",
        "Please have your payment ready — your order will arrive in 3 to 5 business days. Use the tracking details below to follow it.",
      )
    case "delivered":
      return renderCallout(
        "emerald",
        "Thanks for choosing ZARU 💛",
        "It would mean a lot if you could leave us a review or share how the scent worked out for you — your feedback truly helps our small brand grow.",
      )
    case "cancelled":
      return renderCallout(
        "rose",
        "Order cancelled",
        "If this cancellation was a mistake or you'd like help placing a new order, reply to this email and we'll sort it out for you.",
      )
    default:
      return ""
  }
}

export function renderCustomerStatusUpdateEmail(orderId: string, order: OrderShape) {
  const firstName = escapeHtml(order.customer_name.split(" ")[0] || "there")
  const headline = STATUS_HEADLINE[order.status] ?? `Order update`
  const intro = STATUS_INTRO[order.status] ?? `Your order status is now: ${order.status}`

  const trackingBlock = order.tracking_info
    ? `
      <div style="margin-top:16px;padding:14px 16px;background:#faf7f2;border:1px solid #d4c39a;border-radius:8px;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#8a6d3b;">Tracking</p>
        ${
          order.tracking_courier
            ? `<p style="margin:6px 0 0 0;font-size:14px;"><strong>Courier:</strong> ${escapeHtml(order.tracking_courier)}</p>`
            : ""
        }
        <p style="margin:4px 0 0 0;font-size:14px;word-break:break-all;"><strong>Tracking number:</strong> ${escapeHtml(order.tracking_info)}</p>
      </div>`
    : ""

  const body = `
    <p style="margin:0 0 12px 0;font-size:15px;">Hi ${firstName},</p>
    <p style="margin:0 0 8px 0;">${escapeHtml(intro)}</p>

    ${renderStatusCallout(order.status)}

    <div style="background:#faf7f2;border:1px solid #ece5d5;border-radius:8px;padding:12px 16px;margin:16px 0;">
      <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#8a6d3b;">Order</p>
      <p style="margin:2px 0 0 0;font-family:Georgia,serif;font-size:20px;">#${escapeHtml(orderId)}</p>
      <p style="margin:6px 0 0 0;font-size:13px;color:#666;">Status: <strong style="text-transform:capitalize;">${escapeHtml(order.status)}</strong></p>
    </div>

    ${trackingBlock}

    ${renderItemsTable(order.items)}
    ${renderPriceSummary(order)}
    ${renderShippingAddress(order)}

    <p style="margin-top:20px;font-size:13px;color:#666;">
      Track your order any time from the <em>My Orders</em> page on our website — just enter this email or your phone number.
    </p>
  `
  return wrapShell(headline, body)
}
