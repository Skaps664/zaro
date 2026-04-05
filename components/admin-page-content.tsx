"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

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
  customer_city: string
  customer_address: string
  payment_type: string
  payment_method: string
  payment_reference?: string | null
  subtotal_amount: number
  discount_amount: number
  payable_amount: number
  status: string
  payment_status: string
  tracking_info?: string | null
  created_at: string
}

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

type AdminTab = "dashboard" | "orders" | "products" | "home" | "hero-product" | "all-products"

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [productForm, setProductForm] = useState(defaultProductForm)
  const [pendingProductImages, setPendingProductImages] = useState<File[]>([])
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
    return {
      totalOrders: orders.length,
      totalProducts: products.length,
      pendingOrders,
      totalRevenue: orders.reduce((sum, order) => sum + Number(order.payable_amount || 0), 0),
    }
  }, [orders, products])

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

  const resetProductForm = () => {
    setEditingId(null)
    setProductForm(defaultProductForm)
    setPendingProductImages([])
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
        body: JSON.stringify({
          settings: buildSettingsPayload(),
        }),
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
        body: JSON.stringify({
          settings: buildSettingsPayload(),
        }),
      })

      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Save failed")
      if (json.message) {
        toast.warning(json.message)
      } else {
        toast.success("All products page settings saved")
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
        toast.success("Hero product settings saved")
      }
      await loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed")
    } finally {
      setIsSaving(false)
    }
  }

  const updateOrder = async (order: Order) => {
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: adminHeaders,
        body: JSON.stringify({
          order: {
            status: order.status,
            paymentStatus: order.payment_status,
            trackingInfo: order.tracking_info ?? null,
          },
        }),
      })
      const json = (await res.json()) as { success: boolean; message?: string }
      if (!res.ok || !json.success) throw new Error(json.message ?? "Update failed")
      toast.success(`Order ${order.order_code} updated`)
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
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-xl mx-auto px-6 lg:px-8">
          <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
            <h1 className="font-serif text-3xl text-foreground">Admin Access</h1>
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter admin key"
              className="h-11 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
            />
            <Button className="rounded-full w-full" onClick={unlockAdmin}>
              Open Admin Panel
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-4">
            Admin
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">Store Admin Panel</h1>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {["dashboard", "orders", "products", "home", "hero-product", "all-products"].map((tab) => (
            <Button
              key={tab}
              variant="outline"
              className={
                activeTab === tab
                  ? "rounded-full border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                  : "rounded-full bg-transparent"
              }
              onClick={() => setActiveTab(tab as AdminTab)}
            >
              {tab === "all-products"
                ? "All Products Page"
                : tab === "home"
                  ? "Home Page"
                  : tab === "hero-product"
                    ? "Sale Product"
                    : tab[0].toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {isLoading && <p className="text-sm text-muted-foreground mb-6">Loading...</p>}

        {activeTab === "dashboard" && (
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="font-serif text-3xl text-foreground mt-2">{metrics.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="font-serif text-3xl text-foreground mt-2">{metrics.pendingOrders}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="font-serif text-3xl text-foreground mt-2">{metrics.totalProducts}</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <p className="text-sm text-muted-foreground">Revenue (Payable)</p>
              <p className="font-serif text-3xl text-foreground mt-2">PKR {Math.round(metrics.totalRevenue)}</p>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-3xl border border-border/60 bg-card p-5">
                <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <h3 className="font-medium text-foreground">{order.order_code}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {order.customer_name} · {order.customer_phone} · {order.customer_city}
                </p>
                <p className="text-sm text-muted-foreground mb-2">Address: {order.customer_address}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Payment: {order.payment_type} / {order.payment_method} · Ref: {order.payment_reference ?? "N/A"}
                </p>

                <div className="grid gap-3 md:grid-cols-4">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, status: event.target.value } : item)))
                    }
                    className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="packed">packed</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>

                  <select
                    value={order.payment_status}
                    onChange={(event) =>
                      setOrders((prev) => prev.map((item) => (item.id === order.id ? { ...item, payment_status: event.target.value } : item)))
                    }
                    className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                  >
                    <option value="unpaid">unpaid</option>
                    <option value="pending">pending</option>
                    <option value="paid">paid</option>
                    <option value="failed">failed</option>
                  </select>

                  <input
                    value={order.tracking_info ?? ""}
                    onChange={(event) =>
                      setOrders((prev) =>
                        prev.map((item) => (item.id === order.id ? { ...item, tracking_info: event.target.value } : item)),
                      )
                    }
                    placeholder="Tracking info"
                    className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                  />

                  <Button className="rounded-full" onClick={() => void updateOrder(order)}>
                    Save Order
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeTab === "products" && (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <form onSubmit={saveProduct} className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">{editingId ? "Edit Product" : "Create Product"}</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={productForm.id}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, id: event.target.value }))}
                  placeholder="Slug id"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                  disabled={Boolean(editingId)}
                />
                <input
                  value={productForm.name}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Product name"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={productForm.inspiredBy}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, inspiredBy: event.target.value }))}
                  placeholder="Inspired by"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
                <input
                  value={productForm.category}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
                  placeholder="Category"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={productForm.audience}
                  onChange={(event) =>
                    setProductForm((prev) => ({ ...prev, audience: event.target.value as "Male" | "Female" | "Unisex" }))
                  }
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
                <input
                  value={String(productForm.price)}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, price: Number(event.target.value || 0) }))}
                  placeholder="Price"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
                <input
                  value={productForm.time}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, time: event.target.value }))}
                  placeholder="Time"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={productForm.longevity}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, longevity: event.target.value }))}
                  placeholder="Longevity"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
                <input
                  value={productForm.projection}
                  onChange={(event) => setProductForm((prev) => ({ ...prev, projection: event.target.value }))}
                  placeholder="Projection"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <input
                value={productForm.bestFor}
                onChange={(event) => setProductForm((prev) => ({ ...prev, bestFor: event.target.value }))}
                placeholder="Best for"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
              />

              <div className="rounded-2xl border border-border/60 bg-background p-3 space-y-3">
                <p className="text-sm text-muted-foreground">Product images (max 4)</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => setPendingProductImages(Array.from(event.target.files ?? []).slice(0, 4))}
                  className="text-xs"
                />
                <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={() => void uploadProductImages()} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Upload images"}
                </Button>

                <div className="grid gap-2 sm:grid-cols-2">
                  {productForm.images.map((image) => (
                    <div key={image} className="rounded-xl border border-border/60 p-2">
                      <img src={image} alt="product" className="h-20 w-full rounded-lg object-cover mb-2" />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full bg-transparent"
                        onClick={() =>
                          setProductForm((prev) => ({ ...prev, images: prev.images.filter((item) => item !== image) }))
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <input
                value={productForm.videoEmbedUrl}
                onChange={(event) => setProductForm((prev) => ({ ...prev, videoEmbedUrl: event.target.value }))}
                placeholder="YouTube URL (watch/share/embed)"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
              <input
                value={productForm.notes}
                onChange={(event) => setProductForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Notes (comma separated)"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
                placeholder="Description"
                className="min-h-24 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={productForm.isHero}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, isHero: event.target.checked }))}
                  />
                  Select as hero candidate
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={productForm.hideOnAllProducts}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, hideOnAllProducts: event.target.checked }))}
                  />
                  Hide on all products page
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="rounded-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingId ? "Update Product" : "Create Product"}
                </Button>
                <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={resetProductForm}>
                  Reset
                </Button>
              </div>
            </form>

            <div className="rounded-3xl border border-border/60 bg-card p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-serif text-2xl text-foreground">Existing Products</h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full bg-transparent"
                  onClick={() => void deleteAllProducts()}
                  disabled={isSaving}
                >
                  Delete All Products
                </Button>
              </div>
              <div className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
                {products.map((product) => (
                  <article key={product.id} className="rounded-2xl border border-border/60 bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.id} · {product.category} · {product.hide_on_all_products ? "hidden" : "visible"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => editProduct(product)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-full bg-transparent" onClick={() => void deleteProduct(product.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "home" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">Hero Section</h2>
              <input value={settings.hero_image_url} onChange={(event) => setSettings((prev) => ({ ...prev, hero_image_url: event.target.value }))} placeholder="Hero image URL" className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input type="file" accept="image/*" onChange={(event) => setPendingHeroImage(event.target.files?.[0] ?? null)} className="text-xs" />
                <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={() => void uploadSettingImage("hero")} disabled={isUploading}>{isUploading ? "Uploading..." : "Upload hero image"}</Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={settings.hero_title_line1} onChange={(event) => setSettings((prev) => ({ ...prev, hero_title_line1: event.target.value }))} placeholder="Hero title line 1" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <input value={settings.hero_title_line2} onChange={(event) => setSettings((prev) => ({ ...prev, hero_title_line2: event.target.value }))} placeholder="Hero title line 2" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
              </div>
              <textarea value={settings.hero_subtitle} onChange={(event) => setSettings((prev) => ({ ...prev, hero_subtitle: event.target.value }))} placeholder="Hero subtitle" className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">Hero Products Section</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                <input value={settings.hero_products_eyebrow} onChange={(event) => setSettings((prev) => ({ ...prev, hero_products_eyebrow: event.target.value }))} placeholder="Eyebrow" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <input value={settings.hero_products_title} onChange={(event) => setSettings((prev) => ({ ...prev, hero_products_title: event.target.value }))} placeholder="Title" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm sm:col-span-2" />
              </div>
              <textarea value={settings.hero_products_subtitle} onChange={(event) => setSettings((prev) => ({ ...prev, hero_products_subtitle: event.target.value }))} placeholder="Subtitle" className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />

              <p className="text-sm text-muted-foreground">Select hero products:</p>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => {
                  const selected = settings.hero_product_ids.includes(product.id)
                  return (
                    <label key={product.id} className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
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

            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
              <h2 className="font-serif text-2xl text-foreground">Video Reviews</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input value={settings.video_reviews_heading} onChange={(event) => setSettings((prev) => ({ ...prev, video_reviews_heading: event.target.value }))} placeholder="Video section heading" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <input value={settings.video_reviews_subheading} onChange={(event) => setSettings((prev) => ({ ...prev, video_reviews_subheading: event.target.value }))} placeholder="Video section subheading" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
              </div>

              <div className="space-y-3">
                {settings.video_reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-border/60 bg-background p-3 space-y-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input value={review.name} onChange={(event) => updateVideoReview(review.id, "name", event.target.value)} placeholder="Reviewer name" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                      <input value={review.title} onChange={(event) => updateVideoReview(review.id, "title", event.target.value)} placeholder="Review title" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input value={review.duration} onChange={(event) => updateVideoReview(review.id, "duration", event.target.value)} placeholder="Duration (e.g. 0:42)" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                      <input value={review.thumbnail} onChange={(event) => updateVideoReview(review.id, "thumbnail", event.target.value)} placeholder="Thumbnail URL" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                    </div>
                    <input value={review.videoUrl} onChange={(event) => updateVideoReview(review.id, "videoUrl", event.target.value)} placeholder="Video URL" className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm" />
                    <div className="flex flex-wrap gap-2 items-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(event) =>
                          setPendingReviewVideoFiles((prev) => ({ ...prev, [review.id]: event.target.files?.[0] ?? null }))
                        }
                        className="text-xs"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="rounded-full bg-transparent"
                        onClick={() => void uploadReviewVideo(review.id)}
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Upload video"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-4">
              <h2 className="font-serif text-2xl text-foreground">Spotlight & Mission</h2>

              <div className="rounded-2xl border border-border/60 bg-background p-3 space-y-3">
                <p className="text-sm text-muted-foreground">Spotlight image</p>
                <input value={settings.banner_image_1} onChange={(event) => setSettings((prev) => ({ ...prev, banner_image_1: event.target.value }))} placeholder="Spotlight image URL" className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input type="file" accept="image/*" onChange={(event) => setPendingBanner1Image(event.target.files?.[0] ?? null)} className="text-xs" />
                  <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={() => void uploadSettingImage("banner1")} disabled={isUploading}>{isUploading ? "Uploading..." : "Upload spotlight image"}</Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input value={settings.spotlight_subtitle} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_subtitle: event.target.value }))} placeholder="Spotlight subtitle" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <input value={settings.spotlight_title} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_title: event.target.value }))} placeholder="Spotlight title" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
              </div>
              <textarea value={settings.spotlight_paragraph_1} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_paragraph_1: event.target.value }))} placeholder="Spotlight paragraph 1" className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />
              <textarea value={settings.spotlight_paragraph_2} onChange={(event) => setSettings((prev) => ({ ...prev, spotlight_paragraph_2: event.target.value }))} placeholder="Spotlight paragraph 2" className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />

              {/* <div className="rounded-2xl border border-border/60 bg-background p-3 space-y-3">
                <p className="text-sm text-muted-foreground">Mission image</p>
                <input value={settings.banner_image_2} onChange={(event) => setSettings((prev) => ({ ...prev, banner_image_2: event.target.value }))} placeholder="Mission image URL" className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input type="file" accept="image/*" onChange={(event) => setPendingBanner2Image(event.target.files?.[0] ?? null)} className="text-xs" />
                  <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={() => void uploadSettingImage("banner2")} disabled={isUploading}>{isUploading ? "Uploading..." : "Upload mission image"}</Button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input value={settings.mission_eyebrow} onChange={(event) => setSettings((prev) => ({ ...prev, mission_eyebrow: event.target.value }))} placeholder="Mission eyebrow" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
                <input value={settings.mission_title} onChange={(event) => setSettings((prev) => ({ ...prev, mission_title: event.target.value }))} placeholder="Mission title" className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm" />
              </div>
              <textarea value={settings.mission_paragraph} onChange={(event) => setSettings((prev) => ({ ...prev, mission_paragraph: event.target.value }))} placeholder="Mission paragraph" className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm" />
              <input value={settings.mission_cta} onChange={(event) => setSettings((prev) => ({ ...prev, mission_cta: event.target.value }))} placeholder="Mission CTA text" className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm" /> */}
            </div>

            <Button className="rounded-full" onClick={() => void saveHomeSettings()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Home Page Settings"}
            </Button>
          </div>
        )}

        {activeTab === "all-products" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">All Products Page Text</h2>
              <input
                value={settings.products_page_title}
                onChange={(event) => setSettings((prev) => ({ ...prev, products_page_title: event.target.value }))}
                placeholder="Heading"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
              />
              <textarea
                value={settings.products_page_description}
                onChange={(event) => setSettings((prev) => ({ ...prev, products_page_description: event.target.value }))}
                placeholder="Description"
                className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">Hide/Show Products</h2>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {products.map((product) => (
                  <label key={product.id} className="flex items-center gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm">
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
            </div>

            <Button className="rounded-full" onClick={() => void saveAllProductsPageSettings()} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save All Products Page"}
            </Button>
          </div>
        )}

        {activeTab === "hero-product" && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">Sale Product Section</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={settings.hero_single_eyebrow}
                  onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_eyebrow: event.target.value }))}
                  placeholder="Eyebrow text"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
                <input
                  value={settings.hero_single_title}
                  onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_title: event.target.value }))}
                  placeholder="Title"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <textarea
                value={settings.hero_single_subtitle}
                onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_subtitle: event.target.value }))}
                placeholder="Subtitle"
                className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={settings.hero_single_product_id}
                  onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_product_id: event.target.value }))}
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

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
                  placeholder="Discount percentage"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <input
                value={settings.hero_single_image_url}
                onChange={(event) => setSettings((prev) => ({ ...prev, hero_single_image_url: event.target.value }))}
                placeholder="Section image URL (optional override)"
                className="h-10 w-full rounded-xl border border-border/70 bg-background px-3 text-sm"
              />

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
                  className="rounded-full bg-transparent"
                  onClick={() => void uploadSettingImage("hero-product")}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload hero product image"}
                </Button>
              </div>

              <Button className="rounded-full" onClick={() => void saveHeroProductSettings()} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Sale Product Settings"}
              </Button>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 space-y-3">
              <h2 className="font-serif text-2xl text-foreground">Bundle Product Section</h2>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={settings.bundle_section_eyebrow}
                  onChange={(event) => setSettings((prev) => ({ ...prev, bundle_section_eyebrow: event.target.value }))}
                  placeholder="Eyebrow text"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
                <input
                  value={settings.bundle_section_title}
                  onChange={(event) => setSettings((prev) => ({ ...prev, bundle_section_title: event.target.value }))}
                  placeholder="Title"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <textarea
                value={settings.bundle_section_subtitle}
                onChange={(event) => setSettings((prev) => ({ ...prev, bundle_section_subtitle: event.target.value }))}
                placeholder="Subtitle"
                className="min-h-20 w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={settings.bundle_first_product_id}
                  onChange={(event) => setSettings((prev) => ({ ...prev, bundle_first_product_id: event.target.value }))}
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                >
                  <option value="">Select first product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>

                <select
                  value={settings.bundle_second_product_id}
                  onChange={(event) => setSettings((prev) => ({ ...prev, bundle_second_product_id: event.target.value }))}
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                >
                  <option value="">Select second product</option>
                  {products
                    .filter((product) => product.id !== settings.bundle_first_product_id)
                    .map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
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
                  placeholder="Custom bundle price"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />

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
                  placeholder="Bundle discount percentage"
                  className="h-10 rounded-xl border border-border/70 bg-background px-3 text-sm"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                If custom bundle price is 0, bundle uses sum of selected products price and then applies bundle discount.
              </p>

              <Button className="rounded-full" onClick={() => void saveHeroProductSettings()} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Bundle Product Settings"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminPageContent
