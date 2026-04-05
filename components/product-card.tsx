"use client"

import type { KeyboardEvent, MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { getProductPrice, type Product } from "@/lib/products"

type ProductCardProps = {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const router = useRouter()
  const { addItem, openCart } = useCart()
  const price = typeof product.price === "number" ? product.price : getProductPrice(product.id)
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images.slice(0, 4) : [product.image]
  const primaryImage = images[0] ?? "/placeholder.svg"
  const secondaryImage = images[1]

  const formattedPrice = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price)

  const goToProduct = () => {
    router.push(`/products/${encodeURIComponent(product.id)}`)
  }

  const addToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      image: primaryImage,
      price: product.price,
    })
    openCart()
  }

  const buyNow = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    goToProduct()
  }

  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Open ${product.name}`}
      onClick={goToProduct}
      onKeyDown={(event: KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          goToProduct()
        }
      }}
      className="group cursor-pointer rounded-3xl border border-border/60 bg-card overflow-hidden shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500"
    >
      <div className={`relative bg-muted overflow-hidden ${compact ? "aspect-[4/5]" : "aspect-square"}`}>
        <img
          src={primaryImage}
          alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-700 ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-105"}`}
        />
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate image`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <span className="absolute top-4 left-4 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-foreground">
          {product.category}
        </span>
        {images.length > 1 && (
          <span className="absolute bottom-4 right-4 rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-foreground">
            {images.length} photos
          </span>
        )}
      </div>

      <div className={compact ? "p-5 md:p-6" : "p-6 lg:p-8"}>
        <h3 className={`font-serif text-foreground mb-2 ${compact ? "text-2xl" : "text-3xl"}`}>
          {product.name.replace("ZARU ", "")}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">Inspired by {product.inspiredBy}</p>
        <p className="text-base font-semibold text-foreground mb-4">{formattedPrice}</p>
        <p className={`text-muted-foreground leading-relaxed mb-6 line-clamp-3 min-h-[4.5rem] ${compact ? "text-sm" : ""}`}>
          {product.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 rounded-full" onClick={buyNow}>
            Buy now
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="flex-1 rounded-full bg-transparent" onClick={addToCart}>
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  )
}
