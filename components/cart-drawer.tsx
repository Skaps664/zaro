"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function CartDrawer() {
  const {
    isCartOpen,
    closeCart,
    detailedItems,
    cartCount,
    totalAmount,
    featuredDropDiscountAmount,
    removeItem,
    updateQuantity,
  } = useCart()
  const subtotalBeforeFeaturedDiscount = totalAmount + featuredDropDiscountAmount

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? undefined : closeCart())}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader className="border-b border-border/70 px-6 py-5">
          <div className="flex items-center gap-2">
            <SheetTitle className="font-serif text-2xl">Your Cart</SheetTitle>
            <Badge variant="secondary">{cartCount} items</Badge>
          </div>
          <SheetDescription>Review your items and proceed to checkout.</SheetDescription>
        </SheetHeader>

        {detailedItems.length === 0 ? (
          <div className="flex h-full min-h-[50vh] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full border border-border/60 p-5 text-muted-foreground">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="font-serif text-2xl text-foreground mb-2">Cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Add a fragrance you love, then checkout to store the order in your account.
            </p>
            <Link href="/products" onClick={closeCart}>
              <Button className="rounded-full px-8">Browse fragrances</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {detailedItems.map((item) => (
                <article key={item.productId} className="rounded-2xl border border-border/70 bg-card p-4">
                  <div className="flex gap-4">
                    <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover bg-muted" />
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

            <SheetFooter className="border-t border-border/70 px-6 py-5 bg-muted/20">
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between text-base">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">{formatCurrency(subtotalBeforeFeaturedDiscount)}</span>
                </div>
                {featuredDropDiscountAmount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Featured Drop Discount Applied</span>
                    <span className="text-primary font-medium">- {formatCurrency(featuredDropDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-base">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold text-foreground">{formatCurrency(totalAmount)}</span>
                </div>

                <Link href="/checkout" onClick={closeCart} className="block">
                  <Button className="w-full rounded-full" size="lg">
                    Proceed to checkout
                  </Button>
                </Link>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
