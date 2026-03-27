"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

type ProductDetailActionsProps = {
  product: {
    id: string
    name: string
    image: string
    price?: number
  }
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter()
  const { addItem, openCart } = useCart()

  const onAddToCart = () => {
    addItem(product)
    openCart()
  }

  const onBuyNow = () => {
    addItem(product)
    router.push("/checkout")
  }

  return (
    <div className="space-y-3">
      <Button size="lg" className="h-14 w-full rounded-full text-base md:text-lg" onClick={onBuyNow}>
        Buy now
      </Button>
      <div className="flex flex-wrap gap-3">
        <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent" onClick={onAddToCart}>
        Add to cart
        </Button>
        <Link href="/products">
          <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent">
            Explore all fragrances
          </Button>
        </Link>
      </div>
    </div>
  )
}
