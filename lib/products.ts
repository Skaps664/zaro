export type Product = {
  id: string
  name: string
  inspiredBy: string
  category: string
  audience: "Male" | "Female" | "Unisex"
  notes: string[]
  description: string
  longevity: string
  projection: string
  bestFor: string
  time: string
  image: string
  images?: string[]
  price?: number
  videoEmbedUrl?: string
  isHero?: boolean
  hideOnAllProducts?: boolean
}

export const products: Product[] = [
  {
    id: "dream",
    name: "ZARU Dream",
    inspiredBy: "Imagination",
    category: "Fresh Citrus Woody",
    audience: "Unisex",
    notes: ["Citrus", "Bergamot", "Orange", "Tea", "Neroli", "Ginger", "Amber", "Musk", "Sandalwood"],
    description: "A bright, clean scent with a calm woody dry-down. Easy to wear and ideal for everyday confidence.",
    longevity: "8-10 hours",
    projection: "Moderate",
    bestFor: "Office, Daily",
    time: "Day",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "royal",
    name: "ZARU Royal",
    inspiredBy: "Ambassador",
    category: "Fresh Aromatic",
    audience: "Male",
    notes: ["Lemon", "Mint", "Lavender", "Spices", "Musk", "Wood"],
    description: "Fresh and polished with aromatic depth. A signature profile for professional settings.",
    longevity: "8-12 hours",
    projection: "Moderate to Strong",
    bestFor: "Office, Meetings",
    time: "Day / Night",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "floral-bloom",
    name: "ZARU Floral Bloom",
    inspiredBy: "Gucci Flora",
    category: "Floral Sweet",
    audience: "Female",
    notes: ["Peony", "Citrus", "Rose", "Osmanthus", "Patchouli", "Sandalwood"],
    description: "Soft floral elegance with a smooth warm base. Feminine, graceful, and timeless.",
    longevity: "7-10 hours",
    projection: "Moderate",
    bestFor: "Daily, Gatherings",
    time: "Day / Night",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "victory-crown",
    name: "ZARU Victory Crown",
    inspiredBy: "Creed Aventus",
    category: "Fruity Woody",
    audience: "Male",
    notes: ["Pineapple", "Apple", "Bergamot", "Birch", "Jasmine", "Musk", "Oakmoss", "Vanilla"],
    description: "Bold and commanding. Fruity energy up top with smoky woods and rich musk in the base.",
    longevity: "8-12 hours",
    projection: "Strong",
    bestFor: "Events, Office",
    time: "Day / Night",
    image: "/images/fragrance-victory-crown.jpg",
    isHero: true,
  },
  {
    id: "executive-code",
    name: "ZARU Executive Code",
    inspiredBy: "Office for Men",
    category: "Fresh Professional",
    audience: "Male",
    notes: ["Citrus", "Bergamot", "Amber", "Floral", "Musk", "Woody"],
    description: "Clean and professional with subtle depth. Built for long office days and polished presence.",
    longevity: "8-10 hours",
    projection: "Moderate",
    bestFor: "Office, Meetings",
    time: "Day",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "desire",
    name: "ZARU Desire",
    inspiredBy: "Dunhill Desire",
    category: "Warm Spicy",
    audience: "Male",
    notes: ["Apple", "Lemon", "Rose", "Teakwood", "Vanilla", "Musk"],
    description: "Warm, inviting, and romantic with a smooth vanilla-musky finish.",
    longevity: "8-11 hours",
    projection: "Strong",
    bestFor: "Date Nights, Evenings",
    time: "Night",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "crystal-flame",
    name: "ZARU Crystal Flame",
    inspiredBy: "BR540",
    category: "Amber Sweet",
    audience: "Unisex",
    notes: ["Saffron", "Amberwood", "Cedar", "Resin"],
    description: "Luxurious amber sweetness with a rich trail that feels modern, premium, and memorable.",
    longevity: "10-14 hours",
    projection: "Strong",
    bestFor: "Events, Special Occasions",
    time: "Night",
    image: "/images/hero-zaru.jpg",
    isHero: true,
  },
  {
    id: "wild-storm",
    name: "ZARU Wild Storm",
    inspiredBy: "Dior Sauvage",
    category: "Fresh Spicy",
    audience: "Male",
    notes: ["Bergamot", "Pepper", "Lavender", "Amber", "Patchouli"],
    description: "Fresh power with spicy edge. Designed for all-day confidence and high impact.",
    longevity: "8-12 hours",
    projection: "Strong",
    bestFor: "Daily, Outings",
    time: "Day / Night",
    image: "/images/fragrance-wild-storm.jpg",
    isHero: true,
  },
  {
    id: "active-rush",
    name: "ZARU Active Rush",
    inspiredBy: "J. Sport",
    category: "Fresh Sport",
    audience: "Male",
    notes: ["Citrus", "Aquatic", "Musk"],
    description: "Bright and sporty with a cool aquatic profile that stays clean and energetic.",
    longevity: "6-9 hours",
    projection: "Moderate",
    bestFor: "Gym, Casual",
    time: "Day",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "golden-elite",
    name: "ZARU Golden Elite",
    inspiredBy: "J. Gold",
    category: "Warm Woody",
    audience: "Male",
    notes: ["Citrus", "Spices", "Wood", "Musk"],
    description: "A classy warm woody blend that feels refined and premium from opening to dry-down.",
    longevity: "8-11 hours",
    projection: "Moderate to Strong",
    bestFor: "Formal Events, Business",
    time: "Day / Night",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "pink-charm",
    name: "ZARU Pink Charm",
    inspiredBy: "Bombshell",
    category: "Fruity Floral",
    audience: "Female",
    notes: ["Passionfruit", "Peony", "Musk"],
    description: "Lively and feminine with fruity sparkle and a soft floral heart.",
    longevity: "7-10 hours",
    projection: "Moderate",
    bestFor: "Daily, Outings",
    time: "Day",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "ocean-depth",
    name: "ZARU Ocean Depth",
    inspiredBy: "Megamare",
    category: "Marine Aquatic",
    audience: "Unisex",
    notes: ["Sea Breeze", "Marine Notes", "Ambergris"],
    description: "Deep marine freshness with cool, oceanic character and a long-lasting aquatic base.",
    longevity: "9-12 hours",
    projection: "Strong",
    bestFor: "Summer, Outdoor",
    time: "Day / Night",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "discovery-set",
    name: "ZARU Discovery Set",
    inspiredBy: "Top Sellers Collection",
    category: "Sample Collection",
    audience: "Unisex",
    notes: ["5ml testers", "Travel friendly", "Multi-scent set"],
    description: "Explore multiple ZARU fragrances before choosing your full-size signature bottle.",
    longevity: "Varies by scent",
    projection: "Varies by scent",
    bestFor: "First-time buyers, Gifting",
    time: "Day / Night",
    image: "/images/hero-zaru.jpg",
  },
  {
    id: "blue-legacy",
    name: "ZARU Blue Legacy",
    inspiredBy: "Bleu de Chanel",
    category: "Woody Aromatic",
    audience: "Male",
    notes: ["Lemon", "Mint", "Ginger", "Sandalwood", "Cedar"],
    description: "A modern classic with bright freshness and a smooth woody finish.",
    longevity: "8-12 hours",
    projection: "Strong",
    bestFor: "Office, Events, Daily",
    time: "Day / Night",
    image: "/images/fragrance-blue-legacy.jpg",
    isHero: true,
  },
]

export const featuredProducts = products.filter((product) => product.isHero).slice(0, 4)

const productPriceById: Record<string, number> = {
  dream: 3490,
  royal: 3490,
  "floral-bloom": 3290,
  "victory-crown": 3790,
  "executive-code": 3390,
  desire: 3390,
  "crystal-flame": 3890,
  "wild-storm": 3690,
  "active-rush": 3190,
  "golden-elite": 3590,
  "pink-charm": 3290,
  "ocean-depth": 3690,
  "discovery-set": 2490,
  "blue-legacy": 3790,
}

export function getProductPrice(id: string) {
  const product = getProductById(id)
  if (typeof product?.price === "number") {
    return product.price
  }

  return productPriceById[id] ?? 3490
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}
