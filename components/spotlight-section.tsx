"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export function SpotlightSection() {
  const sectionRef = useRef<HTMLElement>(null)

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

  return (
    <section ref={sectionRef} className="py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="reveal opacity-0 animation-delay-200 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden border border-border/50 shadow-xl shadow-primary/10">
              <img
                src="/sope.jpg"
                alt="Luxury fragrance experience"
                className="w-full h-[380px] md:h-[460px] object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">Inside ZARU</p>
            <h2 className="reveal opacity-0 animation-delay-200 font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 text-balance">
              Crafted for presence, designed for everyday wear
            </h2>
            <p className="reveal opacity-0 animation-delay-400 text-muted-foreground leading-relaxed mb-4">
              Every bottle is blended to capture the spirit of iconic fragrances while staying wearable, modern, and distinctly yours.
            </p>
            <p className="reveal opacity-0 animation-delay-600 text-muted-foreground leading-relaxed mb-8">
              From first spray to dry-down, ZARU balances richness and clarity so your scent feels premium from morning to night.
            </p>
            <div className="reveal opacity-0 animation-delay-800">
              <Button size="lg" className="rounded-full px-8">
                Learn the craft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
