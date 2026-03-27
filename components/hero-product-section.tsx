"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/products"

type HeroProductSectionProps = {
  product?: Product
  eyebrow?: string
  title?: string
  subtitle?: string
  imageUrl?: string
  discountPercentage?: number
}

export function HeroProductSection({
  product,
  eyebrow = "Featured Drop",
  title = "One signature scent, made to stand out",
  subtitle = "Limited-time offer on our handpicked fragrance.",
  imageUrl,
  discountPercentage = 0,
}: HeroProductSectionProps) {
  const { addItem, openCart } = useCart()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return null
  }

  const salePercent = Number.isFinite(discountPercentage) ? Math.max(0, Math.min(90, Math.round(discountPercentage))) : 0
  const sellingPrice = typeof product.price === "number" ? product.price : 3490
  const originalPrice = salePercent > 0 ? Math.round(sellingPrice / (1 - salePercent / 100)) : null
  const displayImage = imageUrl || product.images?.[0] || product.image

  const formattedSelling = useMemo(
    () =>
      new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
        maximumFractionDigits: 0,
      }).format(sellingPrice),
    [sellingPrice],
  )

  const formattedOriginal = useMemo(() => {
    if (!originalPrice) return null
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(originalPrice)
  }, [originalPrice])

  const onAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        image: displayImage,
        price: product.price,
      },
      quantity,
    )
    openCart()
  }

  const onBuyNow = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        image: displayImage,
        price: product.price,
      },
      quantity,
    )
    router.push("/checkout")
  }

  return (
    <section className="py-20 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-3xl border border-border/60 bg-card p-6 md:p-8 lg:p-10">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-muted">
            <img src={displayImage} alt={product.name} className="w-full h-[380px] md:h-[460px] object-cover" loading="lazy" decoding="async" />
            {salePercent > 0 && (
              <span className="absolute top-4 left-4 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                {salePercent}% OFF
              </span>
            )}
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-3">{eyebrow}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3 text-balance">{title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{subtitle}</p>

            <p className="text-sm text-muted-foreground mb-1">{product.name}</p>
            <div className="flex items-end gap-3 mb-6">
              <p className="text-3xl font-semibold text-foreground">{formattedSelling}</p>
              {formattedOriginal && <p className="text-base text-muted-foreground line-through">{formattedOriginal}</p>}
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 px-2 py-1 mb-6">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-7 text-center text-sm font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="rounded-full px-8" onClick={onBuyNow}>
                Buy now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent" onClick={onAddToCart}>
                <ShoppingBag className="h-4 w-4" /> Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
