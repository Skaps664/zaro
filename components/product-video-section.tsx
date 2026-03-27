import type { Product } from "@/lib/products"

type ProductVideoSectionProps = {
  product: Product
}

export function ProductVideoSection({ product }: ProductVideoSectionProps) {
  const embedUrl = product.videoEmbedUrl ?? "https://www.youtube.com/embed/4d8rM8NfP7g"

  return (
    <section className="mt-12 lg:mt-16">
      <div className="rounded-3xl border border-border/60 bg-card p-5 md:p-7">
        <p className="inline-flex rounded-full border border-border px-3 py-1 text-xs tracking-[0.16em] uppercase text-secondary mb-4">
          Product Breakdown
        </p>
        <h2 className="font-serif text-3xl text-foreground mb-2">Watch {product.name.replace("ZARU ", "")}</h2>
        <p className="text-muted-foreground mb-6">
          A quick explainer showing how this fragrance feels, performs, and when it shines best.
        </p>

        <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 bg-muted">
          <iframe
            src={embedUrl}
            title={`${product.name} video explainer`}
            className="h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}
