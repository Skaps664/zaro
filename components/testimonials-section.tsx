"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { ScrollBlurText } from "./scroll-blur-text"

const testimonials = [
  {
    quote:
      "Victory Crown smells exactly like Aventus. The longevity is incredible—it lasted 14 hours on my skin. Worth every penny.",
    author: "Amir K.",
    role: "Verified buyer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "ZARU delivered what they promised. Wild Storm has the same fresh, spicy character as the designer version, but at half the price.",
    author: "Sofia M.",
    role: "Verified buyer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote:
      "As a fragrance enthusiast, I was skeptical. But Blue Legacy is genuinely impressive. The accuracy and performance are outstanding.",
    author: "James T.",
    role: "Verified buyer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote: "Finally, luxury fragrances at prices that make sense. ZARU is redefining what premium means.",
    author: "Priya S.",
    role: "Verified buyer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
  {
    quote: "The quality is insane. I get compliments all day wearing Victory Crown. Highly recommend ZARU.",
    author: "Hassan A.",
    role: "Verified buyer",
    avatar: "/placeholder.svg?height=80&width=80",
  },
]

const videoReviews = [
  {
    id: 1,
    name: "Ayaan",
    duration: "0:42",
    title: "Victory Crown Reaction",
    thumbnail: "/images/fragrance-victory-crown.jpg",
  },
  {
    id: 2,
    name: "Lina",
    duration: "0:55",
    title: "Wild Storm First Wear",
    thumbnail: "/images/fragrance-wild-storm.jpg",
  },
  {
    id: 3,
    name: "Ravi",
    duration: "0:38",
    title: "Blue Legacy Compliments",
    thumbnail: "/images/fragrance-blue-legacy.jpg",
  },
  {
    id: 4,
    name: "Mariam",
    duration: "1:03",
    title: "Longevity Check",
    thumbnail: "/images/mission-luxury-scent.jpg",
  },
  {
    id: 5,
    name: "Kabir",
    duration: "0:47",
    title: "Daily Rotation Pick",
    thumbnail: "/images/hero-zaru.jpg",
  },
]

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const videoScrollRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed

      // Reset position when we've scrolled past half (since we duplicate content)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener("mouseenter", handleMouseEnter)
    scrollContainer.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener("mouseenter", handleMouseEnter)
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const duplicatedTestimonials = [...testimonials, ...testimonials]

  const scrollVideoCards = (direction: "left" | "right") => {
    const container = videoScrollRef.current
    if (!container) return

    const amount = Math.round(container.clientWidth * 0.9)
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    })
  }

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-background overflow-hidden lg:py-32 lg:pb-0">
      {/* Section Header */}
      <div className="w-full">
        <div className="text-center mb-16 lg:mb-20 px-6">
          <p className="reveal opacity-0 text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-4">
            Customer Love
          </p>
          <ScrollBlurText
            text="Confidence in every spray"
            className="font-serif text-3xl md:text-4xl text-foreground text-balance lg:text-7xl font-light"
          />
        </div>

        <div className="reveal opacity-0 animation-delay-400">
          <div ref={scrollRef} className="flex gap-6 overflow-x-hidden" style={{ scrollBehavior: "auto" }}>
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[320px] md:w-[380px] bg-card rounded-2xl p-6 border border-border/50 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 my-6 py-10"
              >
                <blockquote className="font-serif text-base md:text-lg text-foreground leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm text-foreground">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 px-6 lg:px-8">
          <div className="reveal opacity-0 text-center mb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-3">Video Reviews</p>
            <h3 className="font-serif text-2xl md:text-3xl text-foreground">See real customer moments</h3>
          </div>

          <div
            ref={videoScrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible"
          >
            {videoReviews.map((review, index) => (
              <article
                key={review.id}
                className={`reveal opacity-0 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : index === 3 ? "animation-delay-600" : index === 4 ? "animation-delay-800" : ""} min-w-[74vw] sm:min-w-[52vw] md:min-w-[36vw] lg:min-w-0 snap-center rounded-2xl border border-border/50 overflow-hidden bg-card shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group`}
              >
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={review.thumbnail}
                    alt={`${review.name} video review`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                  <span className="absolute top-3 right-3 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded-full">
                    {review.duration}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-background/85 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-foreground text-sm mb-1">{review.title}</p>
                  <p className="text-xs text-muted-foreground">by {review.name}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 lg:hidden">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Scroll video reviews left"
              onClick={() => scrollVideoCards("left")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              aria-label="Scroll video reviews right"
              onClick={() => scrollVideoCards("right")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
