"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

type VideoReview = {
  id: string
  name: string
  duration: string
  title: string
  thumbnail: string
  videoUrl?: string
}

type VideoTestimonialsSectionProps = {
  heading?: string
  subheading?: string
  videos?: VideoReview[]
}

const defaultReviews: VideoReview[] = [
  {
    id: "review-1",
    name: "Ayaan",
    duration: "0:42",
    title: "Victory Crown Reaction",
    thumbnail: "/images/fragrance-victory-crown.jpg",
  },
  {
    id: "review-2",
    name: "Lina",
    duration: "0:55",
    title: "Wild Storm First Wear",
    thumbnail: "/images/fragrance-wild-storm.jpg",
  },
  {
    id: "review-3",
    name: "Ravi",
    duration: "0:38",
    title: "Blue Legacy Compliments",
    thumbnail: "/images/fragrance-blue-legacy.jpg",
  },
]

export function VideoTestimonialsSection({
  heading = "Video Reviews",
  subheading = "Here's what our customer think about our products",
  videos = defaultReviews,
}: VideoTestimonialsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
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
    <div ref={sectionRef} className="mt-16 px-6 lg:px-8 pb-8">
      <div className="reveal opacity-0 text-center mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-secondary font-medium mb-3">{heading}</p>
        <h3 className="font-serif text-2xl md:text-3xl text-foreground">{subheading}</h3>
      </div>

      <div
        ref={videoScrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible"
      >
        {videos.map((review, index) => (
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
              {review.videoUrl ? (
                <a
                  href={review.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="w-12 h-12 rounded-full bg-background/85 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  </span>
                </a>
              ) : (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-background/85 text-foreground flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                  </span>
                </span>
              )}
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
  )
}
