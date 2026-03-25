import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "FAQ | ZARU",
  description: "Frequently asked questions about ZARU fragrances and orders.",
}

export default function FaqPage() {
  return (
    <StaticPageLayout
      eyebrow="Support"
      title="Frequently Asked Questions"
      description="Quick answers to the most common questions from ZARU customers."
    >
      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="font-medium text-lg mb-2">How long do ZARU fragrances last?</h2>
          <p className="text-muted-foreground leading-relaxed">Most scents perform between 8 to 12 hours depending on skin type, weather, and application method.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Are your fragrances originals?</h2>
          <p className="text-muted-foreground leading-relaxed">ZARU creates premium impressions inspired by iconic scent profiles. We do not claim affiliation with designer brands.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Can I test before buying a full bottle?</h2>
          <p className="text-muted-foreground leading-relaxed">Yes. The Discovery Set is designed for sampling multiple scents before selecting full-size options.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">What is the best daily fragrance?</h2>
          <p className="text-muted-foreground leading-relaxed">Wild Storm, Blue Legacy, and Dream are popular daily choices for clean projection and versatility.</p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
