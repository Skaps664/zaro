"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartPageContent() {
  const { detailedItems, cartCount, totalAmount, featuredDropDiscountAmount, removeItem, updateQuantity } = useCart()
  const subtotalBeforeFeaturedDiscount = totalAmount + featuredDropDiscountAmount

  return (
    <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-10">
          <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-5">
            Cart
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">Your Fragrance Bag</h1>
          <p className="text-muted-foreground">{cartCount} items ready for checkout.</p>
        </div>

        {detailedItems.length === 0 ? (
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center">
            <div className="mb-4 inline-flex rounded-full border border-border/70 p-5 text-muted-foreground">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-3xl text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Start by adding your favorite scents from our collection.</p>
            <Link href="/products">
              <Button className="rounded-full px-8">Explore all products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            <div className="space-y-4">
              {detailedItems.map((item) => (
                <article key={item.productId} className="rounded-2xl border border-border/60 bg-card p-4 md:p-5">
                  <div className="flex gap-4">
                    <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {typeof item.originalPrice === "number" && item.originalPrice > item.price ? (
                          <>
                            <span className="line-through mr-1">{formatCurrency(item.originalPrice)}</span>
                            <span className="text-primary font-medium">{formatCurrency(item.price)} each</span>
                          </>
                        ) : (
                          `${formatCurrency(item.price)} each`
                        )}
                      </p>
                      <p className="text-sm text-foreground mt-1">{formatCurrency(item.lineTotal)}</p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border/70 bg-background">
                          <button
                            type="button"
                            aria-label={`Decrease quantity for ${item.name}`}
                            className="p-2 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity for ${item.name}`}
                            className="p-2 text-muted-foreground hover:text-foreground"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-3xl border border-border/60 bg-card p-6 h-fit">
              <h3 className="font-serif text-2xl text-foreground mb-4">Order Summary</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Items</span>
                <span>{cartCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotalBeforeFeaturedDiscount)}</span>
              </div>
              {featuredDropDiscountAmount > 0 && (
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Featured Drop Discount</span>
                  <span className="text-primary font-medium">- {formatCurrency(featuredDropDiscountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-semibold mb-6">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full rounded-full">
                  Proceed to checkout
                </Button>
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
