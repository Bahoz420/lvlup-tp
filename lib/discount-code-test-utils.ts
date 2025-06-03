import type { DiscountCodeValidationResult } from "@/types"

/**
 * Simuliert die Validierung eines Rabattcodes für Testzwecke
 */
export async function simulateDiscountCodeValidation(
  code: string,
  amount: number,
): Promise<DiscountCodeValidationResult> {
  // Simuliere eine Netzwerkverzögerung
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Testcodes mit verschiedenen Szenarien
  switch (code.toUpperCase()) {
    case "TEST10":
      return {
        valid: true,
        discountAmount: amount * 0.1,
        code: "TEST10",
        type: "percent",
        value: 10,
      }
    case "FLAT20":
      return {
        valid: true,
        discountAmount: Math.min(20, amount),
        code: "FLAT20",
        type: "fixed",
        value: 20,
      }
    case "SUMMER25":
      if (amount < 50) {
        return {
          valid: false,
          message: "Der Mindestbestellwert für diesen Rabattcode beträgt 50,00 €",
        }
      }
      return {
        valid: true,
        discountAmount: amount * 0.25,
        code: "SUMMER25",
        type: "percent",
        value: 25,
      }
    case "WELCOME15":
      // Simuliere einen Rabattcode mit begrenzter Nutzung
      const currentUses = 2
      const maxUses = 3

      if (currentUses >= maxUses) {
        return {
          valid: false,
          message: "Dieser Rabattcode wurde bereits zu oft verwendet",
        }
      }

      return {
        valid: true,
        discountAmount: Math.min(15, amount),
        code: "WELCOME15",
        type: "fixed",
        value: 15,
      }
    case "EXPIRED":
      return {
        valid: false,
        message: "Dieser Rabattcode ist abgelaufen",
      }
    case "INVALID":
      return {
        valid: false,
        message: "Ungültiger Rabattcode",
      }
    default:
      // Simuliere einen unbekannten Rabattcode
      return {
        valid: false,
        message: "Rabattcode nicht gefunden",
      }
  }
}

/**
 * Simuliert die Erhöhung der Verwendungszahl eines Rabattcodes für Testzwecke
 */
export async function simulateIncrementDiscountCodeUsage(code: string): Promise<boolean> {
  // Simuliere eine Netzwerkverzögerung
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Simuliere Erfolg für gültige Testcodes
  const validCodes = ["TEST10", "FLAT20", "SUMMER25", "WELCOME15"]
  return validCodes.includes(code.toUpperCase())
}
