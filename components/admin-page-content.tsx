"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import {
  BarChart3,
  Boxes,
  Home as HomeIcon,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Package,
  Pencil,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Truck,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AdminProduct = {
  id: string
  name: string
  inspired_by: string
  category: string
  audience: "Male" | "Female" | "Unisex"
  notes: string[]
  description: string
  longevity: string
  projection: string
  best_for: string
  time: string
  image: string
  images?: string[]
  video_embed_url?: string | null
  price: number
  is_hero: boolean
  hide_on_all_products?: boolean
}

type VideoReview = {
  id: string
  name: string
  title: string
  duration: string
  thumbnail: string
  videoUrl: string
}

const defaultVideoReviews: VideoReview[] = [
  {
    id: "review-1",
    name: "Ayaan",
    title: "Victory Crown Reaction",
    duration: "0:42",
    thumbnail: "/images/fragrance-victory-crown.jpg",
    videoUrl: "",
  },
  {
    id: "review-2",
    name: "Lina",
    title: "Wild Storm First Wear",
    duration: "0:55",
    thumbnail: "/images/fragrance-wild-storm.jpg",
    videoUrl: "",
  },
  {
    id: "review-3",
    name: "Ravi",
    title: "Blue Legacy Compliments",
    duration: "0:38",
    thumbnail: "/images/fragrance-blue-legacy.jpg",
    videoUrl: "",
  },
  {
    id: "review-4",
    name: "Customer 4",
    title: "Loved the longevity",
    duration: "0:45",
    thumbnail: "/images/hero-zaru.jpg",
    videoUrl: "",
  },
  {
    id: "review-5",
    name: "Customer 5",
    title: "Great projection",
    duration: "0:40",
    thumbnail: "/images/hero-zaru.jpg",
    videoUrl: "",
  },
]

function normalizeVideoReviews(raw: unknown): VideoReview[] {
  const incoming = Array.isArray(raw) ? raw : []
  return defaultVideoReviews.map((fallback, index) => {
    const candidate = incoming[index] as Partial<VideoReview> | undefined
    return {
      id: candidate?.id || fallback.id,
      name: candidate?.name || fallback.name,
      title: candidate?.title || fallback.title,
      duration: candidate?.duration || fallback.duration,
      thumbnail: candidate?.thumbnail || fallback.thumbnail,
      videoUrl: candidate?.videoUrl || "",
    }
  })
}

type SiteSettings = {
  hero_image_url: string
  banner_image_1: string
  banner_image_2: string
  hero_title_line1: string
  hero_title_line2: string
  hero_subtitle: string
  hero_products_eyebrow: string
  hero_products_title: string
  hero_products_subtitle: string
  video_reviews_heading: string
  video_reviews_subheading: string
  video_reviews: VideoReview[]
  spotlight_subtitle: string
  spotlight_title: string
  spotlight_paragraph_1: string
  spotlight_paragraph_2: string
  mission_eyebrow: string
  mission_title: string
  mission_paragraph: string
  mission_cta: string
  products_page_title: string
  products_page_description: string
  hero_product_ids: string[]
  hero_single_eyebrow: string
  hero_single_title: string
  hero_single_subtitle: string
  hero_single_image_url: string
  hero_single_discount_percentage: number
  hero_single_product_id: string
  bundle_section_eyebrow: string
  bundle_section_title: string
  bundle_section_subtitle: string
  bundle_first_product_id: string
  bundle_second_product_id: string
  bundle_custom_price: number
  bundle_discount_percentage: number
}

type Order = {
  id: string
  order_code: string
  customer_name: string
  customer_phone: string
  customer_email?: string | null
  customer_city: string
  customer_address: string
  payment_type: string
  payment_method: string
  payment_reference?: string | null
  subtotal_amount: number
  discount_amount: number
  payable_amount: number
  total_items: number
  items?: Array<{
    id?: string
    name?: string
    quantity?: number
    price?: number
    lineTotal?: number
  }>
  status: string
  payment_status: string
  tracking_info?: string | null
  tracking_courier?: string | null
  notes?: string | null
  created_at: string
}

const TRACKING_COURIERS = ["TCS", "Leopard", "Postex", "M&P"] as const

const defaultSettings: SiteSettings = {
  hero_image_url: "/zaru-hero-2.png",
  banner_image_1: "/sope.jpg",
  banner_image_2: "/images/mission-luxury-scent.jpg",
  hero_title_line1: "Premium Fragrance",
  hero_title_line2: "Perfected for You",
  hero_subtitle: "High-accuracy fragrance impressions with enhanced longevity. Luxury at a smart price point.",
  hero_products_eyebrow: "Hero Fragrances",
  hero_products_title: "Scents crafted with precision",
  hero_products_subtitle: "Experience luxury without compromise.",
  video_reviews_heading: "Video Reviews",
  video_reviews_subheading: "Here's what our customer think about our products",
  video_reviews: defaultVideoReviews,
  spotlight_subtitle: "Inside ZARU",
  spotlight_title: "Crafted for presence, designed for everyday wear",
  spotlight_paragraph_1:
    "Every bottle is blended to capture the spirit of iconic fragrances while staying wearable, modern, and distinctly yours.",
  spotlight_paragraph_2:
    "From first spray to dry-down, ZARU balances richness and clarity so your scent feels premium from morning to night.",
  mission_eyebrow: "Our Mission",
  mission_title: "Luxury without compromise",
  mission_paragraph:
    "At ZARU, we're redefining what luxury fragrance means. We believe premium quality shouldn't require a premium price tag. Every fragrance is meticulously crafted to deliver the same emotional experience, accuracy, and longevity as designer scents.",
  mission_cta: "Start exploring",
  products_page_title: "All 14 ZARU Fragrances",
  products_page_description: "Original-like scents. Stronger performance. Smarter price.",
  hero_product_ids: [],
  hero_single_eyebrow: "Featured Drop",
  hero_single_title: "One signature scent, made to stand out",
  hero_single_subtitle: "Limited-time offer on our handpicked fragrance.",
  hero_single_image_url: "",
  hero_single_discount_percentage: 20,
  hero_single_product_id: "",
  bundle_section_eyebrow: "Bundle Offer",
  bundle_section_title: "Pair your favorites and save more",
  bundle_section_subtitle: "Choose two bestsellers as one bundle with a custom deal price.",
  bundle_first_product_id: "",
  bundle_second_product_id: "",
  bundle_custom_price: 0,
  bundle_discount_percentage: 0,
}

const defaultProductForm = {
  id: "",
  name: "",
  inspiredBy: "",
  category: "",
  audience: "Unisex" as "Male" | "Female" | "Unisex",
  notes: "",
  description: "",
  longevity: "",
  projection: "",
  bestFor: "",
  time: "",
  images: [] as string[],
  videoEmbedUrl: "",
  price: 3490,
  isHero: false,
  hideOnAllProducts: false,
}

type AdminTab = "dashboard" | "orders" | "products" | "home" | "sale-bundle" | "products-page"
type OrderStatusTab = "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

const NAV_SECTIONS: Array<{
  label: string
  items: Array<{ id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }>
}> = [
  {
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Sales",
    items: [{ id: "orders", label: "Orders", icon: ListOrdered }],
  },
  {
    label: "Catalog",
    items: [{ id: "products", label: "Products", icon: Boxes }],
  },
  {
    label: "Storefront",
    items: [
      { id: "home", label: "Home Page", icon: HomeIcon },
      { id: "products-page", label: "Products Page", icon: Package },
      { id: "sale-bundle", label: "Sale & Bundles", icon: Percent },
    ],
  },
]

const ORDER_STATUS_OPTIONS: OrderStatusTab[] = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]

const STATUS_TONE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-sky-100 text-sky-900 border-sky-200",
  shipped: "bg-violet-100 text-violet-900 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-900 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 border-rose-200",
}

const PAYMENT_TONE: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-900 border-emerald-200",
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  unpaid: "bg-muted text-muted-foreground border-border",
  failed: "bg-rose-100 text-rose-900 border-rose-200",
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value)
}

const inputCls =
  "h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
const textareaCls =
  "min-h-24 w-full rounded-lg border border-border/70 bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
const labelCls = "text-xs font-medium text-muted-foreground uppercase tracking-wide"

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function SectionCard({
  title,
  description,
  children,
  actions,
}: {
  title: string
  description?: string
  children: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm">
      <div className="flex flex-col gap-2 border-b border-border/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )
}

export function AdminPageContent() {
  const [adminKey, setAdminKey] = useState("")
  const [savedAdminKey, setSavedAdminKey] = useState("")
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // product dialog
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [productForm, setProductForm] = useState(defaultProductForm)
  const [pendingProductImages, setPendingProductImages] = useState<File[]>([])
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false)
  const [productSearch, setProductSearch] = useState("")

  // order state
  const [orderStatusTab, setOrderStatusTab] = useState<OrderStatusTab>("all")
  const [orderSearch, setOrderSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // settings uploads
  const [pendingHeroImage, setPendingHeroImage] = useState<File | null>(null)
  const [pendingBanner1Image, setPendingBanner1Image] = useState<File | null>(null)
  const [pendingBanner2Image, setPendingBanner2Image] = useState<File | null>(null)
  const [pendingHeroProductImage, setPendingHeroProductImage] = useState<File | null>(null)
  const [pendingReviewVideoFiles, setPendingReviewVideoFiles] = useState<Record<string, File | null>>({})

  useEffect(() => {
    const stored = window.localStorage.getItem("zaru_admin_key")
    if (stored) {
      setAdminKey(stored)
      setSavedAdminKey(stored)
    }
  }, [])

  const canAccess = Boolean(savedAdminKey)

  const adminHeaders = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-key": savedAdminKey,
    }),
    [savedAdminKey],
  )

  const metrics = useMemo(() => {
    const pendingOrders = orders.filter((order) => order.status === "pending").length
    const shippedOrders = orders.filter((order) => order.status === "shipped").length
    const deliveredOrders = orders.filter((order) => order.status === "delivered").length
    const paidOrders = orders.filter((order) => order.payment_status === "paid")
    return {
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      totalRevenue: orders.reduce((sum, order) => sum + Number(order.payable_amount || 0), 0),
      paidRevenue: paidOrders.reduce((sum, order) => sum + Number(order.payable_amount || 0), 0),
    }
  }, [orders, products])

  const orderCountsByStatus = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length }
    for (const status of ORDER_STATUS_OPTIONS) {
      if (status === "all") continue
      counts[status] = orders.filter((order) => order.status === status).length
    }
    return counts
  }, [orders])

  const filteredOrders = useMemo(() => {
    const term = orderSearch.trim().toLowerCase()
    return orders.filter((order) => {
      if (orderStatusTab !== "all" && order.status !== orderStatusTab) return false
      if (!term) return true
      return (
        order.order_code.toLowerCase().includes(term) ||
        order.customer_name.toLowerCase().includes(term) ||
        order.customer_phone.toLowerCase().includes(term) ||
        (order.customer_email ?? "").toLowerCase().includes(term) ||
        order.customer_city.toLowerCase().includes(term)
      )
    })
  }, [orders, orderStatusTab, orderSearch])

  const filteredProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term) ||
        (product.category ?? "").toLowerCase().includes(term) ||
        (product.inspired_by ?? "").toLowerCase().includes(term),
    )
  }, [products, productSearch])

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders])

  const loadData = async () => {
    if (!savedAdminKey) return

    setIsLoading(true)
    try {
      const [productsRes, settingsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products", { headers: adminHeaders }),
        fetch("/api/admin/settings", { headers: adminHeaders }),
        fetch("/api/admin/orders", { headers: adminHeaders }),
      ])

      const productsPayload = (await productsRes.json()) as { success: boolean; products?: AdminProduct[]; message?: string }
      const settingsPayload = (await settingsRes.json()) as { success: boolean; settings?: SiteSettings; message?: string }
      const ordersPayload = (await ordersRes.json()) as { success: boolean; orders?: Order[]; message?: string }

      if (!productsRes.ok || !productsPayload.success) throw new Error(productsPayload.message ?? "Failed to load products")
      if (!settingsRes.ok || !settingsPayload.success) throw new Error(settingsPayload.message ?? "Failed to load settings")
      if (!ordersRes.ok || !ordersPayload.success) throw new Error(ordersPayload.message ?? "Failed to load orders")

      setProducts(productsPayload.products ?? [])
      const merged = { ...defaultSettings, ...(settingsPayload.settings ?? {}) }
      setSettings({ ...merged, video_reviews: normalizeVideoReviews(merged.video_reviews) })
      setOrders(ordersPayload.orders ?? [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Admin load failed")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [savedAdminKey])

  const unlockAdmin = () => {
    if (!adminKey.trim()) {
      toast.error("Enter admin key")
      return
    }
    window.localStorage.setItem("zaru_admin_key", adminKey.trim())
    setSavedAdminKey(adminKey.trim())
  }

  const signOut = () => {
    window.localStorage.removeItem("zaru_admin_key")
    setSavedAdminKey("")
    setAdminKey("")
    toast.success("Signed out")
  }

  const resetProductForm = () => {
    setEditingId(null)
    setProductForm(defaultProductForm)
    setPendingProductImages([])
  }

  const openNewProductDialog = () => {
    resetProductForm()
    setProductDialogOpen(true)
  }

  const uploadAsset = async (file: File, folder: string) => {
    const form = new FormData()
    form.append("file", file)
    form.append("folder", folder)

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-key": savedAdminKey },
      body: form,
    })

    const payload = (await res.json()) as { success: boolean; url?: string; message?: string }
    if (!res.ok || !payload.success || !payload.url) {
      throw new Error(payload.message ?? "Upload failed")
    }

    return payload.url
  }

  const uploadProductImages = async () => {
    if (pendingProductImages.length === 0) {
      toast.error("Select images first")
      return
    }
    if (productForm.images.length + pendingProductImages.length > 4) {
      toast.error("Maximum 4 product images allowed")
      return
    }

    setIsUploading(true)
    try {
      const urls = await Promise.all(pendingProductImages.map((file) => uploadAsset(file, "products")))
      setProductForm((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 4) }))
      setPendingProductImages([])
      toast.success("Product images uploaded")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const uploadSettingImage = async (kind: "hero" | "banner1" | "banner2" | "hero-product") => {
    const file =
      kind === "hero"
        ? pendingHeroImage
        : kind === "banner1"
          ? pendingBanner1Image
          : kind === "banner2"
            ? pendingBanner2Image
            : pendingHeroProductImage
    if (!file) {
      toast.error("Select image first")
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadAsset(file, "banners")
      setSettings((prev) => {
        if (kind === "hero") return { ...prev, hero_image_url: url }
        if (kind === "banner1") return { ...prev, banner_image_1: url }
        if (kind === "hero-product") return { ...prev, hero_single_image_url: url }
        return { ...prev, banner_image_2: url }
      })
      if (kind === "hero") setPendingHeroImage(null)
      if (kind === "banner1") setPendingBanner1Image(null)
      if (kind === "banner2") setPendingBanner2Image(null)
      if (kind === "hero-product") setPendingHeroProductImage(null)
      toast.success("Image uploaded")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const saveProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!productForm.id.trim() || !productForm.name.trim()) {
      toast.error("Product id and name are required")
      return
    }

    if (productForm.images.length === 0) {
      toast.error("Upload at least one product image")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        product: {
          id: productForm.id.trim(),
          name: productForm.name.trim(),
          inspiredBy: productForm.inspiredBy.trim(),
          category: productForm.category.trim(),
          audience: productForm.audience,
          notes: productForm.notes
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          description: productForm.description.trim(),
          longevity: productForm.longevity.trim(),
          projection: productForm.projection.trim(),
          bestFor: productForm.bestFor.trim(),
          time: productForm.time.trim(),
          image: productForm.images[0],
          images: productForm.images,
          videoEmbedUrl: productForm.videoEmbedUrl.trim() || null,
          price: Number(productForm.price || 0),
          isHero: productForm.isHero,
          hideOnAllProducts: productForm.hideOnAllProducts,
        },
      }

      const method = editingId ? "PUT" : "POST"
      const res = await fetch("/api/admin/products", {
        method,
        headers: adminHeaders,
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Save failed")

      toast.success(editingId ? "Product updated" : "Product created")
      resetProductForm()
      setProductDialogOpen(false)
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const editProduct = (product: AdminProduct) => {
    setEditingId(product.id)
    setProductForm({
      id: product.id,
      name: product.name,
      inspiredBy: product.inspired_by,
      category: product.category,
      audience: product.audience,
      notes: (product.notes ?? []).join(", "),
      description: product.description,
      longevity: product.longevity,
      projection: product.projection,
      bestFor: product.best_for,
      time: product.time,
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : product.image ? [product.image] : [],
      videoEmbedUrl: product.video_embed_url ?? "",
      price: product.price ?? 3490,
      isHero: Boolean(product.is_hero),
      hideOnAllProducts: Boolean(product.hide_on_all_products),
    })
    setProductDialogOpen(true)
  }

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: adminHeaders,
      })
      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Delete failed")
      toast.success("Product deleted")
      if (editingId === id) resetProductForm()
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed")
    }
  }

  const buildSettingsPayload = (overrides?: Partial<{ heroProductIds: string[] }>) => ({
    heroImageUrl: settings.hero_image_url,
    bannerImage1: settings.banner_image_1,
    bannerImage2: settings.banner_image_2,
    heroTitleLine1: settings.hero_title_line1,
    heroTitleLine2: settings.hero_title_line2,
    heroSubtitle: settings.hero_subtitle,
    heroProductsEyebrow: settings.hero_products_eyebrow,
    heroProductsTitle: settings.hero_products_title,
    heroProductsSubtitle: settings.hero_products_subtitle,
    videoReviewsHeading: settings.video_reviews_heading,
    videoReviewsSubheading: settings.video_reviews_subheading,
    videoReviews: settings.video_reviews,
    spotlightSubtitle: settings.spotlight_subtitle,
    spotlightTitle: settings.spotlight_title,
    spotlightParagraph1: settings.spotlight_paragraph_1,
    spotlightParagraph2: settings.spotlight_paragraph_2,
    missionEyebrow: settings.mission_eyebrow,
    missionTitle: settings.mission_title,
    missionParagraph: settings.mission_paragraph,
    missionCta: settings.mission_cta,
    productsPageTitle: settings.products_page_title,
    productsPageDescription: settings.products_page_description,
    heroProductIds: overrides?.heroProductIds ?? settings.hero_product_ids,
    heroSingleEyebrow: settings.hero_single_eyebrow,
    heroSingleTitle: settings.hero_single_title,
    heroSingleSubtitle: settings.hero_single_subtitle,
    heroSingleImageUrl: settings.hero_single_image_url,
    heroSingleDiscountPercentage: settings.hero_single_discount_percentage,
    heroSingleProductId: settings.hero_single_product_id,
    bundleSectionEyebrow: settings.bundle_section_eyebrow,
    bundleSectionTitle: settings.bundle_section_title,
    bundleSectionSubtitle: settings.bundle_section_subtitle,
    bundleFirstProductId: settings.bundle_first_product_id,
    bundleSecondProductId: settings.bundle_second_product_id,
    bundleCustomPrice: settings.bundle_custom_price,
    bundleDiscountPercentage: settings.bundle_discount_percentage,
  })

  const deleteAllProducts = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/products?all=true", {
        method: "DELETE",
        headers: adminHeaders,
      })
      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Delete failed")

      const settingsRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({
          settings: buildSettingsPayload({ heroProductIds: [] }),
        }),
      })

      const settingsJson = (await settingsRes.json()) as { success: boolean; message?: string }
      if (!settingsRes.ok || !settingsJson.success) {
        throw new Error(settingsJson.message ?? "Products deleted, but failed clearing hero selection")
      }

      setSettings((prev) => ({ ...prev, hero_product_ids: [] }))
      resetProductForm()
      toast.success("All products deleted and hero selection reset")
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed")
    } finally {
      setIsSaving(false)
    }
  }

  const saveHomeSettings = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ settings: buildSettingsPayload() }),
      })

      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Save failed")
      if (json.message) {
        toast.warning(json.message)
      } else {
        toast.success("Home page settings saved")
      }
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const saveAllProductsPageSettings = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ settings: buildSettingsPayload() }),
      })

      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Save failed")
      if (json.message) {
        toast.warning(json.message)
      } else {
        toast.success("Products page settings saved")
      }

      // Persist product visibility toggles
      await Promise.all(
        products.map((product) =>
          fetch("/api/admin/products", {
            method: "PUT",
            headers: adminHeaders,
            body: JSON.stringify({
              product: {
                id: product.id,
                name: product.name,
                inspiredBy: product.inspired_by,
                category: product.category,
                audience: product.audience,
                notes: product.notes,
                description: product.description,
                longevity: product.longevity,
                projection: product.projection,
                bestFor: product.best_for,
                time: product.time,
                image: product.image,
                images: product.images,
                videoEmbedUrl: product.video_embed_url,
                price: product.price,
                isHero: product.is_hero,
                hideOnAllProducts: Boolean(product.hide_on_all_products),
              },
            }),
          }),
        ),
      )

      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const saveHeroProductSettings = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ settings: buildSettingsPayload() }),
      })

      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Save failed")
      if (json.message) {
        toast.warning(json.message)
      } else {
        toast.success("Sale & bundle settings saved")
      }
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const updateOrder = async (order: Order) => {
    // Client-side guard mirroring the server rule
    if (order.status === "shipped") {
      const hasCourier = Boolean(order.tracking_courier && (TRACKING_COURIERS as readonly string[]).includes(order.tracking_courier))
      const hasTracking = Boolean(order.tracking_info && order.tracking_info.trim())
      if (!hasCourier || !hasTracking) {
        toast.error("Select a courier and enter a tracking number before marking as shipped")
        return
      }
    }

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({
          order: {
            status: order.status,
            paymentStatus: order.payment_status,
            trackingInfo: order.tracking_info ?? null,
            trackingCourier: order.tracking_courier ?? null,
          },
        }),
      })
      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Update failed")
      toast.success(`Order ${order.order_code} updated`)
      setSelectedOrder(null)
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Order update failed")
    }
  }

  const updateVideoReview = (id: string, key: keyof VideoReview, value: string) => {
    setSettings((prev) => ({
      ...prev,
      video_reviews: prev.video_reviews.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    }))
  }

  const uploadReviewVideo = async (id: string) => {
    const file = pendingReviewVideoFiles[id]
    if (!file) {
      toast.error("Select a video file first")
      return
    }

    setIsUploading(true)
    try {
      const url = await uploadAsset(file, "reviews")
      updateVideoReview(id, "videoUrl", url)
      setPendingReviewVideoFiles((prev) => ({ ...prev, [id]: null }))
      toast.success("Review video uploaded")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  if (!canAccess) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-muted/30 px-6 py-24">
        <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">ZARU Admin</h1>
              <p className="text-xs text-muted-foreground">Enter your admin key to continue</p>
            </div>
          </div>
          <div className="space-y-3">
            <Field label="Admin Key">
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") unlockAdmin()
                }}
                placeholder="Enter admin key"
                className={inputCls}
                autoFocus
              />
            </Field>
            <Button className="w-full" onClick={unlockAdmin}>
              Sign in to dashboard
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const activeNavLabel =
    NAV_SECTIONS.flatMap((section) => section.items).find((item) => item.id === activeTab)?.label ?? "Dashboard"

  return (
    <div className="min-h-screen bg-muted/30 pt-24">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 lg:px-8">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-28 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">ZARU Admin</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Control panel</p>
              </div>
            </div>
            <nav className="space-y-4">
              {NAV_SECTIONS.map((section) => (
                <div key={section.label}>
                  <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const active = activeTab === item.id
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="mt-6 border-t border-border/60 pt-3">
              <button
                onClick={signOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 space-y-6">
          {/* Mobile nav */}
          <div className="lg:hidden -mx-1 overflow-x-auto pb-2">
            <div className="flex gap-1 px-1">
              {NAV_SECTIONS.flatMap((section) => section.items).map((item) => {
                const Icon = item.icon
                const active = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-card text-muted-foreground border border-border/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Topbar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Store Admin / {activeNavLabel}</p>
              <h1 className="text-xl font-semibold text-foreground">{activeNavLabel}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-900 sm:inline">
                Signed in
              </span>
              <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="lg:hidden">
                <LogOut className="mr-2 h-3.5 w-3.5" />
                Sign out
              </Button>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === "dashboard" && (
            <DashboardView metrics={metrics} recentOrders={recentOrders} onOpenOrder={(o) => { setSelectedOrder(o); setActiveTab("orders") }} />
          )}

          {activeTab === "orders" && (
            <OrdersView
              orders={filteredOrders}
              statusTab={orderStatusTab}
              onStatusTabChange={setOrderStatusTab}
              counts={orderCountsByStatus}
              search={orderSearch}
              onSearchChange={setOrderSearch}
              onSelectOrder={setSelectedOrder}
            />
          )}

          {activeTab === "products" && (
            <ProductsView
              products={filteredProducts}
              totalCount={products.length}
              search={productSearch}
              onSearchChange={setProductSearch}
              onNew={openNewProductDialog}
              onEdit={editProduct}
              onDelete={setDeleteProductId}
              onDeleteAll={() => setConfirmDeleteAll(true)}
            />
          )}

          {activeTab === "home" && (
            <HomePageView
              settings={settings}
              products={products}
              setSettings={setSettings}
              updateVideoReview={updateVideoReview}
              pendingHeroImage={pendingHeroImage}
              setPendingHeroImage={setPendingHeroImage}
              pendingBanner1Image={pendingBanner1Image}
              setPendingBanner1Image={setPendingBanner1Image}
              pendingBanner2Image={pendingBanner2Image}
              setPendingBanner2Image={setPendingBanner2Image}
              pendingReviewVideoFiles={pendingReviewVideoFiles}
              setPendingReviewVideoFiles={setPendingReviewVideoFiles}
              isUploading={isUploading}
              isSaving={isSaving}
              uploadSettingImage={uploadSettingImage}
              uploadReviewVideo={uploadReviewVideo}
              onSave={saveHomeSettings}
            />
          )}

          {activeTab === "products-page" && (
            <ProductsPageView
              settings={settings}
              setSettings={setSettings}
              products={products}
              setProducts={setProducts}
              isSaving={isSaving}
              onSave={saveAllProductsPageSettings}
            />
          )}

          {activeTab === "sale-bundle" && (
            <SaleBundleView
              settings={settings}
              setSettings={setSettings}
              products={products}
              pendingHeroProductImage={pendingHeroProductImage}
              setPendingHeroProductImage={setPendingHeroProductImage}
              isUploading={isUploading}
              isSaving={isSaving}
              uploadSettingImage={uploadSettingImage}
              onSave={saveHeroProductSettings}
            />
          )}
        </div>
      </div>

      {/* Product dialog */}
      <Dialog open={productDialogOpen} onOpenChange={(open) => { setProductDialogOpen(open); if (!open) resetProductForm() }}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit product" : "New product"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Update the product details and save." : "Create a new product for your catalog."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={saveProduct} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Slug ID" hint={editingId ? "Cannot be changed" : "Lowercase, hyphens (used in URL)"}>
                <input
                  value={productForm.id}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, id: event.target.value }))}
                  className={inputCls}
                  disabled={Boolean(editingId)}
                  required
                />
              </Field>
              <Field label="Name">
                <input
                  value={productForm.name}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                  className={inputCls}
                  required
                />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Inspired by">
                <input
                  value={productForm.inspiredBy}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, inspiredBy: event.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Category">
                <input
                  value={productForm.category}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Audience">
                <select
                  value={productForm.audience}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, audience: event.target.value as "Male" | "Female" | "Unisex" }))
                  }
                  className={inputCls}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </Field>
              <Field label="Price (PKR)">
                <input
                  type="number"
                  value={String(productForm.price)}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, price: Number(event.target.value || 0) }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Time of day">
                <input
                  value={productForm.time}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, time: event.target.value }))}
                  placeholder="Day / Night"
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Longevity">
                <input
                  value={productForm.longevity}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, longevity: event.target.value }))}
                  className={inputCls}
                />
              </Field>
              <Field label="Projection">
                <input
                  value={productForm.projection}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, projection: event.target.value }))}
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Best for">
              <input
                value={productForm.bestFor}
                onChange={(event) => setProductForm((prev) => ({ ...prev, bestFor: event.target.value }))}
                className={inputCls}
              />
            </Field>

            <Field label="Notes" hint="Comma separated">
              <input
                value={productForm.notes}
                onChange={(event) => setProductForm((prev) => ({ ...prev, notes: event.target.value }))}
                className={inputCls}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                className={textareaCls}
              />
            </Field>

            <Field label="Product video URL" hint="YouTube watch/share/embed">
              <input
                value={productForm.videoEmbedUrl}
                onChange={(event) => setProductForm((prev) => ({ ...prev, videoEmbedUrl: event.target.value }))}
                className={inputCls}
              />
            </Field>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Product images (max 4)
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setPendingProductImages(Array.from(event.target.files ?? []).slice(0, 4))}
                className="text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void uploadProductImages()}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload images"}
              </Button>

              {productForm.images.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-4">
                  {productForm.images.map((image) => (
                    <div key={image} className="rounded-lg border border-border/60 bg-background p-2">
                      <img src={image} alt="product" className="h-20 w-full rounded object-cover mb-2" />
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-full text-xs"
                        onClick={() =>
                          setProductForm((prev) => ({ ...prev, images: prev.images.filter((item) => item !== image) }))
                        }
                      >
                        <X className="h-3 w-3 mr-1" /> Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={productForm.isHero}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, isHero: event.target.checked }))}
                />
                Hero candidate
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={productForm.hideOnAllProducts}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, hideOnAllProducts: event.target.checked }))
                  }
                />
                Hide on all products page
              </label>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Save changes" : "Create product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete single product confirm */}
      <AlertDialog open={Boolean(deleteProductId)} onOpenChange={(open) => { if (!open) setDeleteProductId(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the product from your catalog. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteProductId) void deleteProduct(deleteProductId)
                setDeleteProductId(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete all products confirm */}
      <AlertDialog open={confirmDeleteAll} onOpenChange={setConfirmDeleteAll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete ALL products?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes every product from the catalog and clears any hero selections. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void deleteAllProducts()
                setConfirmDeleteAll(false)
              }}
            >
              Delete everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order dialog */}
      <OrderDialog
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onSave={updateOrder}
        onChange={(next) => setSelectedOrder(next)}
      />
    </div>
  )
}

/* ============================================================
   DASHBOARD
============================================================ */
function DashboardView({
  metrics,
  recentOrders,
  onOpenOrder,
}: {
  metrics: {
    totalOrders: number
    totalProducts: number
    pendingOrders: number
    shippedOrders: number
    deliveredOrders: number
    totalRevenue: number
    paidRevenue: number
  }
  recentOrders: Order[]
  onOpenOrder: (order: Order) => void
}) {
  const cards = [
    { label: "Total Orders", value: metrics.totalOrders, tone: "text-foreground" },
    { label: "Pending", value: metrics.pendingOrders, tone: "text-amber-700" },
    { label: "Shipped", value: metrics.shippedOrders, tone: "text-violet-700" },
    { label: "Delivered", value: metrics.deliveredOrders, tone: "text-emerald-700" },
  ]
  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${card.tone}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total Revenue (Payable)</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{formatCurrency(metrics.totalRevenue)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across all orders</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Paid Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">{formatCurrency(metrics.paidRevenue)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Orders marked paid</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Catalog</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{metrics.totalProducts}</p>
          <p className="mt-1 text-xs text-muted-foreground">Active products</p>
        </div>
      </div>

      <SectionCard title="Recent orders" description="Latest 5 orders received">
        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_code}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div>{order.customer_name}</div>
                      <div className="text-xs">{order.customer_phone}</div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.payable_amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${STATUS_TONE[order.status] ?? "border-border text-foreground"}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => onOpenOrder(order)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}

/* ============================================================
   ORDERS VIEW
============================================================ */
function OrdersView({
  orders,
  statusTab,
  onStatusTabChange,
  counts,
  search,
  onSearchChange,
  onSelectOrder,
}: {
  orders: Order[]
  statusTab: OrderStatusTab
  onStatusTabChange: (value: OrderStatusTab) => void
  counts: Record<string, number>
  search: string
  onSearchChange: (value: string) => void
  onSelectOrder: (order: Order) => void
}) {
  return (
    <div className="space-y-4">
      <SectionCard
        title="Orders"
        description="Filter by status, search, and click a row to update tracking."
      >
        <Tabs value={statusTab} onValueChange={(value) => onStatusTabChange(value as OrderStatusTab)}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="flex w-full flex-wrap gap-1 sm:w-auto">
              {ORDER_STATUS_OPTIONS.map((status) => (
                <TabsTrigger key={status} value={status} className="capitalize">
                  {status}
                  <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {counts[status] ?? 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search by code, name, phone..."
                className="h-9 w-full rounded-lg border border-border/70 bg-background pl-9 pr-3 text-sm"
              />
            </div>
          </div>
        </Tabs>

        <div className="mt-4 overflow-x-auto">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
              No orders in this view.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Placed</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="cursor-pointer" onClick={() => onSelectOrder(order)}>
                    <TableCell className="font-medium">{order.order_code}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="text-foreground">{order.customer_name}</div>
                      <div className="text-xs">{order.customer_phone}</div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{order.customer_city}</TableCell>
                    <TableCell>{formatCurrency(order.payable_amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${PAYMENT_TONE[order.payment_status] ?? "border-border text-foreground"}`}
                      >
                        {order.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${STATUS_TONE[order.status] ?? "border-border text-foreground"}`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">
                      {order.tracking_info
                        ? `${order.tracking_courier ? `${order.tracking_courier} · ` : ""}${order.tracking_info}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(event) => {
                          event.stopPropagation()
                          onSelectOrder(order)
                        }}
                      >
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

/* ============================================================
   ORDER DIALOG
============================================================ */
function OrderDialog({
  order,
  onClose,
  onChange,
  onSave,
}: {
  order: Order | null
  onClose: () => void
  onChange: (order: Order) => void
  onSave: (order: Order) => void | Promise<void>
}) {
  if (!order) return null
  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order #{order.order_code}
            <Badge variant="outline" className={`capitalize ${STATUS_TONE[order.status]}`}>
              {order.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Placed {new Date(order.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Customer</p>
            <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
            {order.customer_email && <p className="text-sm text-muted-foreground">{order.customer_email}</p>}
            <p className="text-sm text-muted-foreground mt-2">
              {order.customer_address}, {order.customer_city}
            </p>
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Payment</p>
            <p className="text-sm text-foreground capitalize">
              {order.payment_type} · {order.payment_method}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Ref: {order.payment_reference ?? "N/A"}</p>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal_amount)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>- {formatCurrency(order.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-foreground">
                <span>Payable</span>
                <span>{formatCurrency(order.payable_amount)}</span>
              </div>
            </div>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
              Items ({order.total_items})
            </p>
            <ul className="space-y-1 text-sm">
              {order.items.map((item, index) => (
                <li key={`${order.id}-${index}`} className="flex items-center justify-between">
                  <span className="text-foreground">
                    {item.name ?? "Item"} <span className="text-muted-foreground">× {item.quantity ?? 1}</span>
                  </span>
                  {typeof item.lineTotal === "number" && (
                    <span className="text-muted-foreground">{formatCurrency(item.lineTotal)}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-lg border border-border/60 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Update</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Order status">
              <select
                value={order.status}
                onChange={(event) => onChange({ ...order, status: event.target.value })}
                className={inputCls}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </Field>

            <Field label="Payment status">
              <select
                value={order.payment_status}
                onChange={(event) => onChange({ ...order, payment_status: event.target.value })}
                className={inputCls}
              >
                <option value="unpaid">Unpaid</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </Field>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Courier" hint="Required when marking as shipped">
              <select
                value={order.tracking_courier ?? ""}
                onChange={(event) => onChange({ ...order, tracking_courier: event.target.value || null })}
                className={inputCls}
              >
                <option value="">Select courier</option>
                <option value="TCS">TCS</option>
                <option value="Leopard">Leopard</option>
                <option value="Postex">Postex</option>
                <option value="M&P">M&amp;P</option>
              </select>
            </Field>

            <Field label="Tracking number" hint="Shown to the customer">
              <div className="relative">
                <Truck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={order.tracking_info ?? ""}
                  onChange={(event) => onChange({ ...order, tracking_info: event.target.value })}
                  placeholder="e.g. 1234567890"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </Field>
          </div>

          {order.status === "shipped" && (!order.tracking_courier || !order.tracking_info?.trim()) && (
            <p className="mt-2 text-xs text-rose-700">
              You must pick a courier and enter a tracking number to mark this order as shipped.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Close</Button>
          </DialogClose>
          <Button type="button" onClick={() => void onSave(order)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ============================================================
   PRODUCTS VIEW
============================================================ */
function ProductsView({
  products,
  totalCount,
  search,
  onSearchChange,
  onNew,
  onEdit,
  onDelete,
  onDeleteAll,
}: {
  products: AdminProduct[]
  totalCount: number
  search: string
  onSearchChange: (v: string) => void
  onNew: () => void
  onEdit: (p: AdminProduct) => void
  onDelete: (id: string) => void
  onDeleteAll: () => void
}) {
  return (
    <SectionCard
      title="Products"
      description={`${products.length} of ${totalCount} products shown`}
      actions={
        <>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products..."
              className="h-9 w-full rounded-lg border border-border/70 bg-background pl-9 pr-3 text-sm"
            />
          </div>
          <Button size="sm" onClick={onNew}>
            <Plus className="mr-1 h-4 w-4" /> Add product
          </Button>
          <Button size="sm" variant="outline" onClick={onDeleteAll} className="text-rose-700">
            <Trash2 className="mr-1 h-4 w-4" /> Delete all
          </Button>
        </>
      }
    >
      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
          No products found. Click <strong>Add product</strong> to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover border border-border/60"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{product.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.category || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{product.audience}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        product.hide_on_all_products
                          ? "border-rose-200 bg-rose-50 text-rose-900"
                          : "border-emerald-200 bg-emerald-50 text-emerald-900"
                      }
                    >
                      {product.hide_on_all_products ? "Hidden" : "Visible"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" onClick={() => onEdit(product)}>
                        <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-rose-700 hover:text-rose-800"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </SectionCard>
  )
}

/* ============================================================
   HOME PAGE SETTINGS
============================================================ */
function HomePageView({
  settings,
  products,
  setSettings,
  updateVideoReview,
  pendingHeroImage,
  setPendingHeroImage,
  pendingBanner1Image,
  setPendingBanner1Image,
  pendingBanner2Image,
  setPendingBanner2Image,
  pendingReviewVideoFiles,
  setPendingReviewVideoFiles,
  isUploading,
  isSaving,
  uploadSettingImage,
  uploadReviewVideo,
  onSave,
}: {
  settings: SiteSettings
  products: AdminProduct[]
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>
  updateVideoReview: (id: string, key: keyof VideoReview, value: string) => void
  pendingHeroImage: File | null
  setPendingHeroImage: React.Dispatch<React.SetStateAction<File | null>>
  pendingBanner1Image: File | null
  setPendingBanner1Image: React.Dispatch<React.SetStateAction<File | null>>
  pendingBanner2Image: File | null
  setPendingBanner2Image: React.Dispatch<React.SetStateAction<File | null>>
  pendingReviewVideoFiles: Record<string, File | null>
  setPendingReviewVideoFiles: React.Dispatch<React.SetStateAction<Record<string, File | null>>>
  isUploading: boolean
  isSaving: boolean
  uploadSettingImage: (kind: "hero" | "banner1" | "banner2" | "hero-product") => Promise<void>
  uploadReviewVideo: (id: string) => Promise<void>
  onSave: () => Promise<void>
}) {
  return (
    <div className="space-y-6">
      <SectionCard title="Hero Section" description="The top banner shown on the home page.">
        <Field label="Hero image URL">
          <input
            value={settings.hero_image_url}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero_image_url: event.target.value }))}
            className={inputCls}
          />
        </Field>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input type="file" accept="image/*" onChange={(event) => setPendingHeroImage(event.target.files?.[0] ?? null)} className="text-xs" />
          <Button type="button" variant="outline" size="sm" onClick={() => void uploadSettingImage("hero")} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload hero image"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title line 1">
            <input
              value={settings.hero_title_line1}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_title_line1: event.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Title line 2">
            <input
              value={settings.hero_title_line2}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_title_line2: event.target.value }))}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea
            value={settings.hero_subtitle}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero_subtitle: event.target.value }))}
            className={textareaCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Hero Products" description="Featured products on the home page.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Eyebrow">
            <input
              value={settings.hero_products_eyebrow}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_products_eyebrow: event.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Title">
            <input
              value={settings.hero_products_title}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_products_title: event.target.value }))}
              className={`${inputCls} sm:col-span-2`}
            />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea
            value={settings.hero_products_subtitle}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero_products_subtitle: event.target.value }))}
            className={textareaCls}
          />
        </Field>

        <div>
          <p className={labelCls}>Select hero products</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => {
              const selected = settings.hero_product_ids.includes(product.id)
              return (
                <label key={product.id} className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(event) => {
                      setSettings((prev) => {
                        if (event.target.checked) {
                          return { ...prev, hero_product_ids: [...prev.hero_product_ids, product.id] }
                        }
                        return { ...prev, hero_product_ids: prev.hero_product_ids.filter((id) => id !== product.id) }
                      })
                    }}
                  />
                  {product.name}
                </label>
              )
            })}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Video Reviews" description="Customer video testimonials shown on home.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Heading">
            <input
              value={settings.video_reviews_heading}
              onChange={(event) => setSettings((prev) => ({ ...prev, video_reviews_heading: event.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Subheading">
            <input
              value={settings.video_reviews_subheading}
              onChange={(event) => setSettings((prev) => ({ ...prev, video_reviews_subheading: event.target.value }))}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="space-y-3">
          {settings.video_reviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-border/60 bg-background p-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name">
                  <input value={review.name} onChange={(event) => updateVideoReview(review.id, "name", event.target.value)} className={inputCls} />
                </Field>
                <Field label="Title">
                  <input value={review.title} onChange={(event) => updateVideoReview(review.id, "title", event.target.value)} className={inputCls} />
                </Field>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Duration">
                  <input value={review.duration} onChange={(event) => updateVideoReview(review.id, "duration", event.target.value)} placeholder="0:42" className={inputCls} />
                </Field>
                <Field label="Thumbnail URL">
                  <input value={review.thumbnail} onChange={(event) => updateVideoReview(review.id, "thumbnail", event.target.value)} className={inputCls} />
                </Field>
              </div>
              <Field label="Video URL">
                <input value={review.videoUrl} onChange={(event) => updateVideoReview(review.id, "videoUrl", event.target.value)} className={inputCls} />
              </Field>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => setPendingReviewVideoFiles((prev) => ({ ...prev, [review.id]: event.target.files?.[0] ?? null }))}
                  className="text-xs"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void uploadReviewVideo(review.id)}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload video"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Spotlight" description="Story section on the home page.">
        <div className="rounded-lg border border-border/60 bg-background p-4 space-y-3">
          <Field label="Spotlight image URL">
            <input value={settings.banner_image_1} onChange={(event) => setSettings((prev) => ({ ...prev, banner_image_1: event.target.value }))} className={inputCls} />
          </Field>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input type="file" accept="image/*" onChange={(event) => setPendingBanner1Image(event.target.files?.[0] ?? null)} className="text-xs" />
            <Button type="button" variant="outline" size="sm" onClick={() => void uploadSettingImage("banner1")} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload spotlight image"}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Subtitle">
            <input value={settings.spotlight_subtitle} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_subtitle: event.target.value }))} className={inputCls} />
          </Field>
          <Field label="Title">
            <input value={settings.spotlight_title} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_title: event.target.value }))} className={inputCls} />
          </Field>
        </div>
        <Field label="Paragraph 1">
          <textarea value={settings.spotlight_paragraph_1} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_paragraph_1: event.target.value }))} className={textareaCls} />
        </Field>
        <Field label="Paragraph 2">
          <textarea value={settings.spotlight_paragraph_2} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_paragraph_2: event.target.value }))} className={textareaCls} />
        </Field>
      </SectionCard>

      <div className="sticky bottom-4 z-10">
        <div className="flex justify-end rounded-xl border border-border/60 bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <Button onClick={() => void onSave()} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save home page settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   ALL PRODUCTS PAGE SETTINGS
============================================================ */
function ProductsPageView({
  settings,
  setSettings,
  products,
  setProducts,
  isSaving,
  onSave,
}: {
  settings: SiteSettings
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>
  products: AdminProduct[]
  setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>>
  isSaving: boolean
  onSave: () => Promise<void>
}) {
  return (
    <div className="space-y-6">
      <SectionCard title="All Products page copy" description="Header text on the /products page.">
        <Field label="Heading">
          <input
            value={settings.products_page_title}
            onChange={(event) => setSettings((prev) => ({ ...prev, products_page_title: event.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            value={settings.products_page_description}
            onChange={(event) => setSettings((prev) => ({ ...prev, products_page_description: event.target.value }))}
            className={textareaCls}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Product visibility" description="Uncheck a product to hide it from the /products page.">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <label
              key={product.id}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={!product.hide_on_all_products}
                onChange={(event) =>
                  setProducts((prev) =>
                    prev.map((item) =>
                      item.id === product.id ? { ...item, hide_on_all_products: !event.target.checked } : item,
                    ),
                  )
                }
              />
              {product.name}
            </label>
          ))}
        </div>
      </SectionCard>

      <div className="sticky bottom-4 z-10">
        <div className="flex justify-end rounded-xl border border-border/60 bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <Button onClick={() => void onSave()} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save products page"}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   SALE & BUNDLE
============================================================ */
function SaleBundleView({
  settings,
  setSettings,
  products,
  pendingHeroProductImage,
  setPendingHeroProductImage,
  isUploading,
  isSaving,
  uploadSettingImage,
  onSave,
}: {
  settings: SiteSettings
  setSettings: React.Dispatch<React.SetStateAction<SiteSettings>>
  products: AdminProduct[]
  pendingHeroProductImage: File | null
  setPendingHeroProductImage: React.Dispatch<React.SetStateAction<File | null>>
  isUploading: boolean
  isSaving: boolean
  uploadSettingImage: (kind: "hero" | "banner1" | "banner2" | "hero-product") => Promise<void>
  onSave: () => Promise<void>
}) {
  return (
    <div className="space-y-6">
      <SectionCard title="Sale Product Section" description="Featured single-product sale block.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={settings.hero_single_eyebrow}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_eyebrow: event.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Title">
            <input
              value={settings.hero_single_title}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_title: event.target.value }))}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea
            value={settings.hero_single_subtitle}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_subtitle: event.target.value }))}
            className={textareaCls}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Product">
            <select
              value={settings.hero_single_product_id}
              onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_product_id: event.target.value }))}
              className={inputCls}
            >
              <option value="">Select product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Discount %">
            <input
              type="number"
              min={0}
              max={90}
              value={settings.hero_single_discount_percentage}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  hero_single_discount_percentage: Math.max(0, Math.min(90, Number(event.target.value || 0))),
                }))
              }
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Image URL (optional override)">
          <input
            value={settings.hero_single_image_url}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_image_url: event.target.value }))}
            className={inputCls}
          />
        </Field>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setPendingHeroProductImage(event.target.files?.[0] ?? null)}
            className="text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void uploadSettingImage("hero-product")}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload image"}
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Bundle Section" description="Pair two products at a bundle price.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Eyebrow">
            <input
              value={settings.bundle_section_eyebrow}
              onChange={(event) => setSettings((prev) => ({ ...prev, bundle_section_eyebrow: event.target.value }))}
              className={inputCls}
            />
          </Field>
          <Field label="Title">
            <input
              value={settings.bundle_section_title}
              onChange={(event) => setSettings((prev) => ({ ...prev, bundle_section_title: event.target.value }))}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea
            value={settings.bundle_section_subtitle}
            onChange={(event) => setSettings((prev) => ({ ...prev, bundle_section_subtitle: event.target.value }))}
            className={textareaCls}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="First product">
            <select
              value={settings.bundle_first_product_id}
              onChange={(event) => setSettings((prev) => ({ ...prev, bundle_first_product_id: event.target.value }))}
              className={inputCls}
            >
              <option value="">Select first product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Second product">
            <select
              value={settings.bundle_second_product_id}
              onChange={(event) => setSettings((prev) => ({ ...prev, bundle_second_product_id: event.target.value }))}
              className={inputCls}
            >
              <option value="">Select second product</option>
              {products
                .filter((product) => product.id !== settings.bundle_first_product_id)
                .map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
            </select>
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Custom bundle price (PKR)" hint="Set 0 to use sum of the two products.">
            <input
              type="number"
              min={0}
              value={settings.bundle_custom_price}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  bundle_custom_price: Math.max(0, Number(event.target.value || 0)),
                }))
              }
              className={inputCls}
            />
          </Field>
          <Field label="Bundle discount %">
            <input
              type="number"
              min={0}
              max={90}
              value={settings.bundle_discount_percentage}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  bundle_discount_percentage: Math.max(0, Math.min(90, Number(event.target.value || 0))),
                }))
              }
              className={inputCls}
            />
          </Field>
        </div>
      </SectionCard>

      <div className="sticky bottom-4 z-10">
        <div className="flex justify-end rounded-xl border border-border/60 bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <Button onClick={() => void onSave()} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save sale & bundles"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminPageContent
