// Authentication constants to ensure consistency across the application
export const AUTH_CONSTANTS = {
  COOKIE_NAME: "auth_token",
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  JWT_EXPIRES_IN: "7d",
} as const

export const getCookieOptions = (maxAge?: number) => ({
  ...AUTH_CONSTANTS.COOKIE_OPTIONS,
  ...(maxAge !== undefined && { maxAge }),
})
