"use client"

import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type SavedOrder = {
  id: string
  createdAt: string
  totalItems: number
  totalAmount: number
  status: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function AccountPageContent() {
  const { currentUser, hasSupabaseEnv, signInWithEmail, signOut, loadMyOrders } = useCart()
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orders, setOrders] = useState<SavedOrder[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)

  useEffect(() => {
    if (!currentUser) {
      setOrders([])
      return
    }

    setIsLoadingOrders(true)
    void loadMyOrders()
      .then((rows) => {
        setOrders(
          rows.map((row) => ({
            id: row.id,
            createdAt: row.createdAt,
            totalItems: row.totalItems,
            totalAmount: row.totalAmount,
            status: row.status,
          })),
        )
      })
      .finally(() => setIsLoadingOrders(false))
  }, [currentUser, loadMyOrders])

  const handleMagicLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      toast.error("Please enter your email")
      return
    }

    setIsSubmitting(true)
    try {
      await signInWithEmail(email.trim())
      toast.success("Magic link sent. Check your inbox.")
      setEmail("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send sign-in link")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign out failed")
    }
  }

  return (
    <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-5">
            Account
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">Your Account</h1>
          <p className="text-muted-foreground max-w-2xl">
            Sign in to manage your orders. Every checkout from cart is saved to your profile.
          </p>
        </div>

        {!hasSupabaseEnv && (
          <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Supabase env vars are missing. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="rounded-3xl border border-border/60 bg-card p-6">
            {!currentUser ? (
              <>
                <h2 className="font-serif text-2xl text-foreground mb-2">Sign in with magic link</h2>
                <p className="text-sm text-muted-foreground mb-5">Use your email to securely access your saved orders.</p>

                <form className="space-y-3" onSubmit={handleMagicLink}>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
                  />
                  <Button type="submit" className="w-full rounded-full" disabled={isSubmitting || !hasSupabaseEnv}>
                    {isSubmitting ? "Sending link..." : "Send sign-in link"}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <h2 className="font-serif text-2xl text-foreground mb-1">Welcome back</h2>
                <p className="text-sm text-muted-foreground mb-5">{currentUser.email}</p>
                <Button variant="outline" className="rounded-full bg-transparent" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            )}
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <h3 className="font-serif text-2xl text-foreground mb-4">Saved Orders</h3>

            {!currentUser && <p className="text-sm text-muted-foreground">Sign in to see your order history.</p>}

            {currentUser && isLoadingOrders && <p className="text-sm text-muted-foreground">Loading orders...</p>}

            {currentUser && !isLoadingOrders && orders.length === 0 && (
              <p className="text-sm text-muted-foreground">No orders yet. Add products to cart and checkout.</p>
            )}

            {currentUser && orders.length > 0 && (
              <div className="space-y-3">
                {orders.map((order) => (
                  <article key={order.id} className="rounded-2xl border border-border/60 bg-background p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-medium text-foreground">Order #{order.id}</p>
                      <Badge variant="secondary" className="capitalize">
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()} · {order.totalItems} items
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">{formatCurrency(order.totalAmount)}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
