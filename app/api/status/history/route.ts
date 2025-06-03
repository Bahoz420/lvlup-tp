import { NextResponse } from "next/server"

// Types for status history
interface StatusHistoryEntry {
  timestamp: string
  status: "online" | "updating" | "offline"
  activeUsers: number
}

interface ProductStatusHistory {
  [productId: string]: StatusHistoryEntry[]
}

// In-memory storage for status history
// In a real app, this would be stored in a database
const statusHistory: ProductStatusHistory = {
  fortnite: [
    { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 450 },
    { timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), status: "updating", activeUsers: 120 },
    { timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 430 },
  ],
  valorant: [
    { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 380 },
    { timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 360 },
    { timestamp: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString(), status: "offline", activeUsers: 0 },
  ],
  "apex-legends": [
    { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), status: "updating", activeUsers: 50 },
    { timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 220 },
    { timestamp: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 210 },
  ],
  warzone: [
    { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 310 },
    { timestamp: new Date(Date.now() - 42 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 300 },
    { timestamp: new Date(Date.now() - 66 * 60 * 60 * 1000).toISOString(), status: "updating", activeUsers: 80 },
  ],
  pubg: [
    { timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 195 },
    { timestamp: new Date(Date.now() - 32 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 190 },
    { timestamp: new Date(Date.now() - 56 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 185 },
  ],
  rust: [
    { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), status: "offline", activeUsers: 0 },
    { timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 240 },
    { timestamp: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(), status: "online", activeUsers: 235 },
  ],
}

// GET handler for retrieving status history
export async function GET(request: Request) {
  // Get the product ID from the query string
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const days = Number.parseInt(searchParams.get("days") || "3", 10)

  // If a product ID is provided, return history for that product
  if (productId && statusHistory[productId]) {
    return NextResponse.json({
      success: true,
      history: statusHistory[productId],
    })
  }

  // Otherwise, return history for all products
  return NextResponse.json({
    success: true,
    history: statusHistory,
  })
}

// POST handler for adding a new history entry
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { productId, status, activeUsers } = data

    if (!productId || !status) {
      return NextResponse.json({ success: false, message: "Product ID and status are required" }, { status: 400 })
    }

    // Create the product history array if it doesn't exist
    if (!statusHistory[productId]) {
      statusHistory[productId] = []
    }

    // Add the new entry
    const newEntry: StatusHistoryEntry = {
      timestamp: new Date().toISOString(),
      status,
      activeUsers: activeUsers || 0,
    }

    statusHistory[productId].unshift(newEntry)

    // Keep only the last 30 entries
    if (statusHistory[productId].length > 30) {
      statusHistory[productId] = statusHistory[productId].slice(0, 30)
    }

    return NextResponse.json({
      success: true,
      message: "History entry added successfully",
      entry: newEntry,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add history entry" }, { status: 400 })
  }
}
