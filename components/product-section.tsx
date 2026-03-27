"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ScrollBlurText } from "@/components/scroll-blur-text"
import type { Product } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

type ProductSectionProps = {
  products: Product[]
  eyebrow?: string
  title?: string
  subtitle?: string
}

export function ProductSection({
  products,
  eyebrow = "Hero Fragrances",
  title = "Scents crafted with precision",
  subtitle = "Experience luxury without compromise.",
}: ProductSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const scrollCards = (direction: "left" | "right") => {
    const container = cardsScrollRef.current
    if (!container) return

    const amount = Math.round(container.clientWidth * 0.9)
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section ref={sectionRef} id="fragrances" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">
            {eyebrow}
          </p>
          <ScrollBlurText
            text={title}
            className="font-serif text-3xl text-foreground text-balance mb-6 md:text-7xl font-light"
          />
          <p className="reveal opacity-0 animation-delay-400 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
           {subtitle}
          </p>
        </div>

        <div
          ref={cardsScrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible -mx-6 px-6 lg:mx-0"
        >
          {products.slice(0, 3).map((product, index) => (
            <div
              key={product.id}
              className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""} group min-w-[85vw] md:min-w-[70vw] lg:min-w-0 snap-center`}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Scroll products left"
            onClick={() => scrollCards("left")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            aria-label="Scroll products right"
            onClick={() => scrollCards("right")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center mt-10">
          <Link href="/products">
            <Button size="lg" className="rounded-full px-8">
              View All Fragrances
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
