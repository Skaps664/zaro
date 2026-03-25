import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "Fragrance Guide | ZARU",
  description: "Learn how to choose and wear ZARU fragrances for best performance.",
}

export default function FragranceGuidePage() {
  return (
    <StaticPageLayout
      eyebrow="Support"
      title="Fragrance Guide"
      description="Simple rules to pick the right scent and get better projection and longevity."
    >
      <div className="space-y-8 text-foreground">
        <section>
          <h2 className="font-serif text-2xl mb-3">How to choose a fragrance</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Start with your use case: office, daily wear, events, or evenings.</li>
            <li>Choose fresh profiles for daytime and warm profiles for nights.</li>
            <li>If you are unsure, begin with the Discovery Set and test on skin.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">How to apply for better performance</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
            <li>Apply on pulse points: neck, wrists, and behind ears.</li>
            <li>Spray on moisturized skin for stronger hold.</li>
            <li>Avoid rubbing after spraying so top notes stay intact.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-3">Storage tips</h2>
          <p className="text-muted-foreground leading-relaxed">
            Keep your bottle away from direct sunlight, heat, and humidity. Store in a cool, dry place with the cap tightly closed.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
