"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from "lucide-react"

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
    videoUrl: "",
  },
  {
    id: "review-2",
    name: "Lina",
    duration: "0:55",
    title: "Wild Storm First Wear",
    thumbnail: "/images/fragrance-wild-storm.jpg",
    videoUrl: "",
  },
  {
    id: "review-3",
    name: "Ravi",
    duration: "0:38",
    title: "Blue Legacy Compliments",
    thumbnail: "/images/fragrance-blue-legacy.jpg",
    videoUrl: "",
  },
  {
    id: "review-4",
    name: "Customer 4",
    duration: "0:45",
    title: "Loved the longevity",
    thumbnail: "/images/hero-zaru.jpg",
    videoUrl: "",
  },
  {
    id: "review-5",
    name: "Customer 5",
    duration: "0:40",
    title: "Great projection",
    thumbnail: "/images/hero-zaru.jpg",
    videoUrl: "",
  },
]

function normalizeVideos(videos?: VideoReview[]) {
  const incoming = Array.isArray(videos) ? videos : []
  return defaultReviews.map((fallback, index) => {
    const candidate = incoming[index]
    return {
      id: candidate?.id || fallback.id,
      name: candidate?.name || fallback.name,
      duration: candidate?.duration || fallback.duration,
      title: candidate?.title || fallback.title,
      thumbnail: candidate?.thumbnail || fallback.thumbnail,
      videoUrl: candidate?.videoUrl || "",
    }
  })
}

function VideoCard({ review, delayClass }: { review: VideoReview; delayClass: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  const toggleMute = () => {
    const element = videoRef.current
    if (!element) return
    element.muted = !element.muted
    setIsMuted(element.muted)
  }

  const togglePlayPause = async () => {
    const element = videoRef.current
    if (!element) return

    if (element.paused) {
      try {
        await element.play()
        setIsPlaying(true)
      } catch {
        setIsPlaying(false)
      }
      return
    }

    element.pause()
    setIsPlaying(false)
  }

  return (
    <article
      className={`reveal opacity-0 ${delayClass} min-w-[74vw] sm:min-w-[52vw] md:min-w-[36vw] lg:min-w-0 snap-center rounded-2xl border border-border/50 overflow-hidden bg-card shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 group`}
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-black">
        {review.videoUrl ? (
          <video
            ref={videoRef}
            src={review.videoUrl}
            poster={review.thumbnail}
            playsInline
            preload="metadata"
            muted
            className="w-full h-full object-cover"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <img src={review.thumbnail} alt={`${review.name} video review`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent pointer-events-none" />

        <span className="absolute top-3 left-3 bg-background/90 text-foreground text-xs font-medium px-2 py-1 rounded-full z-10">
          {review.duration}
        </span>

        <button
          type="button"
          onClick={toggleMute}
          disabled={!review.videoUrl}
          className="absolute top-3 right-3 z-10 h-12 w-12 rounded-full bg-background/90 text-foreground flex items-center justify-center disabled:opacity-60"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>

        <button
          type="button"
          onClick={togglePlayPause}
          disabled={!review.videoUrl}
          className="absolute inset-0 z-10 flex items-center justify-center disabled:cursor-not-allowed"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          <span className="w-16 h-16 rounded-full bg-background/90 text-foreground flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" fill="currentColor" />}
          </span>
        </button>
      </div>

      <div className="p-4">
        <p className="font-medium text-foreground text-sm mb-1">{review.title}</p>
        <p className="text-xs text-muted-foreground">by {review.name}</p>
      </div>
    </article>
  )
}

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

  const rows = normalizeVideos(videos)

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
        {rows.map((review, index) => (
          <VideoCard
            key={review.id}
            review={review}
            delayClass={
              index === 1
                ? "animation-delay-200"
                : index === 2
                  ? "animation-delay-400"
                  : index === 3
                    ? "animation-delay-600"
                    : index === 4
                      ? "animation-delay-800"
                      : ""
            }
          />
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
