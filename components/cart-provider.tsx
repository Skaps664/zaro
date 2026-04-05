"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { toast } from "sonner"
import { getProductById, getProductPrice } from "@/lib/products"
import { getSupabaseBrowserClient, hasSupabaseEnv } from "@/lib/supabase"

type CartItem = {
  productId: string
  quantity: number
  name?: string
  image?: string
  price?: number
}

type AddCartProduct = {
  id: string
  name: string
  image: string
  price?: number
}

type CartProduct = {
  productId: string
  quantity: number
  name: string
  image: string
  price: number
  originalPrice?: number
  lineTotal: number
}

type FeaturedDropSale = {
  productId: string
  discountPercentage: number
}

type SavedOrder = {
  id: string
  createdAt: string
  totalItems: number
  totalAmount: number
  status: string
  items: CartItem[]
}

type CartContextValue = {
  items: CartItem[]
  detailedItems: CartProduct[]
  cartCount: number
  totalAmount: number
  featuredDropDiscountAmount: number
  isCartOpen: boolean
  isSubmittingOrder: boolean
  currentUser: User | null
  currentSession: Session | null
  hasSupabaseEnv: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: string | AddCartProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => Promise<void>
  loadMyOrders: () => Promise<SavedOrder[]>
  placeOrder: () => Promise<{ success: boolean; orderId?: string; message?: string }>
}

const CartContext = createContext<CartContextValue | null>(null)

const CART_STORAGE_KEY = "zaru_cart_v1"

function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return []

  const normalized: CartItem[] = []

  value.forEach((item) => {
      if (!item || typeof item !== "object") return null
      const productId = String((item as { productId?: unknown }).productId ?? "")
      const quantity = Number((item as { quantity?: unknown }).quantity ?? 0)
      const name = (item as { name?: unknown }).name
      const image = (item as { image?: unknown }).image
      const price = Number((item as { price?: unknown }).price ?? NaN)

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) return
      const staticProduct = getProductById(productId)
      if (!staticProduct && typeof name !== "string") return

      normalized.push({
        productId,
        quantity: Math.floor(quantity),
        name: typeof name === "string" ? name : staticProduct?.name,
        image: typeof image === "string" ? image : staticProduct?.image,
        price: Number.isFinite(price) ? price : undefined,
      })
    })

  return normalized
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [featuredDropSale, setFeaturedDropSale] = useState<FeaturedDropSale | null>(null)

  const supabase = useMemo(() => getSupabaseBrowserClient(), [])

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const fromStorage = window.localStorage.getItem(CART_STORAGE_KEY)
      if (fromStorage) {
        const parsed = JSON.parse(fromStorage) as unknown
        setItems(normalizeCartItems(parsed))
      }
    } catch {
      setItems([])
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [isHydrated, items])

  useEffect(() => {
    if (!supabase) return

    void supabase.auth.getSession().then(({ data }) => {
      setCurrentSession(data.session)
      setCurrentUser(data.session?.user ?? null)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session)
      setCurrentUser(session?.user ?? null)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    let isMounted = true

    const loadFeaturedDropSale = async () => {
      try {
        const res = await fetch("/api/storefront/sale", { cache: "no-store" })
        const payload = (await res.json()) as {
          success: boolean
          sale?: { productId?: string; discountPercentage?: number } | null
        }

        if (!isMounted || !res.ok || !payload.success) return

        const productId = String(payload.sale?.productId ?? "").trim()
        const discountPercentage = Number(payload.sale?.discountPercentage ?? 0)

        if (!productId || !Number.isFinite(discountPercentage) || discountPercentage <= 0) {
          setFeaturedDropSale(null)
          return
        }

        setFeaturedDropSale({
          productId,
          discountPercentage: Math.max(0, Math.min(90, Math.round(discountPercentage))),
        })
      } catch {
        if (isMounted) {
          setFeaturedDropSale(null)
        }
      }
    }

    void loadFeaturedDropSale()

    return () => {
      isMounted = false
    }
  }, [])

  const detailedItems = useMemo<CartProduct[]>(() => {
    return items
      .map((item) => {
        const product = getProductById(item.productId)
        if (!product && !item.name) return null

        const basePrice = typeof item.price === "number" ? item.price : getProductPrice(item.productId)
        const salePercent =
          featuredDropSale && featuredDropSale.productId === item.productId ? featuredDropSale.discountPercentage : 0
        const price = salePercent > 0 ? Math.max(0, Math.round(basePrice * (1 - salePercent / 100))) : basePrice
        return {
          productId: item.productId,
          quantity: item.quantity,
          name: item.name ?? product?.name ?? "ZARU Product",
          image: item.image ?? product?.image ?? "/placeholder.svg",
          price,
          originalPrice: salePercent > 0 ? basePrice : undefined,
          lineTotal: price * item.quantity,
        }
      })
      .filter((item): item is CartProduct => item !== null)
  }, [featuredDropSale, items])

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])
  const totalAmount = useMemo(() => detailedItems.reduce((sum, item) => sum + item.lineTotal, 0), [detailedItems])
  const featuredDropDiscountAmount = useMemo(
    () =>
      detailedItems.reduce((sum, item) => {
        const originalPrice = typeof item.originalPrice === "number" ? item.originalPrice : item.price
        return sum + (originalPrice - item.price) * item.quantity
      }, 0),
    [detailedItems],
  )

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const addItem = useCallback((productOrId: string | AddCartProduct, quantity = 1) => {
    const productId = typeof productOrId === "string" ? productOrId : productOrId.id
    const staticProduct = getProductById(productId)
    const snapshot =
      typeof productOrId === "string"
        ? {
            name: staticProduct?.name,
            image: staticProduct?.image,
            price: staticProduct?.price,
          }
        : {
            name: productOrId.name,
            image: productOrId.image,
            price: productOrId.price,
          }

    if (!staticProduct && typeof snapshot.name !== "string") return

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId)
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + Math.max(1, Math.floor(quantity)),
                name: item.name ?? snapshot.name,
                image: item.image ?? snapshot.image,
                price: typeof item.price === "number" ? item.price : snapshot.price,
              }
            : item,
        )
      }

      return [
        ...prev,
        {
          productId,
          quantity: Math.max(1, Math.floor(quantity)),
          name: snapshot.name,
          image: snapshot.image,
          price: snapshot.price,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return

    const normalized = Math.floor(quantity)
    if (normalized <= 0) {
      setItems((prev) => prev.filter((item) => item.productId !== productId))
      return
    }

    setItems((prev) => prev.map((item) => (item.productId === productId ? { ...item, quantity: normalized } : item)))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const signInWithEmail = useCallback(
    async (email: string) => {
      if (!supabase) {
        throw new Error("Supabase environment variables are missing.")
      }

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/account` : undefined,
        },
      })

      if (error) {
        throw new Error(error.message)
      }
    },
    [supabase],
  )

  const signOut = useCallback(async () => {
    if (!supabase) {
      throw new Error("Supabase environment variables are missing.")
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }, [supabase])

  const loadMyOrders = useCallback(async (): Promise<SavedOrder[]> => {
    if (!supabase || !currentUser) return []

    const { data, error } = await supabase
      .from("orders")
      .select("id, created_at, total_items, total_amount, status, items")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    return data.map((order) => ({
      id: String(order.id),
      createdAt: String(order.created_at),
      totalItems: Number(order.total_items ?? 0),
      totalAmount: Number(order.total_amount ?? 0),
      status: String(order.status ?? "pending"),
      items: normalizeCartItems(order.items),
    }))
  }, [currentUser, supabase])

  const placeOrder = useCallback(async () => {
    if (items.length === 0) {
      return { success: false, message: "Your cart is empty." }
    }

    if (!supabase || !currentUser) {
      return { success: false, message: "Please sign in to place an order." }
    }

    setIsSubmittingOrder(true)

    const payload = {
      user_id: currentUser.id,
      items,
      total_items: cartCount,
      total_amount: totalAmount,
      status: "pending",
    }

    const { data, error } = await supabase.from("orders").insert(payload).select("id").single()

    setIsSubmittingOrder(false)

    if (error) {
      return { success: false, message: error.message }
    }

    clearCart()
    closeCart()
    toast.success("Order placed successfully")

    return { success: true, orderId: String(data.id) }
  }, [cartCount, clearCart, closeCart, currentUser, items, supabase, totalAmount])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      detailedItems,
      cartCount,
      totalAmount,
      featuredDropDiscountAmount,
      isCartOpen,
      isSubmittingOrder,
      currentUser,
      currentSession,
      hasSupabaseEnv,
      openCart,
      closeCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      signInWithEmail,
      signOut,
      loadMyOrders,
      placeOrder,
    }),
    [
      addItem,
      cartCount,
      clearCart,
      closeCart,
      currentSession,
      currentUser,
      detailedItems,
      featuredDropDiscountAmount,
      isCartOpen,
      isSubmittingOrder,
      items,
      loadMyOrders,
      openCart,
      placeOrder,
      removeItem,
      signInWithEmail,
      signOut,
      totalAmount,
      updateQuantity,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}
