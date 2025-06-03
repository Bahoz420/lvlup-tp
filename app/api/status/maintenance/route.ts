import { NextResponse } from "next/server"

// Types for maintenance schedule
interface MaintenanceEvent {
  id: string
  productId: string
  title: string
  description: string
  startTime: string
  endTime: string
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
}

// In-memory storage for maintenance schedule
// In a real app, this would be stored in a database
const maintenanceSchedule: MaintenanceEvent[] = [
  {
    id: "maint-001",
    productId: "apex-legends",
    title: "Apex Legends Update",
    description: "Scheduled maintenance for Apex Legends to update to the latest game version.",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours duration
    status: "scheduled",
  },
  {
    id: "maint-002",
    productId: "fortnite",
    title: "Fortnite Anti-Detection Update",
    description: "Implementing new anti-detection measures for Fortnite cheats.",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours duration
    status: "scheduled",
  },
  {
    id: "maint-003",
    productId: "rust",
    title: "Rust Cheat Reactivation",
    description: "Bringing Rust cheats back online after implementing fixes.",
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), // 4 hours duration
    status: "scheduled",
  },
]

// GET handler for retrieving maintenance schedule
export async function GET(request: Request) {
  // Get the product ID from the query string
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get("productId")
  const status = searchParams.get("status")

  let filteredSchedule = [...maintenanceSchedule]

  // Filter by product ID if provided
  if (productId) {
    filteredSchedule = filteredSchedule.filter((event) => event.productId === productId)
  }

  // Filter by status if provided
  if (status) {
    filteredSchedule = filteredSchedule.filter((event) => event.status === status)
  }

  return NextResponse.json({
    success: true,
    maintenance: filteredSchedule,
  })
}

// POST handler for adding a new maintenance event
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { productId, title, description, startTime, endTime, status } = data

    if (!productId || !title || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, message: "Product ID, title, start time, and end time are required" },
        { status: 400 },
      )
    }

    // Create a new maintenance event
    const newEvent: MaintenanceEvent = {
      id: `maint-${Date.now().toString(36)}`,
      productId,
      title,
      description: description || "",
      startTime,
      endTime,
      status: status || "scheduled",
    }

    // Add the new event to the schedule
    maintenanceSchedule.push(newEvent)

    return NextResponse.json({
      success: true,
      message: "Maintenance event added successfully",
      event: newEvent,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to add maintenance event" }, { status: 400 })
  }
}

// PATCH handler for updating a maintenance event
export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const { id, status, startTime, endTime, description } = data

    if (!id) {
      return NextResponse.json({ success: false, message: "Event ID is required" }, { status: 400 })
    }

    // Find the event
    const eventIndex = maintenanceSchedule.findIndex((event) => event.id === id)

    if (eventIndex === -1) {
      return NextResponse.json({ success: false, message: "Maintenance event not found" }, { status: 404 })
    }

    // Update the event
    maintenanceSchedule[eventIndex] = {
      ...maintenanceSchedule[eventIndex],
      ...(status && { status }),
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(description && { description }),
    }

    return NextResponse.json({
      success: true,
      message: "Maintenance event updated successfully",
      event: maintenanceSchedule[eventIndex],
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update maintenance event" }, { status: 400 })
  }
}
