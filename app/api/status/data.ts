import type { ProductStatusData } from "./route"

// Exportiere die Produktstatusdaten, damit sie von anderen Routen verwendet werden können
export const productStatuses: ProductStatusData[] = [
  {
    id: "fortnite",
    name: "lvlup Fortnite",
    slug: "fortnite",
    status: "online",
    activeUsers: 476,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    category: "BATTLE ROYALE",
    imageUrl: "/fortnite.png",
    features: ["Aimbot", "ESP", "Radar Hack", "HWID Spoofer"],
  },
  {
    id: "valorant",
    name: "lvlup Valorant",
    slug: "valorant",
    status: "online",
    activeUsers: 389,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    category: "FPS",
    imageUrl: "/valorant.png",
    features: ["Aimbot", "Wallhack", "Triggerbot", "Anti-Recoil"],
  },
  {
    id: "apex-legends",
    name: "lvlup Apex Legends",
    slug: "apex-legends",
    status: "updating",
    activeUsers: 215,
    lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    category: "BATTLE ROYALE",
    imageUrl: "/apex.png",
    features: ["Aimbot", "ESP", "Item ESP", "No Recoil"],
  },
  {
    id: "warzone",
    name: "lvlup Warzone",
    slug: "warzone",
    status: "online",
    activeUsers: 312,
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    category: "BATTLE ROYALE",
    imageUrl: "/warzone.png",
    features: ["Aimbot", "ESP", "Radar", "Unlock All"],
  },
  {
    id: "pubg",
    name: "lvlup PUBG",
    slug: "pubg",
    status: "online",
    activeUsers: 198,
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    category: "BATTLE ROYALE",
    imageUrl: "/pubg.png",
    features: ["Aimbot", "ESP", "Magic Bullet", "Speed Hack"],
  },
  {
    id: "rust",
    name: "lvlup Rust",
    slug: "rust",
    status: "offline",
    activeUsers: 0,
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    category: "SURVIVAL",
    imageUrl: "/rust.png",
    features: ["ESP", "Aimbot", "No Recoil", "Admin Tools"],
  },
]
