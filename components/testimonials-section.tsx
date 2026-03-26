"use client"

import { TextTestimonialsSection } from "./text-testimonials-section"
import { VideoTestimonialsSection } from "./video-testimonials-section"

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden lg:py-32 lg:pb-0">
      <div className="w-full">
        <TextTestimonialsSection />
        <VideoTestimonialsSection />
      </div>
    </section>
  )
}
