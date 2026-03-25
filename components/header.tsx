"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, ShoppingBag, User, X } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <nav className="max-w-7xl mx-auto bg-background/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between h-20 px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/zaru-logo.png" alt="ZARU logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Right Group */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <div className="flex items-center gap-8">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link href="/#fragrances" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Hero Picks
              </Link>
            </div>

            <div className="flex items-center gap-2 pl-4 border-l border-border/60">
              <Link
                href="/"
                aria-label="Account"
                className="w-10 h-10 rounded-full border border-border/60 hover:bg-muted/60 transition-colors flex items-center justify-center"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                aria-label="Cart"
                className="w-10 h-10 rounded-full border border-border/60 hover:bg-muted/60 transition-colors flex items-center justify-center"
              >
                <ShoppingBag className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-6 px-6 lg:px-8 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <Link
                href="/products"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/#fragrances"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Hero Picks
              </Link>
              <Link
                href="/#accuracy"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Why ZARU
              </Link>
              <Link
                href="/#testimonials"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="/#mission"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5" />
                Account
              </Link>
              <Link
                href="/products"
                className="text-lg text-muted-foreground hover:text-foreground transition-colors flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag className="w-5 h-5" />
                Cart
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
