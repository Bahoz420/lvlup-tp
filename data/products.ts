export const products = [
  {
    id: "fortnite",
    name: "Fortnite lvlup Cheat",
    description: "Dominate Fortnite with our premium cheat featuring aimbot, ESP, and more advanced features.",
    image_url: "/fortnite.png",
    category: "Battle Royale",
    status: "online",
    features: [
      "Aimbot with customizable settings",
      "ESP (Wallhack) for players and items",
      "No recoil and no spread",
      "Speed hack and fly mode",
      "Auto-aim and trigger bot",
      "Customizable crosshair",
      "Anti-ban protection",
    ],
    pricing: {
      "3day": { price: 9.99, originalPrice: 12.99 },
      week: { price: 19.99, originalPrice: 24.99 },
      month: { price: 39.99, originalPrice: 49.99 },
      lifetime: { price: 29.99, originalPrice: 59.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "Run as administrator required",
    },
  },
  {
    id: "valorant",
    name: "Valorant lvlup Cheat",
    description: "Professional Valorant cheat with advanced aimbot, wallhack, and anti-detection features.",
    image_url: "/valorant.png",
    category: "FPS",
    status: "online",
    features: [
      "Precision aimbot with bone selection",
      "ESP for enemies and utilities",
      "Triggerbot with customizable delay",
      "Recoil control system",
      "Radar hack",
      "Skin changer",
      "Stream-proof overlay",
    ],
    pricing: {
      "3day": { price: 12.99, originalPrice: 15.99 },
      week: { price: 24.99, originalPrice: 29.99 },
      month: { price: 49.99, originalPrice: 59.99 },
      lifetime: { price: 89.99, originalPrice: 119.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "Secure boot disabled",
    },
  },
  {
    id: "apex",
    name: "Apex Legends lvlup Cheat",
    description: "Advanced Apex Legends cheat with superior aimbot and ESP capabilities.",
    image_url: "/apex.png",
    category: "Battle Royale",
    status: "online",
    features: [
      "Smart aimbot with prediction",
      "3D ESP for players and loot",
      "No recoil macro",
      "Speed boost",
      "Item ESP with filtering",
      "Distance calculator",
      "Anti-detection system",
    ],
    pricing: {
      "3day": { price: 8.99, originalPrice: 11.99 },
      week: { price: 17.99, originalPrice: 22.99 },
      month: { price: 34.99, originalPrice: 44.99 },
      lifetime: { price: 69.99, originalPrice: 89.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "Run as administrator required",
    },
  },
  {
    id: "warzone",
    name: "Warzone lvlup Cheat",
    description: "Dominate Call of Duty Warzone with our feature-rich cheat package.",
    image_url: "/warzone.png",
    category: "Battle Royale",
    status: "online",
    features: [
      "Advanced aimbot with smoothing",
      "ESP for players, vehicles, and loot",
      "No recoil and no sway",
      "Radar with player tracking",
      "Auto-pickup for items",
      "Customizable FOV",
      "Undetected for months",
    ],
    pricing: {
      "3day": { price: 11.99, originalPrice: 14.99 },
      week: { price: 22.99, originalPrice: 27.99 },
      month: { price: 44.99, originalPrice: 54.99 },
      lifetime: { price: 79.99, originalPrice: 99.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "Disable Windows Defender",
    },
  },
  {
    id: "pubg",
    name: "PUBG lvlup Cheat",
    description: "Professional PUBG cheat with comprehensive features for competitive advantage.",
    image_url: "/pubg.png",
    category: "Battle Royale",
    status: "online",
    features: [
      "Precision aimbot with lead calculation",
      "ESP for players, vehicles, and items",
      "No grass rendering",
      "Speed hack",
      "Jump hack",
      "Inventory manager",
      "Anti-ban protection",
    ],
    pricing: {
      "3day": { price: 7.99, originalPrice: 10.99 },
      week: { price: 15.99, originalPrice: 19.99 },
      month: { price: 29.99, originalPrice: 39.99 },
      lifetime: { price: 59.99, originalPrice: 79.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "Run as administrator required",
    },
  },
  {
    id: "rust",
    name: "Rust lvlup Cheat",
    description: "Survive and dominate in Rust with our advanced cheat features.",
    image_url: "/rust.png",
    category: "Survival",
    status: "online",
    features: [
      "Aimbot with projectile prediction",
      "ESP for players, animals, and resources",
      "No recoil system",
      "Radar with entity tracking",
      "Auto-farm for resources",
      "Night vision",
      "Silent aim",
    ],
    pricing: {
      "3day": { price: 9.99, originalPrice: 12.99 },
      week: { price: 18.99, originalPrice: 23.99 },
      month: { price: 36.99, originalPrice: 46.99 },
      lifetime: { price: 74.99, originalPrice: 94.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "EAC bypass included",
    },
  },
  {
    id: "cs2",
    name: "CS2 lvlup Cheat",
    description: "Professional Counter-Strike 2 cheat with advanced features and anti-detection.",
    image_url: "/cs2.png",
    category: "FPS",
    status: "online",
    features: [
      "Precision aimbot with RCS",
      "ESP with bone display",
      "Triggerbot with customization",
      "Bhop and strafe assistance",
      "Skin changer",
      "Rank revealer",
      "Stream-safe overlay",
    ],
    pricing: {
      "3day": { price: 5.99, originalPrice: 8.99 },
      week: { price: 12.99, originalPrice: 16.99 },
      month: { price: 24.99, originalPrice: 32.99 },
      lifetime: { price: 49.99, originalPrice: 69.99 },
    },
    requirements: {
      os: "Windows 10/11",
      game_version: "Latest",
      additional: "VAC bypass included",
    },
  },
]

export function getProductById(id: string) {
  return products.find((product) => product.id === id)
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category)
}

export function getAllCategories() {
  return [...new Set(products.map((product) => product.category))]
}
