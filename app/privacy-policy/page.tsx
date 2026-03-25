import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "Privacy Policy | ZARU",
  description: "Learn how ZARU handles and protects your personal information.",
}

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description="Your privacy matters. This page explains what we collect and how we use it."
    >
      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="font-medium text-lg mb-2">Information We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">We may collect your name, contact details, order information, and communication history for support and order processing.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">How We Use Information</h2>
          <p className="text-muted-foreground leading-relaxed">We use your data to process orders, improve customer service, and share delivery or support updates.</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Data Protection</h2>
          <p className="text-muted-foreground leading-relaxed">We use reasonable security practices to protect customer information and limit access to authorized team members only.</p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
