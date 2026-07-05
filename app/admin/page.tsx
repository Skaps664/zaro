import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import AdminPageContent from "@/components/admin-page-content"
import { buildMetadata } from "@/lib/seo"

export const metadata = buildMetadata({
  title: "Admin",
  path: "/admin",
  description: "ZARU internal admin dashboard.",
  noIndex: true,
})

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <AdminPageContent />
      <Footer />
    </main>
  )
}
