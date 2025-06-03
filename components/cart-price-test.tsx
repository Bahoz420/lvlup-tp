"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check, AlertCircle, Calculator } from "lucide-react"
import { formatPrice } from "@/utils/price-formatter"
import type { CartItem, SubscriptionType } from "@/contexts/cart-context"

// Testprodukte für die Preisberechnung
const priceTestProducts = [
  {
    id: "price-test-1",
    name: "Basis-Produkt",
    slug: "price-test-1",
    price: 10.0,
    image_url: "/placeholder.svg",
    quantity: 1,
    subscription: "month" as SubscriptionType,
  },
  {
    id: "price-test-2",
    name: "Premium-Produkt",
    slug: "price-test-2",
    price: 25.5,
    image_url: "/placeholder.svg",
    quantity: 2,
    subscription: "week" as SubscriptionType,
  },
  {
    id: "price-test-3",
    name: "Lifetime-Produkt",
    slug: "price-test-3",
    price: 99.99,
    image_url: "/placeholder.svg",
    quantity: 1,
    subscription: "lifetime" as SubscriptionType,
  },
]

export function CartPriceTest() {
  const { items, addItem, clearCart, subtotal } = useCart()
  const [testResults, setTestResults] = useState<
    Array<{ description: string; expected: number; actual: number; match: boolean }>
  >([])
  const [isTestRunning, setIsTestRunning] = useState(false)

  // Funktion zum Testen der Preisberechnung
  const testPriceCalculation = async () => {
    setIsTestRunning(true)
    setTestResults([])

    // Warenkorb leeren und Testprodukte hinzufügen
    clearCart()

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Test 1: Einzelnes Produkt
    const product1 = priceTestProducts[0]
    addItem(product1)

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Überprüfe den Preis für ein einzelnes Produkt
    const expectedPrice1 = product1.price * product1.quantity
    const actualPrice1 = subtotal
    setTestResults((prev) => [
      ...prev,
      {
        description: `Einzelnes Produkt (${product1.name})`,
        expected: expectedPrice1,
        actual: actualPrice1,
        match: Math.abs(expectedPrice1 - actualPrice1) < 0.01,
      },
    ])

    // Test 2: Mehrere Produkte
    const product2 = priceTestProducts[1]
    addItem(product2)

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Überprüfe den Preis für mehrere Produkte
    const expectedPrice2 = product1.price * product1.quantity + product2.price * product2.quantity
    const actualPrice2 = subtotal
    setTestResults((prev) => [
      ...prev,
      {
        description: `Mehrere Produkte (${product1.name}, ${product2.name})`,
        expected: expectedPrice2,
        actual: actualPrice2,
        match: Math.abs(expectedPrice2 - actualPrice2) < 0.01,
      },
    ])

    // Test 3: Produkt mit hohem Preis
    const product3 = priceTestProducts[2]
    addItem(product3)

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Überprüfe den Preis für alle Produkte
    const expectedPrice3 =
      product1.price * product1.quantity + product2.price * product2.quantity + product3.price * product3.quantity
    const actualPrice3 = subtotal
    setTestResults((prev) => [
      ...prev,
      {
        description: `Alle Produkte (${product1.name}, ${product2.name}, ${product3.name})`,
        expected: expectedPrice3,
        actual: actualPrice3,
        match: Math.abs(expectedPrice3 - actualPrice3) < 0.01,
      },
    ])

    // Test 4: Manuelle Berechnung
    const manualSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    setTestResults((prev) => [
      ...prev,
      {
        description: "Manuelle Berechnung vs. Warenkorb-Subtotal",
        expected: manualSubtotal,
        actual: subtotal,
        match: Math.abs(manualSubtotal - subtotal) < 0.01,
      },
    ])

    // Test 5: Rundungsfehler-Test
    const product4: CartItem = {
      id: "price-test-4",
      name: "Rundungstest-Produkt",
      slug: "price-test-4",
      price: 0.33,
      image_url: "/placeholder.svg",
      quantity: 3,
      subscription: "day",
    }

    clearCart()
    addItem(product4)

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Überprüfe auf Rundungsfehler
    const expectedPrice4 = 0.99 // 0.33 * 3
    const actualPrice4 = subtotal
    setTestResults((prev) => [
      ...prev,
      {
        description: "Rundungsfehler-Test (0.33 × 3)",
        expected: expectedPrice4,
        actual: actualPrice4,
        match: Math.abs(expectedPrice4 - actualPrice4) < 0.01,
      },
    ])

    setIsTestRunning(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warenkorb-Preisberechnung-Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={testPriceCalculation} className="flex-1" disabled={isTestRunning}>
              {isTestRunning ? (
                <>
                  <Calculator className="mr-2 h-4 w-4 animate-pulse" />
                  Berechnung läuft...
                </>
              ) : (
                "Preisberechnung testen"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearCart()
                setTestResults([])
              }}
              disabled={testResults.length === 0}
            >
              Zurücksetzen
            </Button>
          </div>

          {testResults.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead className="text-right">Erwartet</TableHead>
                  <TableHead className="text-right">Tatsächlich</TableHead>
                  <TableHead className="text-center">Ergebnis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.description}</TableCell>
                    <TableCell className="text-right">{formatPrice(result.expected)}</TableCell>
                    <TableCell className="text-right">{formatPrice(result.actual)}</TableCell>
                    <TableCell className="text-center">
                      {result.match ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="text-sm text-gray-500">
            <p>
              Dieser Test überprüft die korrekte Berechnung der Preise im Warenkorb. Es werden verschiedene Szenarien
              getestet, um sicherzustellen, dass die Preisberechnung korrekt funktioniert.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
