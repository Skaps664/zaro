import { NextResponse } from "next/server"
import { isAdminAuthorized } from "@/lib/admin-auth"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"

const ASSET_BUCKET = process.env.SUPABASE_ASSET_BUCKET ?? "zaru-assets"

export async function POST(request: Request) {
  const auth = isAdminAuthorized(request)
  if (!auth.ok) return auth.response

  const supabase = getSupabaseServerAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: "Missing Supabase service role env" }, { status: 500 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  const folder = String(formData.get("folder") ?? "admin")

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "File is required" }, { status: 400 })
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase()
  const path = `${folder}/${Date.now()}-${safeName}`
  const bytes = await file.arrayBuffer()

  const { error: uploadError } = await supabase.storage.from(ASSET_BUCKET).upload(path, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: true,
  })

  if (uploadError) {
    return NextResponse.json({ success: false, message: uploadError.message }, { status: 500 })
  }

  const { data } = supabase.storage.from(ASSET_BUCKET).getPublicUrl(path)

  return NextResponse.json({ success: true, url: data.publicUrl, path })
}
