import { featuredProducts, products, type Product } from "@/lib/products"
import { getSupabaseServerAdminClient, getSupabaseServerAnonClient } from "@/lib/supabase-server"

type SiteSettings = {
  heroImageUrl: string
  bannerImage1: string
  bannerImage2: string
  heroTitleLine1: string
  heroTitleLine2: string
  heroSubtitle: string
  heroProductsEyebrow: string
  heroProductsTitle: string
  heroProductsSubtitle: string
  videoReviewsHeading: string
  videoReviewsSubheading: string
  videoReviews: Array<{ id: string; name: string; title: string; duration: string; thumbnail: string; videoUrl: string }>
  spotlightSubtitle: string
  spotlightTitle: string
  spotlightParagraph1: string
  spotlightParagraph2: string
  missionEyebrow: string
  missionTitle: string
  missionParagraph: string
  missionCta: string
  productsPageTitle: string
  productsPageDescription: string
  heroProductIds: string[]
  heroSingleEyebrow: string
  heroSingleTitle: string
  heroSingleSubtitle: string
  heroSingleImageUrl: string
  heroSingleDiscountPercentage: number
  heroSingleProductId: string
  bundleSectionEyebrow: string
  bundleSectionTitle: string
  bundleSectionSubtitle: string
  bundleFirstProductId: string
  bundleSecondProductId: string
  bundleCustomPrice: number
  bundleDiscountPercentage: number
}

type ProductRow = {
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
  images?: string[] | null
  video_embed_url?: string | null
  price?: number | null
  is_hero?: boolean | null
  hide_on_all_products?: boolean | null
}

const defaultSettings: SiteSettings = {
  heroImageUrl: "/zaru-hero-2.png",
  bannerImage1: "/sope.jpg",
  bannerImage2: "/images/mission-luxury-scent.jpg",
  heroTitleLine1: "Premium Fragrance",
  heroTitleLine2: "Perfected for You",
  heroSubtitle: "High-accuracy fragrance impressions with enhanced longevity. Luxury at a smart price point.",
  heroProductsEyebrow: "Hero Fragrances",
  heroProductsTitle: "Scents crafted with precision",
  heroProductsSubtitle: "Experience luxury without compromise.",
  videoReviewsHeading: "Video Reviews",
  videoReviewsSubheading: "Here's what our customer think about our products",
  videoReviews: [
    {
      id: "review-1",
      name: "Ayaan",
      duration: "0:42",
      title: "Victory Crown Reaction",
      thumbnail: "/images/fragrance-victory-crown.jpg",
      videoUrl: "",
    },
    {
      id: "review-2",
      name: "Lina",
      duration: "0:55",
      title: "Wild Storm First Wear",
      thumbnail: "/images/fragrance-wild-storm.jpg",
      videoUrl: "",
    },
    {
      id: "review-3",
      name: "Ravi",
      duration: "0:38",
      title: "Blue Legacy Compliments",
      thumbnail: "/images/fragrance-blue-legacy.jpg",
      videoUrl: "",
    },
    {
      id: "review-4",
      name: "Customer 4",
      duration: "0:45",
      title: "Loved the longevity",
      thumbnail: "/images/hero-zaru.jpg",
      videoUrl: "",
    },
    {
      id: "review-5",
      name: "Customer 5",
      duration: "0:40",
      title: "Great projection",
      thumbnail: "/images/hero-zaru.jpg",
      videoUrl: "",
    },
  ],
  spotlightSubtitle: "Inside ZARU",
  spotlightTitle: "Crafted for presence, designed for everyday wear",
  spotlightParagraph1:
    "Every bottle is blended to capture the spirit of iconic fragrances while staying wearable, modern, and distinctly yours.",
  spotlightParagraph2:
    "From first spray to dry-down, ZARU balances richness and clarity so your scent feels premium from morning to night.",
  missionEyebrow: "Our Mission",
  missionTitle: "Luxury without compromise",
  missionParagraph:
    "At ZARU, we're redefining what luxury fragrance means. We believe premium quality shouldn't require a premium price tag. Every fragrance is meticulously crafted to deliver the same emotional experience, accuracy, and longevity as designer scents.",
  missionCta: "Start exploring",
  productsPageTitle: "All 14 ZARU Fragrances",
  productsPageDescription: "Original-like scents. Stronger performance. Smarter price.",
  heroProductIds: featuredProducts.slice(0, 3).map((item) => item.id),
  heroSingleEyebrow: "Featured Drop",
  heroSingleTitle: "One signature scent, made to stand out",
  heroSingleSubtitle: "Limited-time offer on our handpicked fragrance.",
  heroSingleImageUrl: "",
  heroSingleDiscountPercentage: 20,
  heroSingleProductId: featuredProducts[0]?.id ?? "",
  bundleSectionEyebrow: "Bundle Offer",
  bundleSectionTitle: "Pair your favorites and save more",
  bundleSectionSubtitle: "Choose two bestsellers as one bundle with a custom deal price.",
  bundleFirstProductId: "",
  bundleSecondProductId: "",
  bundleCustomPrice: 0,
  bundleDiscountPercentage: 0,
}

function normalizeVideoReviews(raw: unknown) {
  const incoming = Array.isArray(raw) ? raw : []
  return defaultSettings.videoReviews.map((fallback, index) => {
    const candidate = incoming[index] as Partial<(typeof defaultSettings.videoReviews)[number]> | undefined
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

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    inspiredBy: row.inspired_by,
    category: row.category,
    audience: row.audience,
    notes: Array.isArray(row.notes) ? row.notes : [],
    description: row.description,
    longevity: row.longevity,
    projection: row.projection,
    bestFor: row.best_for,
    time: row.time,
    image: row.image || (Array.isArray(row.images) ? row.images[0] : "") || "/placeholder.svg",
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : row.image ? [row.image] : undefined,
    videoEmbedUrl: row.video_embed_url ?? undefined,
    price: typeof row.price === "number" ? row.price : undefined,
    isHero: Boolean(row.is_hero),
    hideOnAllProducts: Boolean(row.hide_on_all_products),
  }
}

function getStorefrontServerClient() {
  return getSupabaseServerAdminClient() ?? getSupabaseServerAnonClient()
}

function normalizeIdentifier(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/-+/g, "-")
}

function buildIdentifierCandidates(value: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  })()

  return new Set([
    normalizeIdentifier(value),
    normalizeIdentifier(decoded),
    normalizeIdentifier(decoded.replace(/\+/g, " ")),
  ])
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getStorefrontServerClient()
  if (!supabase) return defaultSettings

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()

  if (error || !data) return defaultSettings

  return {
    heroImageUrl: data.hero_image_url || defaultSettings.heroImageUrl,
    bannerImage1: data.banner_image_1 || defaultSettings.bannerImage1,
    bannerImage2: data.banner_image_2 || defaultSettings.bannerImage2,
    heroTitleLine1: data.hero_title_line1 || defaultSettings.heroTitleLine1,
    heroTitleLine2: data.hero_title_line2 || defaultSettings.heroTitleLine2,
    heroSubtitle: data.hero_subtitle || defaultSettings.heroSubtitle,
    heroProductsEyebrow: data.hero_products_eyebrow || defaultSettings.heroProductsEyebrow,
    heroProductsTitle: data.hero_products_title || defaultSettings.heroProductsTitle,
    heroProductsSubtitle: data.hero_products_subtitle || defaultSettings.heroProductsSubtitle,
    videoReviewsHeading: data.video_reviews_heading || defaultSettings.videoReviewsHeading,
    videoReviewsSubheading: data.video_reviews_subheading || defaultSettings.videoReviewsSubheading,
    videoReviews: normalizeVideoReviews(data.video_reviews),
    spotlightSubtitle: data.spotlight_subtitle || defaultSettings.spotlightSubtitle,
    spotlightTitle: data.spotlight_title || defaultSettings.spotlightTitle,
    spotlightParagraph1: data.spotlight_paragraph_1 || defaultSettings.spotlightParagraph1,
    spotlightParagraph2: data.spotlight_paragraph_2 || defaultSettings.spotlightParagraph2,
    missionEyebrow: data.mission_eyebrow || defaultSettings.missionEyebrow,
    missionTitle: data.mission_title || defaultSettings.missionTitle,
    missionParagraph: data.mission_paragraph || defaultSettings.missionParagraph,
    missionCta: data.mission_cta || defaultSettings.missionCta,
    productsPageTitle: data.products_page_title || defaultSettings.productsPageTitle,
    productsPageDescription: data.products_page_description || defaultSettings.productsPageDescription,
    heroProductIds: Array.isArray(data.hero_product_ids) ? data.hero_product_ids : defaultSettings.heroProductIds,
    heroSingleEyebrow: data.hero_single_eyebrow || defaultSettings.heroSingleEyebrow,
    heroSingleTitle: data.hero_single_title || defaultSettings.heroSingleTitle,
    heroSingleSubtitle: data.hero_single_subtitle || defaultSettings.heroSingleSubtitle,
    heroSingleImageUrl: data.hero_single_image_url || defaultSettings.heroSingleImageUrl,
    heroSingleDiscountPercentage:
      typeof data.hero_single_discount_percentage === "number"
        ? data.hero_single_discount_percentage
        : defaultSettings.heroSingleDiscountPercentage,
    heroSingleProductId: data.hero_single_product_id || defaultSettings.heroSingleProductId,
    bundleSectionEyebrow: data.bundle_section_eyebrow || defaultSettings.bundleSectionEyebrow,
    bundleSectionTitle: data.bundle_section_title || defaultSettings.bundleSectionTitle,
    bundleSectionSubtitle: data.bundle_section_subtitle || defaultSettings.bundleSectionSubtitle,
    bundleFirstProductId: data.bundle_first_product_id || defaultSettings.bundleFirstProductId,
    bundleSecondProductId: data.bundle_second_product_id || defaultSettings.bundleSecondProductId,
    bundleCustomPrice: typeof data.bundle_custom_price === "number" ? data.bundle_custom_price : defaultSettings.bundleCustomPrice,
    bundleDiscountPercentage:
      typeof data.bundle_discount_percentage === "number"
        ? data.bundle_discount_percentage
        : defaultSettings.bundleDiscountPercentage,
  }
}

export async function getCatalogProducts(): Promise<Product[]> {
  const supabase = getStorefrontServerClient()
  if (!supabase) return products

  // Prefer DB catalog whenever Supabase is configured. This prevents demo products
  // from appearing once the admin panel is in use.
  const orderedResult = await supabase.from("admin_products").select("*").order("created_at", { ascending: false })

  if (!orderedResult.error && orderedResult.data) {
    return orderedResult.data.map((row) => mapRowToProduct(row as ProductRow))
  }

  // Compatibility fallback for older schemas that may not have created_at.
  const fallbackResult = await supabase.from("admin_products").select("*")

  if (!fallbackResult.error && fallbackResult.data) {
    return fallbackResult.data.map((row) => mapRowToProduct(row as ProductRow))
  }

  return []
}

export async function getFeaturedCatalogProducts(limit = 3): Promise<Product[]> {
  const [catalog, settings] = await Promise.all([getCatalogProducts(), getSiteSettings()])

  const chosen = settings.heroProductIds
    .map((id) => catalog.find((item) => item.id === id))
    .filter((item): item is Product => Boolean(item))

  if (chosen.length > 0) {
    return chosen.slice(0, limit)
  }

  const fallback = catalog.filter((item) => item.isHero)
  if (fallback.length > 0) {
    return fallback.slice(0, limit)
  }

  return catalog.slice(0, limit)
}

export async function getCatalogProductById(id: string): Promise<Product | undefined> {
  const catalog = await getCatalogProducts()

  const exactMatch = catalog.find((item) => item.id === id)
  if (exactMatch) return exactMatch

  const requestedCandidates = buildIdentifierCandidates(id)

  return catalog.find((item) => {
    const idCandidates = buildIdentifierCandidates(item.id)
    const nameCandidates = buildIdentifierCandidates(item.name.replace(/^zaru\s+/i, ""))

    return [...requestedCandidates].some((candidate) => idCandidates.has(candidate) || nameCandidates.has(candidate))
  })
}

export async function getHeroSingleProduct(): Promise<Product | undefined> {
  const [catalog, settings] = await Promise.all([getCatalogProducts(), getSiteSettings()])

  if (settings.heroSingleProductId) {
    const selected = catalog.find((item) => item.id === settings.heroSingleProductId)
    if (selected) return selected
  }

  return catalog[0]
}
