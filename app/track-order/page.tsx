import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "Track Order | ZARU",
  description: "Track your ZARU order status and delivery progress.",
}

export default function TrackOrderPage() {
  return (
    <StaticPageLayout
      eyebrow="Support"
      title="Track Order"
      description="Use your order details to check the latest delivery status."
    >
      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="font-medium text-lg mb-2">How tracking works</h2>
          <p className="text-muted-foreground leading-relaxed">After dispatch, you receive a confirmation with your order ID and tracking updates through our support channel.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Need live status?</h2>
          <p className="text-muted-foreground leading-relaxed">Share your order ID with our team at hello@zaru.com and we will provide the latest update.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Delivery timeline</h2>
          <p className="text-muted-foreground leading-relaxed">Standard delivery usually takes 2 to 5 business days depending on location.</p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
