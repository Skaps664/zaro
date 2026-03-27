import { CheckoutPageContent } from "@/components/checkout-page-content"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CheckoutPageContent />
      <Footer />
    </main>
  )
}
