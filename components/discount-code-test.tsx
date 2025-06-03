"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Check, X, AlertTriangle, Info } from "lucide-react"
import { validateDiscountCodeAction } from "@/app/checkout/actions"
import { formatPrice } from "@/utils/price-formatter"
import type { DiscountCodeValidationResult } from "@/types"

// Testdaten für Rabattcodes
const testDiscountCodes = [
  { code: "TEST10", description: "10% Rabatt auf alle Produkte", type: "percent", value: 10 },
  { code: "FLAT20", description: "20€ Rabatt auf alle Produkte", type: "fixed", value: 20 },
  { code: "SUMMER25", description: "25% Rabatt, Mindestbestellwert 50€", type: "percent", value: 25, minPurchase: 50 },
  { code: "WELCOME15", description: "15€ Rabatt, maximal 3 Verwendungen", type: "fixed", value: 15, maxUses: 3 },
  { code: "EXPIRED", description: "Abgelaufener Rabattcode", type: "percent", value: 30, expired: true },
  { code: "INVALID", description: "Ungültiger Rabattcode", type: "invalid" },
]

interface DiscountCodeTestProps {
  orderAmount?: number
}

export function DiscountCodeTest({ orderAmount = 100 }: DiscountCodeTestProps) {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [amount, setAmount] = useState(orderAmount)
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<Array<{ code: string; result: DiscountCodeValidationResult | null }>>(
    [],
  )
  const [manualTestResult, setManualTestResult] = useState<DiscountCodeValidationResult | null>(null)

  // Funktion zum Validieren eines Rabattcodes
  const validateCode = async (codeToValidate: string, orderAmount: number) => {
    setIsLoading(true)

    try {
      // Erstelle ein FormData-Objekt für die Server-Action
      const formData = new FormData()
      formData.append("code", codeToValidate)
      formData.append("amount", orderAmount.toString())

      // Rufe die Server-Action auf
      const result = await validateDiscountCodeAction(formData)
      return result
    } catch (error) {
      console.error("Error validating discount code:", error)
      return {
        valid: false,
        message: "Bei der Überprüfung des Rabattcodes ist ein Fehler aufgetreten",
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Funktion zum manuellen Testen eines Rabattcodes
  const handleManualTest = async () => {
    if (!code) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Rabattcode ein",
        variant: "destructive",
      })
      return
    }

    const result = await validateCode(code, amount)
    setManualTestResult(result)

    if (result.valid) {
      toast({
        title: "Rabattcode gültig",
        description: `Der Rabattcode "${code}" wurde erfolgreich angewendet`,
      })
    } else {
      toast({
        title: "Ungültiger Rabattcode",
        description: result.message || "Der eingegebene Rabattcode ist ungültig",
        variant: "destructive",
      })
    }
  }

  // Funktion zum Ausführen automatisierter Tests
  const runAutomatedTests = async () => {
    setIsLoading(true)
    setTestResults([])

    const results = []

    // Teste jeden Rabattcode aus der Testliste
    for (const testCode of testDiscountCodes) {
      const result = await validateCode(testCode.code, testCode.minPurchase ? testCode.minPurchase - 1 : amount)
      results.push({ code: testCode.code, result })
    }

    // Teste einen Rabattcode mit Mindestbestellwert, aber mit ausreichendem Bestellbetrag
    const summerCodeWithSufficientAmount = await validateCode("SUMMER25", 100)
    results.push({ code: "SUMMER25 (mit ausreichendem Bestellbetrag)", result: summerCodeWithSufficientAmount })

    setTestResults(results)
    setIsLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Manueller Test */}
        <Card>
          <CardHeader>
            <CardTitle>Manueller Rabattcode-Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="discount-code">Rabattcode</Label>
                <Input
                  id="discount-code"
                  placeholder="Rabattcode eingeben"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Gib einen Rabattcode ein, um seine Gültigkeit zu überprüfen.
                </p>
              </div>

              <div>
                <Label htmlFor="order-amount">Bestellbetrag (€)</Label>
                <Input
                  id="order-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number.parseFloat(e.target.value) || 0)}
                  className="mb-2"
                />
                <p className="text-sm text-muted-foreground">
                  Gib einen Bestellbetrag ein, um Rabattcodes mit Mindestbestellwert zu testen.
                </p>
              </div>

              <Button onClick={handleManualTest} disabled={isLoading || !code}>
                {isLoading ? "Wird geprüft..." : "Rabattcode prüfen"}
              </Button>

              {manualTestResult && (
                <div className="mt-4 p-4 border rounded-md bg-gray-50">
                  <h3 className="font-medium mb-2">Testergebnis:</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="font-medium w-24">Status:</span>
                      {manualTestResult.valid ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                          <Check className="h-3 w-3 mr-1" /> Gültig
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                          <X className="h-3 w-3 mr-1" /> Ungültig
                        </Badge>
                      )}
                    </div>
                    {manualTestResult.message && (
                      <div className="flex items-start">
                        <span className="font-medium w-24">Nachricht:</span>
                        <span>{manualTestResult.message}</span>
                      </div>
                    )}
                    {manualTestResult.valid && manualTestResult.discountAmount !== undefined && (
                      <>
                        <div className="flex items-start">
                          <span className="font-medium w-24">Rabatt:</span>
                          <span>{formatPrice(manualTestResult.discountAmount)}</span>
                        </div>
                        <div className="flex items-start">
                          <span className="font-medium w-24">Typ:</span>
                          <span>
                            {manualTestResult.type === "percent"
                              ? `Prozentual (${manualTestResult.value}%)`
                              : `Fest (${formatPrice(manualTestResult.value || 0)})`}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Automatisierte Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Automatisierte Rabattcode-Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runAutomatedTests} disabled={isLoading} className="mb-4">
              {isLoading ? "Tests laufen..." : "Automatisierte Tests starten"}
            </Button>

            {testResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Testergebnisse:</h3>
                <div className="border rounded-md divide-y">
                  {testResults.map((test, index) => (
                    <div key={index} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{test.code}</span>
                        {test.result?.valid ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                            <Check className="h-3 w-3 mr-1" /> Gültig
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                            <X className="h-3 w-3 mr-1" /> Ungültig
                          </Badge>
                        )}
                      </div>
                      {test.result?.message && <p className="text-sm text-gray-600">{test.result.message}</p>}
                      {test.result?.valid && test.result.discountAmount !== undefined && (
                        <p className="text-sm text-gray-600">
                          Rabatt: {formatPrice(test.result.discountAmount)} (
                          {test.result.type === "percent"
                            ? `${test.result.value}%`
                            : formatPrice(test.result.value || 0)}
                          )
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-8">
        {/* Verfügbare Testcodes */}
        <Card>
          <CardHeader>
            <CardTitle>Verfügbare Testcodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testDiscountCodes.map((discountCode, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{discountCode.code}</span>
                    {discountCode.type === "percent" ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {discountCode.value}%
                      </Badge>
                    ) : discountCode.type === "fixed" ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {formatPrice(discountCode.value)}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Ungültig
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{discountCode.description}</p>
                  {(discountCode.minPurchase || discountCode.maxUses || discountCode.expired) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {discountCode.minPurchase && (
                        <Badge variant="outline" className="text-xs">
                          Min. {formatPrice(discountCode.minPurchase)}
                        </Badge>
                      )}
                      {discountCode.maxUses && (
                        <Badge variant="outline" className="text-xs">
                          Max. {discountCode.maxUses}x
                        </Badge>
                      )}
                      {discountCode.expired && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                          Abgelaufen
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
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
                  <li>Gib einen Rabattcode aus der Liste ein</li>
                  <li>Passe den Bestellbetrag an (für Codes mit Mindestbestellwert)</li>
                  <li>Klicke auf "Rabattcode prüfen"</li>
                  <li>Überprüfe das Ergebnis der Validierung</li>
                </ol>
              </div>

              <div>
                <h3 className="font-medium">Automatisierte Tests:</h3>
                <p className="mt-2">
                  Klicke auf "Automatisierte Tests starten", um alle Testcodes automatisch zu validieren und die
                  Ergebnisse anzuzeigen.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Hinweise:</h3>
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5" />
                  <p>
                    Einige Testcodes sind absichtlich ungültig oder haben Einschränkungen, um verschiedene Szenarien zu
                    testen.
                  </p>
                </div>
                <div className="flex items-start">
                  <Info className="h-4 w-4 text-blue-500 mr-2 mt-0.5" />
                  <p>
                    Die tatsächlichen Rabattcodes werden in der Datenbank gespeichert und über Server-Actions validiert.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
