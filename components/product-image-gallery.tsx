"use client"

import { useMemo, useState } from "react"

type ProductImageGalleryProps = {
  name: string
  images?: string[]
  fallbackImage: string
}

export function ProductImageGallery({ name, images, fallbackImage }: ProductImageGalleryProps) {
  const allImages = useMemo(() => {
    const set = new Set<string>()
    if (Array.isArray(images)) {
      images.forEach((image) => {
        if (typeof image === "string" && image.trim()) set.add(image)
      })
    }
    if (fallbackImage) set.add(fallbackImage)
    return Array.from(set).slice(0, 4)
  }, [fallbackImage, images])

  const [activeImage, setActiveImage] = useState(allImages[0] ?? fallbackImage)

  return (
    <div>
      <div className="rounded-3xl overflow-hidden border border-border/60 bg-muted">
        <img src={activeImage} alt={name} className="w-full h-full object-cover aspect-[4/5]" />
      </div>

      {allImages.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {allImages.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`rounded-xl overflow-hidden border ${activeImage === image ? "border-primary" : "border-border/60"}`}
            >
              <img src={image} alt={`${name} thumbnail`} className="h-20 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
