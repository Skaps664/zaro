import { AccountPageContent } from "@/components/account-page-content"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AccountPageContent />
      <Footer />
    </main>
  )
}
