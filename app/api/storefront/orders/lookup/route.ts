import { NextResponse } from "next/server"
import { getSupabaseServerAdminClient } from "@/lib/supabase-server"

type LookupBody = {
  identifier?: string
  type?: "phone" | "email"
}

function normalizePhone(input: string) {
  return input.replace(/[^\d+]/g, "")
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LookupBody
    const identifier = (body.identifier ?? "").trim()

    if (!identifier) {
      return NextResponse.json(
        { success: false, message: "Please enter your phone or email" },
        { status: 400 },
      )
    }

    const supabase = getSupabaseServerAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Order lookup is temporarily unavailable" },
        { status: 500 },
      )
    }

    const looksLikeEmail = identifier.includes("@")
    const type = body.type ?? (looksLikeEmail ? "email" : "phone")

    let query = supabase
      .from("customer_orders")
      .select(
        "id, order_code, customer_name, customer_phone, customer_email, customer_city, customer_address, payment_type, payment_method, subtotal_amount, discount_amount, payable_amount, total_items, items, status, payment_status, tracking_info, tracking_courier, notes, created_at, updated_at",
      )
      .order("created_at", { ascending: false })
      .limit(50)

    if (type === "email") {
      query = query.ilike("customer_email", identifier)
    } else {
      const normalized = normalizePhone(identifier)
      // match either the raw or normalized form
      query = query.or(
        `customer_phone.eq.${identifier},customer_phone.eq.${normalized}`,
      )
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, orders: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed"
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}
