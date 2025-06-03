// Validierungsfunktionen für Formulare

// Email validieren
export function validateEmail(email: string) {
  if (!email) {
    return { valid: false, message: "Email is required" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, message: "Please enter a valid email address" }
  }

  return { valid: true, message: "" }
}

// Passwort validieren
export function validatePassword(password: string) {
  if (!password) {
    return { valid: false, message: "Password is required", strength: "weak" as const }
  }

  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters", strength: "weak" as const }
  }

  // Stärke bestimmen
  let strength: "weak" | "medium" | "strong" = "weak"

  // Mindestens ein Großbuchstabe, ein Kleinbuchstabe und eine Zahl
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if ((hasUpperCase && hasLowerCase && hasNumbers) || (hasLowerCase && hasNumbers && hasSpecialChar)) {
    strength = "medium"
  }

  if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && password.length >= 10) {
    strength = "strong"
  }

  return {
    valid: true,
    message: "",
    strength,
  }
}

// Namen validieren
export function validateName(name: string, fieldName = "Name") {
  if (!name) {
    return { valid: false, message: `${fieldName} is required` }
  }

  if (name.length < 2) {
    return { valid: false, message: `${fieldName} must be at least 2 characters` }
  }

  return { valid: true, message: "" }
}

// Passwörter auf Übereinstimmung prüfen
export function validatePasswordsMatch(password: string, confirmPassword: string) {
  if (!confirmPassword) {
    return { valid: false, message: "Please confirm your password" }
  }

  if (password !== confirmPassword) {
    return { valid: false, message: "Passwords do not match" }
  }

  return { valid: true, message: "" }
}

// Aktivierungscode validieren
export async function validateActivationCode(code: string) {
  try {
    // API-Aufruf zur Validierung des Codes
    const response = await fetch("/api/validate-activation-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        valid: false,
        message: data.message || "Invalid activation code",
      }
    }

    return {
      valid: true,
      message: "Valid activation code",
      productName: data.productName,
      expiresAt: data.expiresAt,
    }
  } catch (error) {
    console.error("Error validating code:", error)
    return { valid: false, message: "Error validating code" }
  }
}

// Debounce-Funktion für verzögerte Validierung
export function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

// NEW VALIDATION FUNCTIONS

interface ValidationOptions {
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  required?: boolean
}

export function validateString(
  value: any,
  fieldName: string,
  options: ValidationOptions = {},
): { valid: boolean; message: string; value?: string } {
  const { minLength, maxLength, required = true } = options

  if (required && (value === undefined || value === null || String(value).trim() === "")) {
    return { valid: false, message: `${fieldName} is required` }
  }
  if (!required && (value === undefined || value === null || String(value).trim() === "")) {
    return { valid: true, value: undefined } // Optional and not provided
  }

  if (typeof value !== "string") {
    return { valid: false, message: `${fieldName} must be a string` }
  }

  const trimmedValue = String(value).trim()

  if (minLength !== undefined && trimmedValue.length < minLength) {
    return { valid: false, message: `${fieldName} must be at least ${minLength} characters long` }
  }
  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    return { valid: false, message: `${fieldName} must be no more than ${maxLength} characters long` }
  }
  return { valid: true, message: "", value: trimmedValue }
}

export function validateNumber(
  value: any,
  fieldName: string,
  options: ValidationOptions = {},
): { valid: boolean; message: string; value?: number } {
  const { min, max, required = true } = options

  if (required && (value === undefined || value === null || value === "")) {
    return { valid: false, message: `${fieldName} is required` }
  }
  if (!required && (value === undefined || value === null || value === "")) {
    return { valid: true, value: undefined }
  }

  const numValue = Number(value)
  if (isNaN(numValue)) {
    return { valid: false, message: `${fieldName} must be a number` }
  }
  if (min !== undefined && numValue < min) {
    return { valid: false, message: `${fieldName} must be at least ${min}` }
  }
  if (max !== undefined && numValue > max) {
    return { valid: false, message: `${fieldName} must be no more than ${max}` }
  }
  return { valid: true, message: "", value: numValue }
}

export function validateBoolean(
  value: any,
  fieldName: string,
  options: { required?: boolean } = {},
): { valid: boolean; message: string; value?: boolean } {
  const { required = false } = options // Booleans are often optional with a default

  if (required && (value === undefined || value === null)) {
    return { valid: false, message: `${fieldName} is required` }
  }
  if (!required && (value === undefined || value === null)) {
    return { valid: true, value: undefined } // Or a default like false
  }

  if (typeof value !== "boolean") {
    return { valid: false, message: `${fieldName} must be a boolean (true or false)` }
  }
  return { valid: true, message: "", value }
}

interface OrderProductInput {
  id: string
  name: string
  price: number
  quantity: number
  // Add other product fields if necessary, e.g., subscription
}

export function validateProductArray(
  products: any,
  fieldName: string,
): { valid: boolean; message: string; value?: OrderProductInput[] } {
  if (!Array.isArray(products)) {
    return { valid: false, message: `${fieldName} must be an array` }
  }
  if (products.length === 0) {
    return { valid: false, message: `${fieldName} cannot be empty` }
  }

  const validatedProducts: OrderProductInput[] = []
  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    if (typeof product !== "object" || product === null) {
      return { valid: false, message: `Each item in ${fieldName} must be an object. Item at index ${i} is invalid.` }
    }

    const idValidation = validateString(product.id, `${fieldName}[${i}].id`)
    if (!idValidation.valid) return idValidation

    const nameValidation = validateString(product.name, `${fieldName}[${i}].name`)
    if (!nameValidation.valid) return nameValidation

    const priceValidation = validateNumber(product.price, `${fieldName}[${i}].price`, { min: 0 })
    if (!priceValidation.valid) return priceValidation

    const quantityValidation = validateNumber(product.quantity, `${fieldName}[${i}].quantity`, { min: 1 })
    if (!quantityValidation.valid) return quantityValidation

    validatedProducts.push({
      id: idValidation.value!,
      name: nameValidation.value!,
      price: priceValidation.value!,
      quantity: quantityValidation.value!,
    })
  }
  return { valid: true, message: "", value: validatedProducts }
}
