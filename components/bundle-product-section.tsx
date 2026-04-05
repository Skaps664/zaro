"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/products"

type BundleProductSectionProps = {
  firstProduct?: Product
  secondProduct?: Product
  eyebrow?: string
  title?: string
  subtitle?: string
  customPrice?: number
  discountPercentage?: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

export function BundleProductSection({
  firstProduct,
  secondProduct,
  eyebrow = "Bundle Offer",
  title = "Pair your favorites and save more",
  subtitle = "Choose two bestsellers as one bundle with a custom deal price.",
  customPrice = 0,
  discountPercentage = 0,
}: BundleProductSectionProps) {
  const { addItem, openCart } = useCart()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  if (!firstProduct || !secondProduct || firstProduct.id === secondProduct.id) {
    return null
  }

  const safeDiscount = Number.isFinite(discountPercentage) ? Math.max(0, Math.min(90, Math.round(discountPercentage))) : 0
  const firstPrice = typeof firstProduct.price === "number" ? firstProduct.price : 3490
  const secondPrice = typeof secondProduct.price === "number" ? secondProduct.price : 3490
  const baseBundlePrice = customPrice > 0 ? Math.round(customPrice) : firstPrice + secondPrice
  const sellingPrice = safeDiscount > 0 ? Math.max(0, Math.round(baseBundlePrice * (1 - safeDiscount / 100))) : baseBundlePrice
  const sectionEyebrow = eyebrow?.trim() || "Bundle Product Section"
  const sectionTitle = title?.trim() || "Pair your favorites and save more"
  const sectionSubtitle = subtitle?.trim() || "Choose two bestsellers as one bundle with a custom deal price."

  const bundleId = `bundle:${firstProduct.id}+${secondProduct.id}`
  const bundleName = `${firstProduct.name.replace(/^ZARU\s+/i, "")} + ${secondProduct.name.replace(/^ZARU\s+/i, "")} Bundle`
  const bundleImage = firstProduct.images?.[0] || firstProduct.image || secondProduct.images?.[0] || secondProduct.image

  const onAddToCart = () => {
    addItem(
      {
        id: bundleId,
        name: bundleName,
        image: bundleImage,
        price: sellingPrice,
      },
      quantity,
    )
    openCart()
  }

  const onBuyNow = () => {
    addItem(
      {
        id: bundleId,
        name: bundleName,
        image: bundleImage,
        price: sellingPrice,
      },
      quantity,
    )
    router.push("/checkout")
  }

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10 lg:mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">Bundle Deals</p>
          <h2 className="font-serif text-3xl text-foreground text-balance mb-4 md:text-6xl font-light">
            Perfect Pair for Him & Her
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Two fragrances, one smarter price for everyday luxury.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-5 md:p-8 lg:p-10">
          <div className="pointer-events-none absolute -top-20 -right-14 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />

          <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-8 lg:gap-10 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg shadow-black/5">
                  <img
                    src={firstProduct.images?.[0] || firstProduct.image}
                    alt={firstProduct.name}
                    className="w-full h-[250px] sm:h-[320px] md:h-[410px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute left-3 bottom-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                    {firstProduct.name.replace(/^ZARU\s+/i, "")}
                  </span>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg shadow-black/5 mt-8 md:mt-12">
                  <img
                    src={secondProduct.images?.[0] || secondProduct.image}
                    alt={secondProduct.name}
                    className="w-full h-[250px] sm:h-[320px] md:h-[410px] object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="absolute left-3 bottom-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                    {secondProduct.name.replace(/^ZARU\s+/i, "")}
                  </span>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/60 bg-background shadow-lg px-3 py-2 text-xs font-semibold text-foreground">
                BUNDLE
              </div>

              {safeDiscount > 0 && (
                <span className="absolute -top-2 -left-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-lg">
                  SAVE {safeDiscount}%
                </span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground">
                  Bundle On
                </span>
                <span className="rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground">
                  {sectionEyebrow}
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3 leading-tight text-balance">{sectionTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">{sectionSubtitle}</p>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 mb-5">
                <p className="text-sm text-foreground font-medium mb-1">{bundleName}</p>
                <p className="text-xs text-muted-foreground">
                  Includes: {firstProduct.name.replace(/^ZARU\s+/i, "")} + {secondProduct.name.replace(/^ZARU\s+/i, "")}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-3">
                  <p className="text-3xl md:text-4xl font-semibold text-foreground">{formatCurrency(sellingPrice)}</p>
                  {safeDiscount > 0 && <p className="text-base text-muted-foreground line-through mb-1">{formatCurrency(baseBundlePrice)}</p>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">One complete bundle price</p>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-2 py-1 mb-6">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                  aria-label="Decrease bundle quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-7 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                  aria-label="Increase bundle quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="rounded-full px-8" onClick={onBuyNow}>
                  Buy bundle now
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent" onClick={onAddToCart}>
                  <ShoppingBag className="h-4 w-4" /> Add bundle to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
