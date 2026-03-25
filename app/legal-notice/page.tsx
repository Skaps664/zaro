import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "Legal Notice | ZARU",
  description: "Legal information and business notice for ZARU.",
}

export default function LegalNoticePage() {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Legal Notice"
      description="Important legal information for visitors and customers of ZARU."
    >
      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="font-medium text-lg mb-2">Brand Statement</h2>
          <p className="text-muted-foreground leading-relaxed">ZARU produces premium fragrance impressions inspired by globally recognized scent profiles.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">All text, branding, and website content published by ZARU are protected and may not be copied without permission.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Contact</h2>
          <p className="text-muted-foreground">For legal queries: hello@zaru.com</p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
