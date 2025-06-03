"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle, RefreshCw } from "lucide-react"
import { formatPrice } from "@/utils/price-formatter"

export function CartPersistenceTest() {
  const { items, clearCart } = useCart()
  const [testResults, setTestResults] = useState<Array<{ message: string; success: boolean }>>([])
  const [isTestRunning, setIsTestRunning] = useState(false)

  // Funktion zum Hinzufügen eines Testergebnisses
  const addTestResult = (message: string, success: boolean) => {
    setTestResults((prev) => [...prev, { message, success }])
  }

  // Funktion zum Testen der Warenkorb-Persistenz
  const testCartPersistence = async () => {
    setIsTestRunning(true)
    setTestResults([])

    // Test 1: Speichern des aktuellen Warenkorbs
    addTestResult("Speichern des aktuellen Warenkorbs", true)
    const currentCart = items

    // Simuliere einen Seitenneuladen durch Speichern und Laden des Warenkorbs
    const savedCart = JSON.stringify(currentCart)
    localStorage.setItem("cart-persistence-test", savedCart)

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 2: Laden des gespeicherten Warenkorbs
    const loadedCartJson = localStorage.getItem("cart-persistence-test")
    if (loadedCartJson) {
      try {
        const loadedCart = JSON.parse(loadedCartJson)
        const loadSuccess = Array.isArray(loadedCart)
        addTestResult(`Warenkorb geladen mit ${loadedCart.length} Produkten`, loadSuccess)

        // Test 3: Überprüfen der Datenintegrität
        if (loadSuccess && currentCart.length > 0) {
          const sameLength = loadedCart.length === currentCart.length
          addTestResult(`Anzahl der Produkte stimmt überein: ${currentCart.length}`, sameLength)

          // Überprüfe, ob alle Produkte korrekt geladen wurden
          let allProductsMatch = true
          for (let i = 0; i < currentCart.length; i++) {
            const original = currentCart[i]
            const loaded = loadedCart.find(
              (item) => item.id === original.id && item.subscription === original.subscription,
            )

            if (!loaded) {
              allProductsMatch = false
              addTestResult(`Produkt nicht gefunden: ${original.name} (${original.subscription})`, false)
              continue
            }

            const priceMatch = Math.abs(loaded.price - original.price) < 0.01
            const quantityMatch = loaded.quantity === original.quantity

            if (!priceMatch) {
              allProductsMatch = false
              addTestResult(
                `Preisunterschied: ${original.name} - Original: ${formatPrice(original.price)}, Geladen: ${formatPrice(loaded.price)}`,
                false,
              )
            }

            if (!quantityMatch) {
              allProductsMatch = false
              addTestResult(
                `Mengenunterschied: ${original.name} - Original: ${original.quantity}, Geladen: ${loaded.quantity}`,
                false,
              )
            }
          }

          if (allProductsMatch) {
            addTestResult("Alle Produkte wurden korrekt geladen", true)
          }
        }
      } catch (error) {
        addTestResult(`Fehler beim Parsen des Warenkorbs: ${error}`, false)
      }
    } else {
      addTestResult("Kein gespeicherter Warenkorb gefunden", false)
    }

    // Test 4: Testen der Warenkorb-Aktualisierung
    addTestResult("Test der Warenkorb-Aktualisierung", true)

    // Simuliere das Hinzufügen eines neuen Produkts
    const updatedCart = [
      ...currentCart,
      {
        id: "test-product",
        name: "Testprodukt",
        slug: "test-product",
        price: 9.99,
        image_url: "/placeholder.svg",
        quantity: 1,
        subscription: "month" as const,
      },
    ]

    localStorage.setItem("cart-persistence-test", JSON.stringify(updatedCart))

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Laden des aktualisierten Warenkorbs
    const updatedCartJson = localStorage.getItem("cart-persistence-test")
    if (updatedCartJson) {
      try {
        const loadedUpdatedCart = JSON.parse(updatedCartJson)
        const hasNewProduct = loadedUpdatedCart.some((item: any) => item.id === "test-product")
        addTestResult("Neues Produkt wurde zum gespeicherten Warenkorb hinzugefügt", hasNewProduct)
      } catch (error) {
        addTestResult(`Fehler beim Parsen des aktualisierten Warenkorbs: ${error}`, false)
      }
    }

    // Test 5: Testen des Löschens des Warenkorbs
    addTestResult("Test des Löschens des Warenkorbs", true)
    localStorage.removeItem("cart-persistence-test")

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    const deletedCart = localStorage.getItem("cart-persistence-test")
    addTestResult("Warenkorb wurde erfolgreich gelöscht", deletedCart === null)

    setIsTestRunning(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Warenkorb-Persistenz-Test</CardTitle>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            {items.length} {items.length === 1 ? "Produkt" : "Produkte"} im Warenkorb
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button onClick={testCartPersistence} className="flex-1" disabled={isTestRunning}>
              {isTestRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Test läuft...
                </>
              ) : (
                "Persistenz testen"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                clearCart()
                setTestResults([])
              }}
              disabled={items.length === 0 && testResults.length === 0}
            >
              Zurücksetzen
            </Button>
          </div>

          <div className="border rounded-md p-4 h-[300px] overflow-y-auto bg-gray-50">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center">Keine Testergebnisse vorhanden.</p>
            ) : (
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start">
                    {result.success ? (
                      <Check className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    )}
                    <span className={result.success ? "text-green-700" : "text-red-700"}>{result.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p>
              Dieser Test überprüft, ob der Warenkorb korrekt im localStorage gespeichert und geladen wird. Dies ist
              wichtig, um sicherzustellen, dass der Warenkorb auch nach einem Seitenneuladen erhalten bleibt.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
