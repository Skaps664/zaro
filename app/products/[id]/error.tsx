"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Surface the actual server-side error into the browser console AND
    // the server logs (via console.error in the client) so we can debug
    // production crashes even when Next.js hides them behind an opaque digest.
    console.error("[ProductDetailError]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    })
  }, [error])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
            We couldn&rsquo;t load this fragrance
          </h1>
          <p className="text-muted-foreground mb-6">
            Something went wrong while loading this product page. This is on us — please try again or
            head back to the full catalog.
          </p>

          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6">
              Reference:{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">{error.digest}</code>
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
            <Button asChild variant="outline">
              <Link href="/products">Back to all products</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
