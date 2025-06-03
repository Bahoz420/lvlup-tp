import { NextResponse } from "next/server"

// Types for status notifications
interface StatusNotification {
  id: string
  productId: string | null // null means system-wide notification
  title: string
  message: string
  severity: "info" | "warning" | "critical"
  timestamp: string
  read: boolean
}

// In-memory storage for notifications
// In a real app, this would be stored in a database
const notifications: StatusNotification[] = [
  {
    id: "notif-001",
    productId: "apex-legends",
    title: "Apex Legends Update in Progress",
    message:
      "We are currently updating our Apex Legends cheats to match the latest game update. Service will be restored shortly.",
    severity: "info",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "notif-002",
    productId: null,
    title: "System Maintenance Complete",
    message: "The scheduled system maintenance has been completed. All services are now operating normally.",
    severity: "info",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: true,
  },
  {
    id: "notif-003",
    productId: "rust",
    title: "Rust Cheat Temporarily Offline",
    message:
      "Our Rust cheat is currently offline due to a game update. We are working on a fix and will have it back online soon.",
    severity: "warning",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    read: false,
  },
]

// GET handler for retrieving notifications
export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  let filteredNotifications = [...notifications]

  // Filter by product ID if provided
  if (productId) {
    filteredNotifications = filteredNotifications.filter(
      (notif) => notif.productId === productId || notif.productId === null,
    )
  }

  // Filter by read status if requested
  if (unreadOnly) {
    filteredNotifications = filteredNotifications.filter((notif) => !notif.read)
  }

  // Sort by timestamp (newest first)
  filteredNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return NextResponse.json({
    success: true,
    notifications: filteredNotifications,
  })
}

// POST handler for creating a new notification
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { productId, title, message, severity } = data

    if (!title || !message) {
      return NextResponse.json({ success: false, message: "Title and message are required" }, { status: 400 })
    }

    // Create a new notification
    const newNotification: StatusNotification = {
      id: `notif-${Date.now().toString(36)}`,
      productId: productId || null,
      title,
      message,
      severity: severity || "info",
      timestamp: new Date().toISOString(),
      read: false,
    }

    // Add the new notification
    notifications.unshift(newNotification)

    return NextResponse.json({
      success: true,
      message: "Notification created successfully",
      notification: newNotification,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create notification" }, { status: 400 })
  }
}

// PATCH handler for marking notifications as read
export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const { id, read } = data

    if (!id) {
      return NextResponse.json({ success: false, message: "Notification ID is required" }, { status: 400 })
    }

    // Find the notification
    const notificationIndex = notifications.findIndex((notif) => notif.id === id)

    if (notificationIndex === -1) {
      return NextResponse.json({ success: false, message: "Notification not found" }, { status: 404 })
    }

    // Update the read status
    notifications[notificationIndex].read = read !== undefined ? read : true

    return NextResponse.json({
      success: true,
      message: "Notification updated successfully",
      notification: notifications[notificationIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update notification" }, { status: 400 })
  }
}
