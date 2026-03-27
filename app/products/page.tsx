import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { getCatalogProducts, getSiteSettings } from "@/lib/storefront-data"

export const revalidate = 120

export default async function ProductsPage() {
  const [catalog, siteSettings] = await Promise.all([getCatalogProducts(), getSiteSettings()])
  const visibleCatalog = catalog.filter((product) => !product.hideOnAllProducts)

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-5">
              Product Collection
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              {siteSettings.productsPageTitle}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {siteSettings.productsPageDescription}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {visibleCatalog.map((product) => (
              <ProductCard key={product.id} product={product} compact />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
