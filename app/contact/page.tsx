import { StaticPageLayout } from "@/components/static-page-layout"

export const metadata = {
  title: "Contact | ZARU",
  description: "Contact ZARU for orders, support, and product assistance.",
}

export default function ContactPage() {
  return (
    <StaticPageLayout
      eyebrow="Support"
      title="Contact Us"
      description="Need help choosing a fragrance or placing an order? We are here to help."
    >
      <div className="space-y-6 text-foreground">
        <section>
          <h2 className="font-medium text-lg mb-2">Customer Support</h2>
          <p className="text-muted-foreground">Email: hello@zaru.com</p>
          <p className="text-muted-foreground">Phone: +1 (555) 123-4567</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Business Hours</h2>
          <p className="text-muted-foreground">Monday to Saturday: 10:00 AM - 8:00 PM</p>
          <p className="text-muted-foreground">Sunday: Closed</p>
        </section>

        <section>
          <h2 className="font-medium text-lg mb-2">Location</h2>
          <p className="text-muted-foreground">Karachi, Pakistan</p>
        </section>
      </div>
    </StaticPageLayout>
  )
}
