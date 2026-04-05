import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

type SettingsInput = {
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

const MAX_COMPAT_RETRIES = 24

function mapToDbPayload(settings: SettingsInput) {
  return {
    id: 1,
    hero_image_url: settings.heroImageUrl,
    banner_image_1: settings.bannerImage1,
    banner_image_2: settings.bannerImage2,
    hero_title_line1: settings.heroTitleLine1,
    hero_title_line2: settings.heroTitleLine2,
    hero_subtitle: settings.heroSubtitle,
    hero_products_eyebrow: settings.heroProductsEyebrow,
    hero_products_title: settings.heroProductsTitle,
    hero_products_subtitle: settings.heroProductsSubtitle,
    video_reviews_heading: settings.videoReviewsHeading,
    video_reviews_subheading: settings.videoReviewsSubheading,
    video_reviews: settings.videoReviews,
    spotlight_subtitle: settings.spotlightSubtitle,
    spotlight_title: settings.spotlightTitle,
    spotlight_paragraph_1: settings.spotlightParagraph1,
    spotlight_paragraph_2: settings.spotlightParagraph2,
    mission_eyebrow: settings.missionEyebrow,
    mission_title: settings.missionTitle,
    mission_paragraph: settings.missionParagraph,
    mission_cta: settings.missionCta,
    products_page_title: settings.productsPageTitle,
    products_page_description: settings.productsPageDescription,
    hero_product_ids: settings.heroProductIds,
    hero_single_eyebrow: settings.heroSingleEyebrow,
    hero_single_title: settings.heroSingleTitle,
    hero_single_subtitle: settings.heroSingleSubtitle,
    hero_single_image_url: settings.heroSingleImageUrl,
    hero_single_discount_percentage: settings.heroSingleDiscountPercentage,
    hero_single_product_id: settings.heroSingleProductId,
    bundle_section_eyebrow: settings.bundleSectionEyebrow,
    bundle_section_title: settings.bundleSectionTitle,
    bundle_section_subtitle: settings.bundleSectionSubtitle,
    bundle_first_product_id: settings.bundleFirstProductId,
    bundle_second_product_id: settings.bundleSecondProductId,
    bundle_custom_price: settings.bundleCustomPrice,
    bundle_discount_percentage: settings.bundleDiscountPercentage,
  }
}

function mapToLegacyDbPayload(settings: SettingsInput) {
  return {
    id: 1,
    hero_image_url: settings.heroImageUrl,
    hero_title_line1: settings.heroTitleLine1,
    hero_title_line2: settings.heroTitleLine2,
    hero_subtitle: settings.heroSubtitle,
    hero_product_ids: settings.heroProductIds,
  }
}

function extractMissingColumn(errorMessage: string): string | null {
  const match = errorMessage.match(/Could not find the '([^']+)' column of 'site_settings'/i)
  return match?.[1] ?? null
}

async function upsertWithSchemaCompatibility(supabase: NonNullable<ReturnType<typeof getSupabaseServerAdminClient>>, settings: SettingsInput) {
  const fullPayload = mapToDbPayload(settings)
  const legacyPayload = mapToLegacyDbPayload(settings)
  const missingColumns = new Set<string>()

  let activePayload: Record<string, unknown> = { ...fullPayload }

  for (let retry = 0; retry < MAX_COMPAT_RETRIES; retry += 1) {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(activePayload, { onConflict: "id" })
      .select("*")
      .single()

    if (!error) {
      return { data, missingColumns: Array.from(missingColumns), error: null }
    }

    const missingColumn = extractMissingColumn(error.message)
    if (!missingColumn) {
      break
    }

    if (!(missingColumn in activePayload)) {
      break
    }

    missingColumns.add(missingColumn)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete activePayload[missingColumn]
  }

  activePayload = { ...legacyPayload }
  for (let retry = 0; retry < MAX_COMPAT_RETRIES; retry += 1) {
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(activePayload, { onConflict: "id" })
      .select("*")
      .single()

    if (!error) {
      return { data, missingColumns: Array.from(missingColumns), error: null }
    }

    const missingColumn = extractMissingColumn(error.message)
    if (!missingColumn) {
      return { data: null, missingColumns: Array.from(missingColumns), error }
    }

    if (!(missingColumn in activePayload)) {
      return { data: null, missingColumns: Array.from(missingColumns), error }
    }

    missingColumns.add(missingColumn)
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete activePayload[missingColumn]
  }

  return {
    data: null,
    missingColumns: Array.from(missingColumns),
    error: new Error("Could not save settings after compatibility retries"),
  }
}

export async function GET(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, settings: data })
}

export async function PUT(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const body = (await request.json()) as { settings: SettingsInput }
  const result = await upsertWithSchemaCompatibility(supabase, body.settings)

  if (result.error || !result.data) {
    const message = result.error instanceof Error ? result.error.message : String(result.error)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }

  if (result.missingColumns.length > 0) {
    revalidatePath("/")
    revalidatePath("/products")
    return NextResponse.json({
      success: true,
      settings: result.data,
      message: `Saved partially. Missing DB columns: ${result.missingColumns.join(", ")}. Run supabase/admin-schema.sql to enable all admin fields.`,
    })
  }

  revalidatePath("/")
  revalidatePath("/products")

  return NextResponse.json({ success: true, settings: result.data })
}
