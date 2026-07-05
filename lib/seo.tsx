import type { Metadata } from "next"

/**
 * Central SEO configuration for the ZARU Fragrance Hub storefront.
 *
 * All page-level metadata should flow through the helpers here so that
 * canonical URLs, Open Graph, Twitter, and JSON-LD stay consistent.
 *
 * Configure via env:
 *   NEXT_PUBLIC_SITE_URL         — full origin, e.g. https://zarufragrance.com
 *   GOOGLE_SITE_VERIFICATION      — Google Search Console verification token
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zarufragrance.com"

function normalizeSiteUrl(input: string): string {
  const trimmed = input.trim().replace(/\/+$/, "")
  if (!trimmed) return "https://zarufragrance.com"
  // Accept bare hostname like "zarufragrance.com" and default to https.
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`
  return trimmed
}

export const SITE_URL = normalizeSiteUrl(RAW_SITE_URL)

/**
 * Returns a valid URL for `metadataBase` in the root layout. Falls back to
 * the default site URL if the configured value can't be parsed so the app
 * never crashes on boot because of a bad env var.
 */
export function safeMetadataBase(): URL {
  try {
    return new URL(SITE_URL)
  } catch {
    return new URL("https://zarufragrance.com")
  }
}

export const SITE_NAME = "ZARU Fragrance Hub"
export const SITE_SHORT_NAME = "ZARU"
export const SITE_LOCALE = "en_PK"

export const SITE_TAGLINE = "Inspired by Icons. Perfected for Pakistan."

export const SITE_DESCRIPTION =
  "ZARU Fragrance Hub crafts premium fragrance impressions of the world's top perfumes — tuned for Pakistan's climate for stronger projection, longer longevity, and honest local pricing. Free WhatsApp support and countrywide delivery."

export const SITE_KEYWORDS = [
  "ZARU",
  "ZARU Fragrance",
  "ZARU Fragrance Hub",
  "Pakistan perfumes",
  "fragrance impressions Pakistan",
  "premium perfumes Pakistan",
  "long lasting perfume Pakistan",
  "designer inspired perfume",
  "Aventus inspired Pakistan",
  "Sauvage inspired Pakistan",
  "affordable luxury fragrance",
  "perfumes Karachi",
  "perfumes Lahore",
  "perfumes Islamabad",
  "perfumes Peshawar",
  "buy perfume online Pakistan",
  "cash on delivery perfume Pakistan",
  "attar Pakistan",
  "extrait de parfum Pakistan",
]

export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/zaru-hero-2.png`,
  width: 1200,
  height: 630,
  alt: "ZARU Fragrance Hub — Premium fragrance impressions crafted for Pakistan",
}

export const SOCIAL = {
  twitterHandle: "@zarufragrance",
}

type BuildMetadataInput = {
  title?: string
  description?: string
  path?: string // e.g. "/products" — leading slash required
  keywords?: string[]
  image?: string
  noIndex?: boolean
  /**
   * Semantic content type. Next.js's Metadata API only accepts the OpenGraph
   * base types (`website`, `article`, `book`, `profile`, `music.*`, `video.*`);
   * `"product"` is *not* one of them (product data is exposed via JSON-LD
   * instead). We accept `"product"` here as a caller hint and safely map it
   * to `"website"` on the OpenGraph side.
   */
  type?: "website" | "article" | "product"
}

/**
 * Build a per-page Metadata object with sensible defaults.
 * Prefer this over hand-rolling metadata so canonical + OG + Twitter
 * stay aligned across the site.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  keywords,
  image,
  noIndex = false,
  type = "website",
}: BuildMetadataInput): Metadata {
  const safePath = typeof path === "string" && path.length > 0 ? path : "/"
  const normalizedPath = safePath.startsWith("/") ? safePath : `/${safePath}`
  const canonical = `${SITE_URL}${normalizedPath}`
  const finalTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`
  const finalDescription = description ?? SITE_DESCRIPTION

  // Ensure the OG/Twitter image is always an absolute URL that Next.js can parse.
  const finalImage = toAbsoluteUrl(image) ?? DEFAULT_OG_IMAGE.url

  // Next.js Metadata does not recognise "product" as an OpenGraph type,
  // so we normalise it to "website". Product schema still ships via JSON-LD.
  const openGraphType: "website" | "article" = type === "article" ? "article" : "website"

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: keywords ?? SITE_KEYWORDS,
    alternates: {
      canonical,
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: openGraphType,
      images: [
        {
          url: finalImage,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
          alt: title ?? DEFAULT_OG_IMAGE.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [finalImage],
      creator: SOCIAL.twitterHandle,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  }
}

/**
 * Coerce any value into an absolute HTTPS URL string, or return null if we can't.
 * Handles: absolute URLs, root-relative paths, bare filenames, empty/null/undefined.
 */
function toAbsoluteUrl(input: unknown): string | null {
  if (typeof input !== "string") return null
  const trimmed = input.trim()
  if (trimmed.length === 0) return null

  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith("/")) return `${SITE_URL}${trimmed}`
  return `${SITE_URL}/${trimmed}`
}

/* -------------------------------------------------------------
   JSON-LD builders
-------------------------------------------------------------- */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: SITE_SHORT_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/zaru-logo.png`,
    description: SITE_DESCRIPTION,
    email: "info@zaruscents.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "PK",
      addressLocality: "Peshawar",
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: "+92-336-9911322",
        areaServed: "PK",
        availableLanguage: ["English", "Urdu"],
      },
    ],
    sameAs: [
      "https://www.instagram.com/zarufragrance",
      "https://www.facebook.com/zarufragrance",
      "https://www.tiktok.com/@zarufragrance",
    ],
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-PK",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }
}

export function productJsonLd(input: {
  id: string
  name: string
  description: string
  image: string | string[]
  price: number
  inspiredBy?: string
  audience?: string
  category?: string
  currency?: string
  availability?: "InStock" | "OutOfStock" | "PreOrder"
}) {
  const rawImages = Array.isArray(input.image) ? input.image : [input.image]
  const absoluteImages = rawImages
    .map((src) => toAbsoluteUrl(src))
    .filter((src): src is string => Boolean(src))

  const safeAudience = typeof input.audience === "string" && input.audience.length > 0 ? input.audience : undefined
  const safeCategory = typeof input.category === "string" && input.category.length > 0 ? input.category : undefined
  const safePrice = typeof input.price === "number" && Number.isFinite(input.price) ? input.price : 0

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/products/${input.id}#product`,
    name: input.name,
    description: input.description,
    ...(absoluteImages.length > 0 ? { image: absoluteImages } : {}),
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    ...(safeCategory ? { category: safeCategory } : {}),
    ...(safeAudience
      ? { audience: { "@type": "PeopleAudience", suggestedGender: safeAudience.toLowerCase() } }
      : {}),
    sku: input.id,
    mpn: input.id,
    ...(input.inspiredBy
      ? { additionalProperty: [{ "@type": "PropertyValue", name: "Inspired by", value: input.inspiredBy }] }
      : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${input.id}`,
      priceCurrency: input.currency ?? "PKR",
      price: safePrice,
      availability: `https://schema.org/${input.availability ?? "InStock"}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  }
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

/**
 * Renders a JSON-LD script tag safely. Never throws — if serialization fails
 * for any reason, the component silently renders nothing so it can't break
 * the whole page.
 */
export function JsonLd({ data }: { data: unknown }) {
  let json: string
  try {
    json = JSON.stringify(data)
  } catch (error) {
    console.error("[JsonLd] Failed to serialize data", error)
    return null
  }
  if (!json) return null
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
