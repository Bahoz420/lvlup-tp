"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Tag } from "lucide-react"
import { validateDiscountCodeAction } from "@/app/checkout/actions"
import { formatPrice } from "@/utils/price-formatter"
import type { DiscountCodeInfo } from "@/types"

interface CartDiscountIntegrationTestProps {
  initialCartItems?: any[]
}

export function CartDiscountIntegrationTest({ initialCartItems = [] }: CartDiscountIntegrationTestProps) {
  const { toast } = useToast()
  const { items, addItem, clearCart, subtotal } = useCart()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [discountInfo, setDiscountInfo] = useState<DiscountCodeInfo | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  // Initialisiere den Warenkorb mit Testprodukten, wenn initialCartItems bereitgestellt werden
  useEffect(() => {
    if (initialCartItems.length > 0) {
      clearCart()
      initialCartItems.forEach((item) => addItem(item))
    }
  }, [initialCartItems, addItem, clearCart])

  // Funktion zum Hinzufügen eines Testergebnisses
  const addTestResult = (result: string) => {
    setTestResults((prev) => [result, ...prev])
  }

  // Funktion zum Validieren eines Rabattcodes
  const validateCode = async (codeToValidate: string) => {
    if (!codeToValidate) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Rabattcode ein",
        variant: "destructive",
      })
      return null
    }

    setIsLoading(true)

    try {
      // Erstelle ein FormData-Objekt für die Server-Action
      const formData = new FormData()
      formData.append("code", codeToValidate)
      formData.append("amount", subtotal.toString())

      // Rufe die Server-Action auf
      const result = await validateDiscountCodeAction(formData)

      if (!result.valid) {
        toast({
          title: "Ungültiger Rabattcode",
          description: result.message || "Der eingegebene Rabattcode ist ungültig",
          variant: "destructive",
        })
        addTestResult(`❌ Rabattcode "${codeToValidate}" ist ungültig: ${result.message}`)
        return null
      }

      // Berechne den Rabattbetrag
      const discountAmount = result.discountAmount || 0

      // Bestimme den Rabatttyp und -wert
      let discountType: "percent" | "fixed" = "fixed"
      let discountValue = discountAmount

      // Wenn der Rabatt ein Prozentsatz ist
      if (result.type === "percent") {
        discountType = "percent"
        discountValue = result.value || 0
      }

      // Erstelle das Rabattinfo-Objekt
      const discountInfo: DiscountCodeInfo = {
        code: codeToValidate,
        discount: discountAmount,
        type: discountType,
        value: discountValue,
      }

      toast({
        title: "Rabattcode angewendet",
        description: `Der Rabattcode "${codeToValidate}" wurde erfolgreich angewendet`,
      })

      addTestResult(
        `✅ Rabattcode "${codeToValidate}" angewendet: ${
          discountType === "percent" ? `${discountValue}%` : formatPrice(discountValue)
        } Rabatt (${formatPrice(discountAmount)})`,
      )

      return discountInfo
    } catch (error) {
      console.error("Error validating discount code:", error)
      toast({
        title: "Fehler",
        description: "Bei der Anwendung des Rabattcodes ist ein Fehler aufgetreten",
        variant: "destructive",
      })
      addTestResult(`❌ Fehler bei der Validierung des Rabattcodes "${codeToValidate}": ${error}`)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Funktion zum Anwenden eines Rabattcodes
  const handleApplyCode = async () => {
    const info = await validateCode(code)
    if (info) {
      setDiscount(info.discount)
      setDiscountInfo(info)
    }
  }

  // Funktion zum Entfernen eines Rabattcodes
  const handleRemoveCode = () => {
    setCode("")
    setDiscount(0)
    setDiscountInfo(null)
    addTestResult("🔄 Rabattcode entfernt")

    toast({
      title: "Rabattcode entfernt",
      description: "Der Rabattcode wurde entfernt",
    })
  }

  // Funktion zum Ausführen automatisierter Tests
  const runAutomatedTests = async () => {
    setIsLoading(true)
    setTestResults([])
    setDiscount(0)
    setDiscountInfo(null)
    setCode("")

    addTestResult("=== Automatisierte Tests gestartet ===")

    // Test 1: Ungültiger Rabattcode
    addTestResult("Test 1: Ungültiger Rabattcode")
    await validateCode("INVALID")

    // Test 2: Gültiger Rabattcode mit Prozentrabatt
    addTestResult("Test 2: Gültiger Rabattcode mit Prozentrabatt")
    const percentCodeResult = await validateCode("TEST10")
    if (percentCodeResult) {
      setDiscount(percentCodeResult.discount)
      setDiscountInfo(percentCodeResult)
      setCode("TEST10")
    }

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Test 3: Rabattcode entfernen
    addTestResult("Test 3: Rabattcode entfernen")
    handleRemoveCode()

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 4: Gültiger Rabattcode mit festem Rabatt
    addTestResult("Test 4: Gültiger Rabattcode mit festem Rabatt")
    const fixedCodeResult = await validateCode("FLAT20")
    if (fixedCodeResult) {
      setDiscount(fixedCodeResult.discount)
      setDiscountInfo(fixedCodeResult)
      setCode("FLAT20")
    }

    // Test 5: Rabattcode mit Mindestbestellwert
    addTestResult("Test 5: Rabattcode mit Mindestbestellwert")
    await validateCode("SUMMER25")

    addTestResult("=== Automatisierte Tests abgeschlossen ===")
    setIsLoading(false)
  }

  // Berechne den Gesamtbetrag nach Rabatt
  const total = Math.max(0, subtotal - discount)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Warenkorb-Übersicht */}
        <Card>
          <CardHeader>
            <CardTitle>Warenkorb-Übersicht</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Dein Warenkorb ist leer.</p>
                <Button
                  className="mt-4"
                  onClick={() => addTestResult("ℹ️ Bitte füge zuerst Produkte zum Warenkorb hinzu")}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Produkte hinzufügen
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.subscription} · {item.quantity}x
                      </p>
                    </div>
                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && discountInfo && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        Rabatt (
                        {discountInfo.type === "percent" ? `${discountInfo.value}%` : formatPrice(discountInfo.value)})
                      </span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Gesamt</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rabattcode-Eingabe */}
        <Card>
          <CardHeader>
            <CardTitle>Rabattcode anwenden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discountInfo ? (
                <div className="border rounded-md p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="font-medium">
                          Rabattcode: <span className="text-green-600">{discountInfo.code}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          {discountInfo.type === "percent"
                            ? `${discountInfo.value}% Rabatt`
                            : `${formatPrice(discountInfo.value)} Rabatt`}{" "}
                          ({formatPrice(discount)})
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRemoveCode}>
                      Entfernen
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="discount-code">Rabattcode</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="discount-code"
                      placeholder="Rabattcode eingeben"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button onClick={handleApplyCode} disabled={isLoading || !code || items.length === 0}>
                      {isLoading ? "Wird geprüft..." : "Anwenden"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gib einen Rabattcode ein, um einen Rabatt auf deinen Warenkorb zu erhalten.
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={runAutomatedTests}
                  disabled={isLoading || items.length === 0}
                  className="w-full"
                >
                  {isLoading ? "Tests laufen..." : "Automatisierte Rabattcode-Tests starten"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-8">
        {/* Testergebnisse */}
        <Card>
          <CardHeader>
            <CardTitle>Testergebnisse</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 h-[400px] overflow-y-auto bg-gray-50">
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center">Keine Testergebnisse vorhanden.</p>
              ) : (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm">
                      {result.includes("===") ? (
                        <p className="font-bold text-purple-700">{result}</p>
                      ) : result.includes("❌") ? (
                        <p className="text-red-600">{result}</p>
                      ) : result.includes("✅") ? (
                        <p className="text-green-600">{result}</p>
                      ) : result.includes("🔄") ? (
                        <p className="text-blue-600">{result}</p>
                      ) : result.includes("ℹ️") ? (
                        <p className="text-amber-600">{result}</p>
                      ) : result.includes("Test") ? (
                        <p className="font-medium">{result}</p>
                      ) : (
                        <p>{result}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verfügbare Testcodes */}
        <Card>
          <CardHeader>
            <CardTitle>Verfügbare Testcodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="border rounded-md p-2 bg-blue-50">
                <p className="font-medium">TEST10</p>
                <p className="text-sm text-gray-600">10% Rabatt auf alle Produkte</p>
              </div>
              <div className="border rounded-md p-2 bg-green-50">
                <p className="font-medium">FLAT20</p>
                <p className="text-sm text-gray-600">20€ Rabatt auf alle Produkte</p>
              </div>
              <div className="border rounded-md p-2 bg-amber-50">
                <p className="font-medium">SUMMER25</p>
                <p className="text-sm text-gray-600">25% Rabatt, Mindestbestellwert 50€</p>
              </div>
              <div className="border rounded-md p-2 bg-purple-50">
                <p className="font-medium">WELCOME15</p>
                <p className="text-sm text-gray-600">15€ Rabatt, maximal 3 Verwendungen</p>
              </div>
              <div className="border rounded-md p-2 bg-red-50">
                <p className="font-medium">EXPIRED</p>
                <p className="text-sm text-gray-600">Abgelaufener Rabattcode</p>
              </div>
              <div className="border rounded-md p-2 bg-gray-50">
                <p className="font-medium">INVALID</p>
                <p className="text-sm text-gray-600">Ungültiger Rabattcode</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testanleitung */}
        <Card>
          <CardHeader>
            <CardTitle>Testanleitung</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-medium">Manuelle Tests:</h3>
                <ol className="list-decimal pl-5 space-y-1 mt-2">
                  <li>Stelle sicher, dass Produkte im Warenkorb sind</li>
                  <li>Gib einen Rabattcode aus der Liste ein</li>
                  <li>Klicke auf "Anwenden"</li>
                  <li>Überprüfe, ob der Rabatt korrekt angewendet wurde</li>
                  <li>Teste das Entfernen des Rabattcodes</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium">Automatisierte Tests:</h3>
                <p className="mt-2">
                  Klicke auf "Automatisierte Rabattcode-Tests starten", um verschiedene Rabattcode-Szenarien automatisch
                  zu testen.
                </p>
              </div>

              <div>
                <h3 className="font-medium">Getestete Funktionen:</h3>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Validierung von Rabattcodes</li>
                  <li>Anwendung von prozentualen Rabatten</li>
                  <li>Anwendung von festen Rabatten</li>
                  <li>Überprüfung des Mindestbestellwerts</li>
                  <li>Entfernen von Rabattcodes</li>
                  <li>Fehlerbehandlung</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
