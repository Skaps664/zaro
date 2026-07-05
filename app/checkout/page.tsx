import { CheckoutPageContent } from "@/components/checkout-page-content"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Secure Checkout",
  path: "/checkout",
  description: "Complete your ZARU Fragrance Hub order with cash on delivery or advance payment.",
  noIndex: true,
})

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CheckoutPageContent />
      <Footer />
    </main>
  )
}
