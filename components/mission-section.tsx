"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const missionContent = {
  eyebrow: "Our Mission",
  title: "Luxury without compromise",
  paragraphs: [
    "At ZARU, we're redefining what luxury fragrance means. We believe premium quality shouldn't require a premium price tag. Every fragrance is meticulously crafted to deliver the same emotional experience, accuracy, and longevity as designer scents.",
  ],
  cta: "Start exploring",
}

type MissionSectionProps = {
  imageUrl?: string
  eyebrow?: string
  title?: string
  paragraph?: string
  cta?: string
}

export function MissionSection({
  imageUrl = "/images/mission-luxury-scent.jpg",
  eyebrow = missionContent.eyebrow,
  title = missionContent.title,
  paragraph = missionContent.paragraphs[0],
  cta = missionContent.cta,
}: MissionSectionProps) {
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
    <section ref={sectionRef} id="mission" className="py-24 lg:py-32 px-6">
      <div className="relative max-w-7xl mx-auto rounded-[48px] overflow-hidden min-h-[560px] md:min-h-[640px] lg:min-h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={imageUrl} alt="ZARU luxury fragrance lifestyle" className="w-full h-full object-cover" />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-foreground/50" />

          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[2px]" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[8px] opacity-60" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-background/0 to-transparent backdrop-blur-[20px] opacity-30" />
        </div>

        {/* Content with padding */}
        <div className="relative px-6 lg:px-8 py-16 lg:py-10 h-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
            {/* Image - removed as we now have background */}
            <div className="reveal opacity-0 order-2 lg:order-1"></div>

            {/* Content */}
            <div className="order-1 lg:order-2 flex flex-col justify-center text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
              <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-accent font-medium mb-4">
                {eyebrow}
              </p>
              <h2 className="reveal opacity-0 animation-delay-200 font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-background text-balance mb-8">
                {title}
              </h2>
              <div className="reveal opacity-0 animation-delay-400 space-y-6 text-background/90 leading-relaxed">
                <p>{paragraph}</p>
              </div>
              <div className="reveal opacity-0 animation-delay-600 mt-10 flex justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 rounded-full px-8 group"
                >
                  {cta}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
