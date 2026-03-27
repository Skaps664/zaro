import { CartPageContent } from "@/components/cart-page-content"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CartPageContent />
      <Footer />
    </main>
  )
}
