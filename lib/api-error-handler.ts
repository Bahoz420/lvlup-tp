// Centralized API error handling
import { NextResponse } from "next/server"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export function handleApiError(error: unknown) {
  console.error("API Error:", error)

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }

  return NextResponse.json({ error: "Unknown error occurred" }, { status: 500 })
}

// Input validation helpers
export function validateRequired(data: Record<string, any>, fields: string[]) {
  const missing = fields.filter((field) => !data[field])
  if (missing.length > 0) {
    throw new ApiError(400, `Missing required fields: ${missing.join(", ")}`)
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format")
  }
}

export function validateNumeric(value: any, fieldName: string) {
  if (isNaN(Number(value))) {
    throw new ApiError(400, `${fieldName} must be a number`)
  }
}

export function validatePositive(value: number, fieldName: string) {
  if (value <= 0) {
    throw new ApiError(400, `${fieldName} must be positive`)
  }
}

export function validateUUID(value: string, fieldName: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(value)) {
    throw new ApiError(400, `${fieldName} must be a valid UUID`)
  }
}
