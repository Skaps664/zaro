import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import AdminPageContent from "@/components/admin-page-content"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AdminPageContent />
      <Footer />
    </main>
  )
}
