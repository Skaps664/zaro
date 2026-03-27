import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProductSection } from "@/components/product-section"
import { ScienceSection } from "@/components/science-section"
import { SpotlightSection } from "@/components/spotlight-section"
import { MissionSection } from "@/components/mission-section"
import { Footer } from "@/components/footer"
import { TextTestimonialsSection } from "@/components/text-testimonials-section"
import { VideoTestimonialsSection } from "@/components/video-testimonials-section"
import { HeroProductSection } from "@/components/hero-product-section"
import { getFeaturedCatalogProducts, getHeroSingleProduct, getSiteSettings } from "@/lib/storefront-data"

export const revalidate = 120

export default async function Home() {
  const [siteSettings, featuredProducts, heroSingleProduct] = await Promise.all([
    getSiteSettings(),
    getFeaturedCatalogProducts(3),
    getHeroSingleProduct(),
  ])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection
        heroImageUrl={siteSettings.heroImageUrl}
        titleLine1={siteSettings.heroTitleLine1}
        titleLine2={siteSettings.heroTitleLine2}
        subtitle={siteSettings.heroSubtitle}
      />
      <ProductSection
        products={featuredProducts}
        eyebrow={siteSettings.heroProductsEyebrow}
        title={siteSettings.heroProductsTitle}
        subtitle={siteSettings.heroProductsSubtitle}
      />
      <VideoTestimonialsSection
        heading={siteSettings.videoReviewsHeading}
        subheading={siteSettings.videoReviewsSubheading}
        videos={siteSettings.videoReviews}
      />
      <ScienceSection />
      <HeroProductSection
        product={heroSingleProduct}
        eyebrow={siteSettings.heroSingleEyebrow}
        title={siteSettings.heroSingleTitle}
        subtitle={siteSettings.heroSingleSubtitle}
        imageUrl={siteSettings.heroSingleImageUrl}
        discountPercentage={siteSettings.heroSingleDiscountPercentage}
      />
      <TextTestimonialsSection/>
      <SpotlightSection
        imageUrl={siteSettings.bannerImage1}
        subtitle={siteSettings.spotlightSubtitle}
        title={siteSettings.spotlightTitle}
        paragraph1={siteSettings.spotlightParagraph1}
        paragraph2={siteSettings.spotlightParagraph2}
      />

      <MissionSection
        imageUrl={siteSettings.bannerImage2}
        eyebrow={siteSettings.missionEyebrow}
        title={siteSettings.missionTitle}
        paragraph={siteSettings.missionParagraph}
        cta={siteSettings.missionCta}
      />
      <Footer />
    </main>
  )
}
