"use client"

import { useState } from "react"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { ShoppingCart, Plus, Minus, Trash2, Check, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice, calculateSubscriptionPrice } from "@/utils/price-formatter"
import { CartPersistenceTest } from "@/components/cart-persistence-test"
import { CartPriceTest } from "@/components/cart-price-test"
import { DiscountCodeTest } from "@/components/discount-code-test"
import { CartDiscountIntegrationTest } from "@/components/cart-discount-integration-test"
import type { CartItem, SubscriptionType } from "@/contexts/cart-context"

// Testprodukte mit neuen Preisen
const testProducts = [
  {
    id: "lvlup-cs2-cheat",
    name: "CS2 lvlup Cheat",
    slug: "cs2",
    description: "Premium CS2 Cheat mit Aimbot, Wallhack und mehr",
    image_url: "/cs2.png",
  },
  {
    id: "lvlup-fortnite-cheat",
    name: "Fortnite lvlup Cheat",
    slug: "fortnite",
    description: "Premium Fortnite Cheat mit Aimbot, ESP und Radar-Funktionen",
    image_url: "/fortnite-star-wars.jpg",
  },
  {
    id: "lvlup-valorant-cheat",
    name: "Valorant lvlup Cheat",
    slug: "valorant",
    description: "Unentdeckbarer Valorant Cheat mit präzisem Aimbot und Wallhack",
    image_url: "/valorant.png",
  },
  {
    id: "lvlup-warzone-cheat",
    name: "Warzone lvlup Cheat",
    slug: "warzone",
    description: "Fortschrittlicher Warzone Cheat mit Aimbot und ESP",
    image_url: "/warzone.png",
  },
]

// Abonnementtypen für Tests
const subscriptionTypes: SubscriptionType[] = ["day", "week", "month", "lifetime"]

// Hilfsfunktion zum Konvertieren von Abonnement-Bezeichnungen
function getSubscriptionLabel(subscription: SubscriptionType): string {
  switch (subscription) {
    case "day":
      return "3 Tage"
    case "week":
      return "1 Woche"
    case "month":
      return "1 Monat"
    case "lifetime":
      return "Lifetime"
    default:
      return subscription
  }
}

// Erstelle Testprodukte für den Warenkorb
const createTestCartItems = (): CartItem[] => {
  return [
    {
      id: testProducts[0].id,
      name: testProducts[0].name,
      slug: testProducts[0].slug,
      price: calculateSubscriptionPrice("cs2", "month"),
      image_url: testProducts[0].image_url,
      quantity: 1,
      subscription: "month",
    },
    {
      id: testProducts[1].id,
      name: testProducts[1].name,
      slug: testProducts[1].slug,
      price: calculateSubscriptionPrice("fortnite", "week"),
      image_url: testProducts[1].image_url,
      quantity: 2,
      subscription: "week",
    },
  ]
}

export default function CartTestPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal } = useCart()
  const [testResults, setTestResults] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState(testProducts[0])
  const [selectedSubscription, setSelectedSubscription] = useState<SubscriptionType>("month")
  const [quantity, setQuantity] = useState(1)
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [activeTab, setActiveTab] = useState("manual")

  // Funktion zum Hinzufügen eines Produkts zum Warenkorb
  const handleAddToCart = () => {
    const price = calculateSubscriptionPrice(selectedProduct.slug, selectedSubscription)

    const cartItem: CartItem = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      slug: selectedProduct.slug,
      price: price,
      image_url: selectedProduct.image_url,
      quantity: quantity,
      subscription: selectedSubscription,
    }

    addItem(cartItem)

    addTestResult(
      `Produkt hinzugefügt: ${selectedProduct.name} (${getSubscriptionLabel(selectedSubscription)}) - ${quantity}x - ${formatPrice(price * quantity)}`,
    )
  }

  // Funktion zum Hinzufügen eines Testergebnisses
  const addTestResult = (result: string) => {
    setTestResults((prev) => [result, ...prev])
  }

  // Funktion zum Ausführen automatisierter Tests
  const runAutomatedTests = async () => {
    setIsTestRunning(true)
    clearCart()
    setTestResults([])

    addTestResult("=== Automatisierte Tests gestartet ===")

    // Test 1: Warenkorb leeren
    clearCart()
    addTestResult("Test 1: Warenkorb geleert")

    // Test 2: Ein Produkt hinzufügen
    const product1 = testProducts[0]
    const subscription1: SubscriptionType = "month"
    const price1 = calculateSubscriptionPrice(product1.slug, subscription1)

    addItem({
      id: product1.id,
      name: product1.name,
      slug: product1.slug,
      price: price1,
      image_url: product1.image_url,
      quantity: 1,
      subscription: subscription1,
    })

    addTestResult(
      `Test 2: Produkt hinzugefügt - ${product1.name} (${getSubscriptionLabel(subscription1)}) - ${formatPrice(price1)}`,
    )

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 3: Menge eines Produkts ändern
    const productToUpdate = items[0]
    if (productToUpdate) {
      updateQuantity(productToUpdate.id, productToUpdate.subscription, 3)
      addTestResult(`Test 3: Produktmenge aktualisiert - ${productToUpdate.name} - Neue Menge: 3`)
    }

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 4: Mehrere Produkte mit verschiedenen Abonnements hinzufügen
    for (let i = 1; i < testProducts.length; i++) {
      const product = testProducts[i]
      const subscription: SubscriptionType = subscriptionTypes[i % subscriptionTypes.length]
      const price = calculateSubscriptionPrice(product.slug, subscription)

      addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: price,
        image_url: product.image_url,
        quantity: 1,
        subscription: subscription,
      })

      addTestResult(
        `Test 4.${i}: Produkt hinzugefügt - ${product.name} (${getSubscriptionLabel(subscription)}) - ${formatPrice(price)}`,
      )

      // Kurze Pause für die Benutzeroberfläche
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    // Test 5: Gleiches Produkt mit anderem Abonnement hinzufügen
    const product5 = testProducts[0]
    const subscription5: SubscriptionType = "lifetime"
    const price5 = calculateSubscriptionPrice(product5.slug, subscription5)

    addItem({
      id: product5.id,
      name: product5.name,
      slug: product5.slug,
      price: price5,
      image_url: product5.image_url,
      quantity: 1,
      subscription: subscription5,
    })

    addTestResult(
      `Test 5: Gleiches Produkt mit anderem Abonnement - ${product5.name} (${getSubscriptionLabel(subscription5)}) - ${formatPrice(price5)}`,
    )

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Test 6: Ein Produkt entfernen
    if (items.length > 0) {
      const productToRemove = items[items.length - 1]
      removeItem(productToRemove.id, productToRemove.subscription)
      addTestResult(
        `Test 6: Produkt entfernt - ${productToRemove.name} (${getSubscriptionLabel(productToRemove.subscription)})`,
      )
    }

    // Test 7: Warenkorb-Persistenz testen
    addTestResult("Test 7: Warenkorb-Persistenz - Speichern des aktuellen Warenkorbs")

    // Simuliere einen Seitenneuladen durch Speichern und Laden des Warenkorbs
    const savedCart = JSON.stringify(items)
    localStorage.setItem("cart-test", savedCart)

    // Kurze Pause für die Benutzeroberfläche
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Laden des gespeicherten Warenkorbs
    const loadedCart = localStorage.getItem("cart-test")
    if (loadedCart) {
      const parsedCart = JSON.parse(loadedCart)
      addTestResult(`Test 7: Warenkorb-Persistenz - Erfolgreich geladen mit ${parsedCart.length} Produkten`)
    }

    // Test 8: Preisberechnung überprüfen
    const calculatedSubtotal = items.reduce((total, item) => total + item.price * item.quantity, 0)
    const subtotalMatch = Math.abs(calculatedSubtotal - subtotal) < 0.01

    addTestResult(`Test 8: Preisberechnung - Berechneter Gesamtpreis: ${formatPrice(calculatedSubtotal)}`)
    addTestResult(`Test 8: Preisberechnung - Warenkorb-Gesamtpreis: ${formatPrice(subtotal)}`)
    addTestResult(`Test 8: Preisberechnung - ${subtotalMatch ? "✅ Übereinstimmung" : "❌ Keine Übereinstimmung"}`)

    addTestResult("=== Automatisierte Tests abgeschlossen ===")
    setIsTestRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100">
      <Navigation />
      <main className="container py-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-4">Warenkorb-Funktionalitätstest</h1>
        <p className="text-purple-700 mb-8">
          Diese Seite ermöglicht das Testen der Warenkorb-Funktionalität mit verschiedenen Produkten und Szenarien.
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="manual">Manueller Test</TabsTrigger>
            <TabsTrigger value="persistence">Persistenz-Test</TabsTrigger>
            <TabsTrigger value="price">Preisberechnungs-Test</TabsTrigger>
            <TabsTrigger value="discount">Rabattcode-Test</TabsTrigger>
            <TabsTrigger value="integration">Rabattcode-Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Produktauswahl */}
                <Card>
                  <CardHeader>
                    <CardTitle>Produkt zum Warenkorb hinzufügen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Produkt auswählen</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {testProducts.map((product) => (
                            <div
                              key={product.id}
                              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                                selectedProduct.id === product.id
                                  ? "border-purple-500 bg-purple-50"
                                  : "border-gray-200 hover:border-purple-300"
                              }`}
                              onClick={() => setSelectedProduct(product)}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="relative w-12 h-12 flex-shrink-0">
                                  <Image
                                    src={product.image_url || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">{product.name}</h4>
                                  <p className="text-sm text-gray-500">{formatPrice(19.99)}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Abonnement auswählen</h3>
                        <Tabs
                          defaultValue="month"
                          value={selectedSubscription}
                          onValueChange={(value) => setSelectedSubscription(value as SubscriptionType)}
                          className="w-full"
                        >
                          <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="day">3 Tage</TabsTrigger>
                            <TabsTrigger value="week">1 Woche</TabsTrigger>
                            <TabsTrigger value="month">1 Monat</TabsTrigger>
                            <TabsTrigger value="lifetime">Lifetime</TabsTrigger>
                          </TabsList>
                          <div className="p-4 border rounded-md">
                            <div className="flex items-baseline justify-between">
                              <div>
                                <span className="text-2xl font-bold text-purple-900">
                                  {formatPrice(calculateSubscriptionPrice(selectedProduct.slug, selectedSubscription))}
                                </span>
                                <span className="text-sm text-purple-600 ml-2">
                                  / {getSubscriptionLabel(selectedSubscription)} Zugang
                                </span>
                              </div>
                              <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                                {selectedSubscription === "lifetime" ? "Bester Wert" : "Beliebt"}
                              </Badge>
                            </div>
                          </div>
                        </Tabs>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Menge</h3>
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <Button onClick={handleAddToCart} className="w-full">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Zum Warenkorb hinzufügen
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Warenkorb-Inhalt */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Warenkorb-Inhalt</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {itemCount} {itemCount === 1 ? "Artikel" : "Artikel"}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={clearCart} disabled={items.length === 0}>
                          Warenkorb leeren
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {items.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Dein Warenkorb ist leer.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div
                            key={`${item.id}-${item.subscription}`}
                            className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                  src={item.image_url || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-500">
                                  {getSubscriptionLabel(item.subscription)} · {formatPrice(item.price)}
                                </p>
                                <div className="flex items-center mt-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.id, item.subscription, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="mx-2 text-sm">{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => updateQuantity(item.id, item.subscription, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700 mt-2"
                                onClick={() => removeItem(item.id, item.subscription)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="pt-4 flex justify-between font-medium">
                          <span>Gesamtsumme:</span>
                          <span>{formatPrice(subtotal)}</span>
                        </div>

                        <div className="pt-4 flex justify-end">
                          <Link href="/cart">
                            <Button>
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Zum Warenkorb
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-8">
                {/* Automatisierte Tests */}
                <Card>
                  <CardHeader>
                    <CardTitle>Automatisierte Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={runAutomatedTests} className="w-full mb-4" disabled={isTestRunning}>
                      {isTestRunning ? "Tests laufen..." : "Automatisierte Tests starten"}
                    </Button>

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
                                <p className="text-red-600 flex items-start">
                                  <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{result}</span>
                                </p>
                              ) : result.includes("✅") ? (
                                <p className="text-green-600 flex items-start">
                                  <Check className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                                  <span>{result}</span>
                                </p>
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
                          <li>Wähle ein Produkt aus der Liste</li>
                          <li>Wähle einen Abonnementtyp</li>
                          <li>Stelle die gewünschte Menge ein</li>
                          <li>Klicke auf "Zum Warenkorb hinzufügen"</li>
                          <li>Überprüfe, ob das Produkt korrekt im Warenkorb erscheint</li>
                          <li>Teste die Änderung der Menge und das Entfernen von Produkten</li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-medium">Automatisierte Tests:</h3>
                        <p className="mt-2">
                          Klicke auf "Automatisierte Tests starten", um eine Reihe von Tests durchzuführen, die
                          verschiedene Aspekte der Warenkorb-Funktionalität überprüfen.
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium">Getestete Funktionen:</h3>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                          <li>Hinzufügen von Produkten zum Warenkorb</li>
                          <li>Ändern der Produktmenge</li>
                          <li>Entfernen von Produkten</li>
                          <li>Verschiedene Abonnementtypen</li>
                          <li>Preisberechnung</li>
                          <li>Warenkorb-Persistenz</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="persistence">
            <CartPersistenceTest />
          </TabsContent>

          <TabsContent value="price">
            <CartPriceTest />
          </TabsContent>

          <TabsContent value="discount">
            <DiscountCodeTest />
          </TabsContent>

          <TabsContent value="integration">
            <CartDiscountIntegrationTest initialCartItems={createTestCartItems()} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
