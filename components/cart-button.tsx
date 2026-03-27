"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/components/cart-provider"

type CartButtonProps = {
  className?: string
  label?: string
  onClick?: () => void
  showText?: boolean
}

export function CartButton({ className, label = "Cart", onClick, showText = false }: CartButtonProps) {
  const { openCart, cartCount } = useCart()

  return (
    <button
      type="button"
      aria-label={label}
      className={className}
      onClick={() => {
        onClick?.()
        openCart()
      }}
    >
      <ShoppingBag className="w-5 h-5" />
      {showText && <span>Cart</span>}
      {cartCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </button>
  )
}
