import { AccountPageContent } from "@/components/account-page-content"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Track Your Orders",
  path: "/account",
  description: "Look up your ZARU orders by phone number or email and see live status, tracking, and delivery updates.",
  noIndex: true,
})

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AccountPageContent />
      <Footer />
    </main>
  )
}
