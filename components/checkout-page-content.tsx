"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Copy, MessageCircle } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { SITE_CONTACT, toWhatsappDigits } from "@/lib/site-contact"

type CheckoutResponse = {
  success: boolean
  orderId?: string
  payableAmount?: number
  whatsappMessage?: string
  message?: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

const PAYMENT_DETAILS = {
  bankName: "Meezan Bank",
  accountTitle: "ZARU Fragrances",
  accountNumber: "03XX-XXXXXXX-XX",
  easypaisa: "03XX-XXXXXXX",
  jazzcash: "03XX-XXXXXXX",
  whatsapp: SITE_CONTACT.whatsapp,
}

export function CheckoutPageContent() {
  const router = useRouter()
  const { detailedItems, cartCount, totalAmount, clearCart } = useCart()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [city, setCity] = useState("")
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")
  const [paymentType, setPaymentType] = useState<"advance" | "cod">("advance")
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer")
  const [paymentReference, setPaymentReference] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [whatsappMessage, setWhatsappMessage] = useState("")

  const orderItems = useMemo(
    () =>
      detailedItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        lineTotal: item.lineTotal,
      })),
    [detailedItems],
  )

  const discountAmount = useMemo(() => {
    if (paymentType !== "advance") return 0
    return Math.round(totalAmount * 0.1)
  }, [paymentType, totalAmount])

  const payableAmount = useMemo(() => totalAmount - discountAmount, [discountAmount, totalAmount])

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (orderItems.length === 0) {
      toast.error("Your cart is empty")
      return
    }

    if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      toast.error("Please fill all required checkout fields")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: fullName.trim(),
            phone: phone.trim(),
            city: city.trim(),
            address: address.trim(),
            email: email.trim() || null,
          },
          payment: {
            type: paymentType,
            method: paymentMethod,
            reference: paymentReference.trim() || null,
          },
          notes: notes.trim() || null,
          items: orderItems,
          totalItems: cartCount,
          subtotalAmount: totalAmount,
          discountAmount,
          payableAmount,
          totalAmount,
          whatsapp: PAYMENT_DETAILS.whatsapp,
        }),
      })

      const payload = (await response.json()) as CheckoutResponse
      if (!response.ok || !payload.success) {
        toast.error(payload.message ?? "Could not submit your order")
        return
      }

      const confirmedOrderId = payload.orderId ?? ""
      const fallbackMessage = [
        `Order ID: ${confirmedOrderId || "N/A"}`,
        `Name: ${fullName.trim()}`,
        `Phone: ${phone.trim()}`,
        `City: ${city.trim()}`,
        `Address: ${address.trim()}`,
        `Email: ${email.trim() || "N/A"}`,
        `Payment Type: ${paymentType === "cod" ? "Cash on Delivery" : "Advance Payment"}`,
        `Payment Method: ${paymentMethod}`,
        `Payment Ref: ${paymentReference.trim() || "N/A"}`,
        `Total Items: ${cartCount}`,
        `Subtotal: PKR ${totalAmount}`,
        `Discount: PKR ${discountAmount}`,
        `Payable Amount: PKR ${payableAmount}`,
        `Items: ${orderItems.map((item) => `${item.name} x${item.quantity} = PKR ${item.lineTotal}`).join(" | ")}`,
        `Notes: ${notes.trim() || "N/A"}`,
      ].join("\n")

      setOrderId(confirmedOrderId)
      setWhatsappMessage(payload.whatsappMessage ?? fallbackMessage)
      setIsSuccess(true)
      clearCart()
      if (payload.message) {
        toast.warning(payload.message)
      } else {
        toast.success("Order submitted successfully")
      }
    } catch {
      toast.error("Checkout failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyWhatsAppMessage = async () => {
    const text = whatsappMessage || `Order ${orderId || "(pending id)"} submitted.`
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Message copied")
    } catch {
      toast.error("Could not copy message")
    }
  }

  const openWhatsAppWithMessage = () => {
    const text = whatsappMessage || `Order ${orderId || "(pending id)"} submitted.`
    const link = `https://wa.me/${toWhatsappDigits(PAYMENT_DETAILS.whatsapp)}?text=${encodeURIComponent(text)}`
    window.open(link, "_blank", "noopener,noreferrer")
  }

  if (orderItems.length === 0 && !isSuccess) {
    return (
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl text-foreground mb-3">Checkout</h1>
          <p className="text-muted-foreground mb-6">Your cart is empty. Add products before checkout.</p>
          <Link href="/products">
            <Button className="rounded-full px-8">Explore products</Button>
          </Link>
        </div>
      </section>
    )
  }

  if (isSuccess) {
    return (
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 text-primary">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="font-serif text-4xl text-foreground mb-2">Order Submitted</h1>
            <p className="text-muted-foreground mb-4">Thank you. Your order has been received and saved.</p>
            {orderId && <p className="text-sm text-foreground mb-6">Order ID: {orderId}</p>}
            <p className="text-sm text-muted-foreground mb-6">
              {paymentType === "advance"
                ? "Please send your payment proof on WhatsApp. We will contact you for order confirmation. Thank you."
                : "Our team will contact you to confirm your Cash on Delivery order. Thank you."}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button className="w-full sm:w-auto rounded-full px-8" onClick={openWhatsAppWithMessage}>
                <MessageCircle className="h-4 w-4" /> Send order on WhatsApp
              </Button>
              <Button variant="outline" className="rounded-full bg-transparent" onClick={copyWhatsAppMessage}>
                <Copy className="h-4 w-4" /> Copy message
              </Button>
            </div>

            <Button variant="ghost" className="mt-6" onClick={() => router.push("/")}>Return to homepage</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Link href="/cart" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to cart
        </Link>

        <div className="mb-10">
          <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-5">
            Checkout
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">Complete Your Order</h1>
          <p className="text-muted-foreground max-w-2xl">
            Place order now. Advance payment gets 10% off. Cash on Delivery has no discount. We will contact you for confirmation.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
            <h2 className="font-serif text-2xl text-foreground">Delivery Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Full name *"
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Phone number *"
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="City *"
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email (optional)"
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
            </div>

            <textarea
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Complete delivery address *"
              className="min-h-24 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <select
                value={paymentType}
                onChange={(event) => {
                  const nextType = event.target.value as "advance" | "cod"
                  setPaymentType(nextType)
                  if (nextType === "cod") {
                    setPaymentMethod("Cash on Delivery")
                    setPaymentReference("")
                  } else {
                    setPaymentMethod("Bank Transfer")
                  }
                }}
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
              >
                <option value="advance">Advance Payment (10% Off)</option>
                <option value="cod">Cash on Delivery</option>
              </select>

              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
                disabled={paymentType === "cod"}
              >
                <option>Bank Transfer</option>
                <option>EasyPaisa</option>
                <option>JazzCash</option>
                {paymentType === "cod" && <option>Cash on Delivery</option>}
              </select>
            </div>

            {paymentType === "advance" && (
              <input
                value={paymentReference}
                onChange={(event) => setPaymentReference(event.target.value)}
                placeholder="Transaction reference (optional)"
                className="h-11 rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
            )}

            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Order note (optional)"
              className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
            />

            <Button type="submit" size="lg" className="w-full rounded-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting order..." : "Place order"}
            </Button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-2xl text-foreground mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                {orderItems.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                    <span className="text-foreground">{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-border/70 pt-4 text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span className={paymentType === "advance" ? "text-primary font-medium" : "text-muted-foreground"}>
                  {paymentType === "advance" ? `- ${formatCurrency(discountAmount)} (10%)` : formatCurrency(0)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-border/70 pt-4 text-base font-semibold">
                <span>Payable</span>
                <span>{formatCurrency(payableAmount)}</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {paymentType === "advance" ? "Advance payment selected: 10% discount applied." : "Cash on Delivery selected: no discount."}
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6">
              <h3 className="font-serif text-2xl text-foreground mb-4">Payment Details</h3>
              {paymentType === "advance" ? (
                <>
                  <div className="space-y-3 text-sm">
                    <p>
                      <span className="text-muted-foreground">Bank:</span> {PAYMENT_DETAILS.bankName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Account title:</span> {PAYMENT_DETAILS.accountTitle}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Account number:</span> {PAYMENT_DETAILS.accountNumber}
                    </p>
                    <p>
                      <span className="text-muted-foreground">EasyPaisa:</span> {PAYMENT_DETAILS.easypaisa}
                    </p>
                    <p>
                      <span className="text-muted-foreground">JazzCash:</span> {PAYMENT_DETAILS.jazzcash}
                    </p>
                    <p>
                      <span className="text-muted-foreground">WhatsApp:</span> {PAYMENT_DETAILS.whatsapp}
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Transfer payment first, then send proof on WhatsApp. Your order will be confirmed manually after verification. Thank you.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Cash on Delivery selected. You will be contacted on phone/WhatsApp for confirmation before dispatch. Thank you.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
