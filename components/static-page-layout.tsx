import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

type StaticPageLayoutProps = {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function StaticPageLayout({ eyebrow, title, description, children }: StaticPageLayoutProps) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <header className="mb-10 lg:mb-12">
            <p className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-secondary font-medium mb-5">
              {eyebrow}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 text-balance">{title}</h1>
            <p className="text-muted-foreground leading-relaxed max-w-3xl">{description}</p>
          </header>

          <article className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 lg:p-10 shadow-sm">
            {children}
          </article>
        </div>
      </section>
      <Footer />
    </main>
  )
}
