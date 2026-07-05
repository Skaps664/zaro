import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api",
          "/api/",
          "/cart",
          "/checkout",
          "/account",
          "/track-order",
        ],
      },
      {
        // Block AI training crawlers that don't drive traffic.
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "PerplexityBot",
          "Google-Extended",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
