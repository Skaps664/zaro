import { NextResponse } from "next/server"
import { getSiteSettings } from "@/lib/storefront-data"

export async function GET() {
  const settings = await getSiteSettings()

  const productId = (settings.heroSingleProductId || "").trim()
  const discountPercentage = Number.isFinite(settings.heroSingleDiscountPercentage)
    ? Math.max(0, Math.min(90, Math.round(settings.heroSingleDiscountPercentage)))
    : 0

  const sale = productId && discountPercentage > 0 ? { productId, discountPercentage } : null

  return NextResponse.json(
    { success: true, sale },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  )
}
