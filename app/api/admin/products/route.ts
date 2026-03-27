import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"

type AdminProductInput = {
  id: string
  name: string
  inspiredBy: string
  category: string
  audience: "Male" | "Female" | "Unisex"
  notes: string[]
  description: string
  longevity: string
  projection: string
  bestFor: string
  time: string
  image: string
  images?: string[]
  videoEmbedUrl?: string | null
  price?: number
  isHero?: boolean
  hideOnAllProducts?: boolean
}

function mapToDbPayload(input: AdminProductInput) {
  return {
    id: input.id,
    name: input.name,
    inspired_by: input.inspiredBy,
    category: input.category,
    audience: input.audience,
    notes: input.notes,
    description: input.description,
    longevity: input.longevity,
    projection: input.projection,
    best_for: input.bestFor,
    time: input.time,
    image: input.image,
    images: Array.isArray(input.images) && input.images.length > 0 ? input.images : [input.image],
    video_embed_url: input.videoEmbedUrl ?? null,
    price: input.price ?? 3490,
    is_hero: Boolean(input.isHero),
    hide_on_all_products: Boolean(input.hideOnAllProducts),
    updated_at: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const ordered = await supabase.from("admin_products").select("*").order("created_at", { ascending: false })

  if (!ordered.error) {
    return NextResponse.json({ success: true, products: ordered.data ?? [] })
  }

  const fallback = await supabase.from("admin_products").select("*")
  if (fallback.error) {
    return NextResponse.json({ success: false, message: fallback.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, products: fallback.data ?? [] })
}

export async function POST(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const body = (await request.json()) as { product: AdminProductInput }
  const product = body.product

  if (!product?.id || !product?.name) {
    return NextResponse.json({ success: false, message: "Missing required product fields" }, { status: 400 })
  }

  const { data, error } = await supabase.from("admin_products").insert(mapToDbPayload(product)).select("*").single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, product: data })
}

export async function PUT(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const body = (await request.json()) as { product: AdminProductInput }
  const product = body.product

  if (!product?.id) {
    return NextResponse.json({ success: false, message: "Product id is required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("admin_products")
    .update(mapToDbPayload(product))
    .eq("id", product.id)
    .select("*")
    .single()

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, product: data })
}

export async function DELETE(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const removeAll = searchParams.get("all") === "true"

  if (removeAll) {
    const { error } = await supabase.from("admin_products").delete().neq("id", "")

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  if (!id) {
    return NextResponse.json({ success: false, message: "Product id is required" }, { status: 400 })
  }

  const { error } = await supabase.from("admin_products").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
