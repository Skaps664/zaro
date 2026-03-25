"use client"

import { useEffect, useRef, useState } from "react"
import { FlaskConical, Gauge, Leaf, Shield, Sparkles, Users } from "lucide-react"
import { ScrollBlurText } from "./scroll-blur-text"

const stats = [
  { icon: FlaskConical, value: "8+", label: "Hero Fragrances" },
  { icon: Leaf, value: "100%", label: "Premium Oils" },
  { icon: Shield, value: "12+", label: "Hours Longevity" },
  { icon: Users, value: "50K+", label: "Happy Customers" },
]

const principles = [
  {
    number: "01",
    title: "Accuracy",
    description: "Designer-level scent profile, tuned note by note.",
    icon: Sparkles,
    points: ["True-to-profile blends", "Balanced dry-down"],
  },
  {
    number: "02",
    title: "Performance",
    description: "Built for projection and all-day wear.",
    icon: Gauge,
    points: ["High-concentration oils", "Consistent skin performance"],
  },
  {
    number: "03",
    title: "Smart Luxury",
    description: "Premium quality without the luxury markup.",
    icon: Shield,
    points: ["Efficient sourcing", "Honest pricing model"],
  },
]

export function ScienceSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [animatedValues, setAnimatedValues] = useState<{ [key: string]: number }>({})
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up")
            if (!hasAnimated) {
              setHasAnimated(true)
              stats.forEach((stat) => {
                animateCounter(stat.value, stat.label)
              })
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".reveal")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateCounter = (value: string, label: string) => {
    const numericValue = Number.parseInt(value.replace(/[^0-9]/g, ""))
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const currentValue = Math.min(Math.round(increment * currentStep), numericValue)
      setAnimatedValues((prev) => ({ ...prev, [label]: currentValue }))

      if (currentStep >= steps) {
        clearInterval(timer)
      }
    }, duration / steps)
  }

  const formatValue = (originalValue: string, animatedValue: number | undefined) => {
    if (animatedValue === undefined) return "0"

    if (originalValue.includes("%")) return `${animatedValue}%`
    if (originalValue.includes("K+")) return `${animatedValue}K+`
    if (originalValue.includes("+")) return `${animatedValue}+`
    return `${animatedValue}`
  }

  return (
    <section ref={sectionRef} id="accuracy" className="py-20 lg:py-28 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 lg:mb-14">
          <p className="reveal opacity-0 inline-flex items-center rounded-full border border-primary-foreground/20 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-primary-foreground/80 font-medium mb-5">
            Why ZARU
          </p>
          <ScrollBlurText
            text="Precision meets passion"
            className="font-serif text-3xl md:text-5xl text-primary-foreground text-balance mb-4 lg:text-6xl font-light"
          />
          <p className="reveal opacity-0 animation-delay-400 text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto leading-relaxed">
            Clean formulation, strong performance, and a smarter price. Premium fragrance made simple.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="reveal opacity-0 animation-delay-400 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10 lg:mb-14">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 backdrop-blur-sm p-4 md:p-5 text-center"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
              </div>
              <div className="font-serif text-3xl md:text-4xl font-medium text-primary-foreground mb-1">
                {formatValue(stat.value, animatedValues[stat.label])}
              </div>
              <div className="text-xs md:text-sm text-primary-foreground/75">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Principles Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {principles.map((principle, index) => (
            <div
              key={principle.number}
              className={`reveal opacity-0 rounded-3xl border border-primary-foreground/15 bg-primary-foreground/8 p-5 md:p-6 ${index === 1 ? "animation-delay-200" : index === 2 ? "animation-delay-400" : ""}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-primary-foreground/55 tracking-[0.16em]">{principle.number}</span>
                <div className="w-9 h-9 rounded-lg bg-primary-foreground/12 flex items-center justify-center">
                  <principle.icon className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-medium text-primary-foreground mb-3">
                {principle.title}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed text-sm md:text-base mb-4">
                {principle.description}
              </p>
              <div className="space-y-2">
                {principle.points.map((point) => (
                  <p key={point} className="text-xs md:text-sm text-primary-foreground/70">
                    • {point}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
