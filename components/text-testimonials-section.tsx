"use client"

import { useEffect, useRef } from "react"
import { ScrollBlurText } from "./scroll-blur-text"

const testimonials = [
  {
    quote:
      "Yaar honestly I wasn't expecting much at this price but Victory Crown ne dil jeet liya. Aventus vibe is there, projection strong hai aur poori shift chalti hai easily. Paisa wasool.",
    author: "Ahmed Raza",
    role: "Karachi",
  },
  {
    quote:
      "Ordered Wild Storm for my husband, he loved it. Smells fresh and mardana, ghar mein sab log poochte hain kaunsa perfume laga hai. Delivery Peshawar tak 3 din mein aa gayi.",
    author: "Areeba Khan",
    role: "Peshawar",
  },
  {
    quote:
      "I've tried a few local brands before and honestly bohot disappointment thi. ZARU different hai — proper long lasting, sillage bhi decent. Blue Legacy is my daily driver ab.",
    author: "Bilal Ahmed",
    role: "Lahore",
  },
  {
    quote:
      "Received the parcel today, packaging kaafi premium lagi. Applied it and mashallah scent bilkul original jaisi hai. Recommended for anyone who wants a designer feel bina jeb khali kiye.",
    author: "Hamza Iqbal",
    role: "Islamabad",
  },
  {
    quote:
      "Meri wife ke liye order kiya tha as a gift. She said itni khushboo achi hai jitni Dubai se laayi hui bottle ki thi. Trust build ho gaya hai ZARU pe honestly.",
    author: "Usman Tariq",
    role: "Rawalpindi",
  },
  {
    quote:
      "Bhai review dena zaroori tha. COD pe order kiya, on time deliver hua, bottle bhi solid hai. Office mein log ab poochte hain kaunsa scent hai — proud moment lol.",
    author: "Fahad Malik",
    role: "Faisalabad",
  },
  {
    quote:
      "Was a bit hesitant kyunke online se perfume order karna risky lagta hai, lekin support team ne WhatsApp pe properly guide kiya. Fragrance is legit, longevity 8-10 hours easy.",
    author: "Zainab Siddiqui",
    role: "Multan",
  },
  {
    quote:
      "Honestly the price to quality ratio is unmatched. Maine Chanel aur Dior dono use kiye hain, aur ZARU ki quality ussi tier ki feel hoti hai. Kudos to the team.",
    author: "Danish Shah",
    role: "Karachi",
  },
]

export function TextTestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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
    const scrollSpeed = 0.5

    const animate = () => {
      scrollPosition += scrollSpeed

      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

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

  return (
    <div ref={sectionRef}>
      <div className="text-center mb-16 lg:mb-20 px-6 pt-8">
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

              <div className="pt-4 border-t border-border/30">
                <div className="font-medium text-sm text-foreground">{testimonial.author}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Verified buyer · {testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
