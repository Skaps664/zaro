import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductSection } from "@/components/product-section"
import { ScienceSection } from "@/components/science-section"
import { SpotlightSection } from "@/components/spotlight-section"
import { MissionSection } from "@/components/mission-section"
import { Footer } from "@/components/footer"
import { TextTestimonialsSection } from "@/components/text-testimonials-section"
import { VideoTestimonialsSection } from "@/components/video-testimonials-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ProductSection />
      <VideoTestimonialsSection/>
      <ScienceSection />
            <TextTestimonialsSection/>
      <SpotlightSection />

      <MissionSection />
      <Footer />
    </main>
  )
}
