import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"
import { getCatalogProducts } from "@/lib/storefront-data"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/fragrance-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms-of-sale`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/legal-notice`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ]

  let productRoutes: MetadataRoute.Sitemap = []
  try {
    const catalog = await getCatalogProducts()
    productRoutes = catalog
      .filter((product) => !product.hideOnAllProducts)
      .map((product) => ({
        url: `${SITE_URL}/products/${product.id}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }))
  } catch {
    // If Supabase is unreachable during build we still ship the static routes.
    productRoutes = []
  }

  return [...staticRoutes, ...productRoutes]
}
