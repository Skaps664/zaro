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
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "")

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
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  const canonical = `${SITE_URL}${normalizedPath}`
  const finalTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`
  const finalDescription = description ?? SITE_DESCRIPTION
  const finalImage = image ?? DEFAULT_OG_IMAGE.url

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
      type,
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
  const images = Array.isArray(input.image) ? input.image : [input.image]
  const absoluteImages = images.map((src) =>
    src.startsWith("http") ? src : `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`,
  )

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/products/${input.id}#product`,
    name: input.name,
    description: input.description,
    image: absoluteImages,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    category: input.category,
    audience: input.audience
      ? { "@type": "PeopleAudience", suggestedGender: input.audience.toLowerCase() }
      : undefined,
    sku: input.id,
    mpn: input.id,
    ...(input.inspiredBy ? { additionalProperty: [{ "@type": "PropertyValue", name: "Inspired by", value: input.inspiredBy }] } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${input.id}`,
      priceCurrency: input.currency ?? "PKR",
      price: input.price,
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
 * Renders a JSON-LD script tag safely. Use inside a server component.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
