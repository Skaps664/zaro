"use client"

import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { Mail, Package, Phone, Search, Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type LookupOrderItem = {
  id?: string
  name?: string
  quantity?: number
  price?: number
  lineTotal?: number
  image?: string
}

type LookupOrder = {
  id: string
  order_code: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  customer_city: string
  customer_address: string
  payment_type: string
  payment_method: string
  subtotal_amount: number
  discount_amount: number
  payable_amount: number
  total_items: number
  items: LookupOrderItem[]
  status: string
  payment_status: string
  tracking_info: string | null
  tracking_courier: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

type LookupMode = "phone" | "email"

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"] as const

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-sky-100 text-sky-900 border-sky-200",
  shipped: "bg-violet-100 text-violet-900 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-900 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 border-rose-200",
}

const PAYMENT_STATUS_TONE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-900 border-emerald-200",
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  unpaid: "bg-muted text-muted-foreground border-border",
  failed: "bg-rose-100 text-rose-900 border-rose-200",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-sm text-rose-700">
        <span className="inline-block h-2 w-2 rounded-full bg-rose-500" />
        This order was cancelled.
      </div>
    )
  }
  const currentIndex = Math.max(0, STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]))
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STATUS_STEPS.map((step, index) => {
        const active = index <= currentIndex
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  active ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
              {STATUS_LABEL[step]}
            </div>
            {index < STATUS_STEPS.length - 1 && (
              <span
                className={`h-px w-4 ${active && index < currentIndex ? "bg-primary/40" : "bg-border"}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function AccountPageContent() {
  const [mode, setMode] = useState<LookupMode>("phone")
  const [identifier, setIdentifier] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<LookupOrder[] | null>(null)
  const [searchedFor, setSearchedFor] = useState<string>("")

  const handleLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = identifier.trim()
    if (!trimmed) {
      toast.error(mode === "phone" ? "Enter the phone number used at checkout" : "Enter the email used at checkout")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/storefront/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: trimmed, type: mode }),
      })
      const payload = (await res.json()) as { success: boolean; orders?: LookupOrder[]; message?: string }
      if (!res.ok || !payload.success) {
        throw new Error(payload.message ?? "Could not fetch orders")
      }

      setOrders(payload.orders ?? [])
      setSearchedFor(trimmed)

      if ((payload.orders ?? []).length === 0) {
        toast.info("No orders found for this " + mode)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lookup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setOrders(null)
    setIdentifier("")
    setSearchedFor("")
  }

  return (
    <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-5">
            My Orders
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">Track Your Orders</h1>
          <p className="text-muted-foreground max-w-2xl">
            Enter the phone number or email you used at checkout to see your order status, payment details, and
            tracking information.
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
          <div className="mb-5 inline-flex rounded-full border border-border/60 bg-background p-1">
            <button
              type="button"
              onClick={() => setMode("phone")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                mode === "phone"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Phone className="h-4 w-4" />
              Phone
            </button>
            <button
              type="button"
              onClick={() => setMode("email")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors ${
                mode === "email"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
              Email
            </button>
          </div>

          <form onSubmit={handleLookup} className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {mode === "phone" ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </span>
              <input
                type={mode === "email" ? "email" : "tel"}
                inputMode={mode === "phone" ? "tel" : "email"}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={mode === "phone" ? "e.g. 03001234567" : "you@example.com"}
                autoComplete={mode === "phone" ? "tel" : "email"}
                className="h-12 w-full rounded-2xl border border-border/70 bg-background pl-9 pr-3 text-sm"
              />
            </div>
            <Button type="submit" className="h-12 rounded-2xl px-6" disabled={isSubmitting}>
              <Search className="mr-2 h-4 w-4" />
              {isSubmitting ? "Searching..." : "Find my orders"}
            </Button>
          </form>

          {orders !== null && (
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Showing orders for <span className="font-medium text-foreground">{searchedFor}</span>
              </span>
              <button type="button" onClick={reset} className="underline hover:text-foreground">
                Change
              </button>
            </div>
          )}
        </div>

        {orders !== null && orders.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-background p-10 text-center">
            <Package className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium text-foreground">No orders found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Double-check the {mode} you entered, or contact support if you believe this is an error.
            </p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="mt-6 space-y-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-border/60 bg-card p-5 md:p-6"
              >
                <header className="flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Order</p>
                    <h3 className="font-serif text-2xl text-foreground">#{order.order_code}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Placed {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className={`capitalize ${STATUS_TONE[order.status] ?? "border-border text-foreground"}`}
                    >
                      {STATUS_LABEL[order.status] ?? order.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`capitalize ${
                        PAYMENT_STATUS_TONE[order.payment_status] ?? "border-border text-foreground"
                      }`}
                    >
                      Payment: {order.payment_status}
                    </Badge>
                  </div>
                </header>

                <div className="mt-5">
                  <OrderTimeline status={order.status} />
                </div>

                {order.tracking_info && (
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                    <Truck className="mt-0.5 h-5 w-5 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-wide text-primary">Tracking</p>
                      {order.tracking_courier && (
                        <p className="text-sm font-medium text-foreground">Courier: {order.tracking_courier}</p>
                      )}
                      <p className="text-sm text-foreground break-all">
                        Tracking number: {order.tracking_info}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Shipping to</p>
                    <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    {order.customer_email && (
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer_address}, {order.customer_city}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment</p>
                    <p className="text-sm text-foreground capitalize">
                      {order.payment_type} · {order.payment_method}
                    </p>
                    <div className="mt-3 rounded-2xl border border-border/60 bg-background p-3 text-sm">
                      <div className="flex justify-between text-muted-foreground">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal_amount)}</span>
                      </div>
                      {order.discount_amount > 0 && (
                        <div className="flex justify-between text-muted-foreground">
                          <span>Discount</span>
                          <span>- {formatCurrency(order.discount_amount)}</span>
                        </div>
                      )}
                      <div className="mt-1 flex justify-between font-medium text-foreground">
                        <span>Total</span>
                        <span>{formatCurrency(order.payable_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                    Items ({order.total_items})
                  </p>
                  <ul className="space-y-2">
                    {(order.items ?? []).map((item, index) => (
                      <li
                        key={`${order.id}-${item.id ?? index}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{item.name ?? "Item"}</p>
                          <p className="text-xs text-muted-foreground">
                            Qty {item.quantity ?? 1}
                            {typeof item.price === "number" ? ` · ${formatCurrency(item.price)} each` : ""}
                          </p>
                        </div>
                        {typeof item.lineTotal === "number" && (
                          <p className="font-medium text-foreground">{formatCurrency(item.lineTotal)}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
