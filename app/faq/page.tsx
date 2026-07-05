import { StaticPageLayout } from "@/components/static-page-layout"
import { JsonLd, buildMetadata, faqJsonLd } from "@/lib/seo"

const FAQ_ITEMS = [
  {
    question: "How long do ZARU fragrances last?",
    answer:
      "Most ZARU scents last 8 to 12 hours depending on skin type, weather, and application. In Pakistan's climate we tune formulations for stronger projection and longer wear compared to many international impressions.",
  },
  {
    question: "Are ZARU fragrances original designer perfumes?",
    answer:
      "ZARU creates premium impressions inspired by iconic scent profiles. We are not affiliated with any designer brand. Every bottle is our own composition — engineered for Pakistan's climate and priced honestly for local buyers.",
  },
  {
    question: "Can I test before buying a full bottle?",
    answer:
      "Yes. Our Discovery Set lets you sample multiple ZARU scents before committing to a full-size bottle. Message us on WhatsApp for the current sampler options.",
  },
  {
    question: "What is the best ZARU fragrance for daily wear?",
    answer:
      "Wild Storm, Blue Legacy and Dream are the most popular daily drivers — clean, versatile, office-safe and long-lasting on Pakistani skin.",
  },
  {
    question: "Do you offer Cash on Delivery in Pakistan?",
    answer:
      "Yes. Cash on Delivery is available across Pakistan through TCS, Leopards, Postex, and M&P. Advance payments also unlock an extra 10% discount at checkout.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Standard delivery is 3 to 5 business days across major cities in Pakistan. You will receive email + tracking updates from ZARU as soon as your order is dispatched.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Go to the My Orders page, enter the phone number or email you used at checkout, and see live status plus tracking number and courier once dispatched.",
  },
]

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  path: "/faq",
  description:
    "Answers to common questions about ZARU Fragrance Hub — longevity, projection, delivery across Pakistan, Cash on Delivery, returns, and order tracking.",
  keywords: [
    "ZARU FAQ",
    "ZARU perfume delivery",
    "cash on delivery perfume Pakistan",
    "perfume longevity Pakistan",
    "ZARU shipping time",
  ],
})

export default function FaqPage() {
  return (
    <StaticPageLayout
      eyebrow="Support"
      title="Frequently Asked Questions"
      description="Quick answers to the most common questions from ZARU customers."
    >
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <div className="space-y-6 text-foreground">
        {FAQ_ITEMS.map((item) => (
          <section key={item.question}>
            <h2 className="font-medium text-lg mb-2">{item.question}</h2>
            <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
          </section>
        ))}
      </div>
    </StaticPageLayout>
  )
}
