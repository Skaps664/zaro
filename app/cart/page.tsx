import { CartPageContent } from "@/components/cart-page-content"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Your Cart",
  path: "/cart",
  description: "Review the fragrances in your ZARU Fragrance Hub cart before checkout.",
  noIndex: true,
})

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CartPageContent />
      <Footer />
    </main>
  )
}
