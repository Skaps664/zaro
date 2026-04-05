import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"
import { SITE_CONTACT } from "@/lib/site-contact"

const footerLinks = {
  fragrances: [
    { label: "Victory Crown", href: "/products/victory-crown" },
    { label: "Wild Storm", href: "/products/wild-storm" },
    { label: "Blue Legacy", href: "/products/blue-legacy" },
    { label: "All Fragrances", href: "/products" },
  ],
  company: [
    { label: "About ZARU", href: "/#mission" },
    { label: "Why ZARU", href: "/#accuracy" },
    { label: "Testimonials", href: "/#testimonials" },
    { label: "Hero Fragrances", href: "/#fragrances" },
  ],
  support: [
    { label: "Fragrance Guide", href: "/fragrance-guide" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <img src="/zaru-logo-white.png" alt="ZARU logo" className="h-10 w-auto" loading="lazy" decoding="async" />
            </Link>
            <p className="text-background/70 leading-relaxed mb-6 max-w-sm">
              Premium fragrance impressions inspired by iconic scents. Crafted for performance, designed for confidence.
            </p>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>{SITE_CONTACT.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>{SITE_CONTACT.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>{SITE_CONTACT.location}</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-background mb-4">Fragrances</h4>
            <ul className="space-y-3">
              {footerLinks.fragrances.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-background/50">© 2025 ZARU. All rights reserved.</p>
            <p className="text-xs text-background/50 mt-1">
              Designed and developed by{" "}
              <a
                href="https://www.skordlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-background transition-colors"
              >
                Skordlabs
              </a>
              .
            </p>
          </div>
          <div className="flex gap-6 text-sm text-background/50">
            <Link href="/legal-notice" className="hover:text-background transition-colors">
              Legal notice
            </Link>
            <Link href="/privacy-policy" className="hover:text-background transition-colors">
              Privacy policy
            </Link>
            <Link href="/terms-of-sale" className="hover:text-background transition-colors">
              Terms of sale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
