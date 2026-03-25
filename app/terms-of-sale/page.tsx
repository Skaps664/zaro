import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "Terms of Sale | ZARU",
  description: "Terms and conditions related to purchases made with ZARU.",
}

export default function TermsOfSalePage() {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Terms of Sale"
      description="Please read these terms before placing an order with ZARU."
    >
      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="font-medium text-lg mb-2">Orders</h2>
          <p className="text-muted-foreground leading-relaxed">Orders are processed after confirmation. Product availability and dispatch timing may vary by location and demand.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Pricing and Payment</h2>
          <p className="text-muted-foreground leading-relaxed">All prices are listed in local currency unless otherwise stated. Promotional offers may change without prior notice.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Returns and Support</h2>
          <p className="text-muted-foreground leading-relaxed">If there is a delivery or quality issue, contact support promptly at hello@zaru.com so our team can assist you.</p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
