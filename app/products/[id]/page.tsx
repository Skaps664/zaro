import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock3, Sparkles, Target, Users } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getProductById, products } from "@/lib/products"

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return products.map((product) => ({ id: product.id }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    return {
      title: "Product not found | ZARU",
    }
  }

  return {
    title: `${product.name} | ZARU`,
    description: `${product.description} Inspired by ${product.inspiredBy}.`,
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const related = products.filter((item) => item.id !== product.id).slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to products
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="rounded-3xl overflow-hidden border border-border/60 bg-muted">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover aspect-[4/5]" />
            </div>

            <div>
              <p className="inline-flex rounded-full border border-border px-3 py-1 text-xs tracking-[0.16em] uppercase text-secondary mb-4">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3 text-balance">{product.name}</h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6">Inspired by {product.inspiredBy}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock3 className="w-4 h-4" /> Longevity
                  </div>
                  <p className="text-foreground font-medium">{product.longevity}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Sparkles className="w-4 h-4" /> Projection
                  </div>
                  <p className="text-foreground font-medium">{product.projection}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Target className="w-4 h-4" /> Best For
                  </div>
                  <p className="text-foreground font-medium">{product.bestFor}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="w-4 h-4" /> Audience
                  </div>
                  <p className="text-foreground font-medium">{product.audience}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-5 mb-8">
                <h2 className="font-medium text-foreground mb-3">Key Notes</h2>
                <div className="flex flex-wrap gap-2">
                  {product.notes.map((note) => (
                    <span key={note} className="rounded-full bg-muted px-3 py-1 text-xs text-foreground">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="rounded-full px-8">
                  Order on WhatsApp
                </Button>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent">
                    Explore all fragrances
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14 lg:mt-20">
            <h3 className="font-serif text-3xl text-foreground mb-6">You may also like</h3>
            <div className="grid md:grid-cols-3 gap-5">
              {related.map((item) => (
                <Link key={item.id} href={`/products/${item.id}`} className="group rounded-2xl border border-border/60 bg-card overflow-hidden">
                  <div className="aspect-[4/3] bg-muted overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="font-medium text-foreground mb-1">{item.name.replace("ZARU ", "")}</p>
                    <p className="text-sm text-muted-foreground">Inspired by {item.inspiredBy}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
