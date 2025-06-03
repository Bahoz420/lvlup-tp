import { NextResponse } from "next/server"

// Types for status subscriptions
interface StatusSubscription {
  id: string
  email: string
  productIds: string[] | null // null means all products
  notificationTypes: ("status_change" | "maintenance" | "system_update")[]
  createdAt: string
}

// In-memory storage for subscriptions
// In a real app, this would be stored in a database
const subscriptions: StatusSubscription[] = []

// GET handler for retrieving subscriptions
export async function GET(request: Request) {
  // In a real app, this would be authenticated and would only return
  // subscriptions for the authenticated user

  // Get the email from the query string
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
  }

  // Filter subscriptions by email
  const userSubscriptions = subscriptions.filter((sub) => sub.email === email)

  return NextResponse.json({
    success: true,
    subscriptions: userSubscriptions,
  })
}

// POST handler for creating a new subscription
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { email, productIds, notificationTypes } = data

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    // Create a new subscription
    const newSubscription: StatusSubscription = {
      id: `sub-${Date.now().toString(36)}`,
      email,
      productIds: productIds || null,
      notificationTypes: notificationTypes || ["status_change", "maintenance", "system_update"],
      createdAt: new Date().toISOString(),
    }

    // Add the new subscription
    subscriptions.push(newSubscription)

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully",
      subscription: newSubscription,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to create subscription" }, { status: 400 })
  }
}

// DELETE handler for removing a subscription
export async function DELETE(request: Request) {
  // Get the subscription ID from the query string
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ success: false, message: "Subscription ID is required" }, { status: 400 })
  }

  // Find the subscription
  const subscriptionIndex = subscriptions.findIndex((sub) => sub.id === id)

  if (subscriptionIndex === -1) {
    return NextResponse.json({ success: false, message: "Subscription not found" }, { status: 404 })
  }

  // Remove the subscription
  const removedSubscription = subscriptions.splice(subscriptionIndex, 1)[0]

  return NextResponse.json({
    success: true,
    message: "Subscription removed successfully",
    subscription: removedSubscription,
  })
}
