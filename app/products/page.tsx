import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"

export default function ProductsPage() {
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
              All 14 ZARU Fragrances
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Original-like scents. Stronger performance. Smarter price.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group rounded-3xl border border-border/60 bg-card overflow-hidden shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all"
              >
                <div className="relative aspect-[4/5] bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs text-foreground">
                    {product.category}
                  </span>
                </div>

                <div className="p-5 md:p-6">
                  <h2 className="font-serif text-2xl text-foreground mb-2">{product.name.replace("ZARU ", "")}</h2>
                  <p className="text-sm text-muted-foreground mb-3">Inspired by {product.inspiredBy}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-3">{product.description}</p>

                  <Link href={`/products/${product.id}`}>
                    <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary hover:bg-transparent group/btn">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
