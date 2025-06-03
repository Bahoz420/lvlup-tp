"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "@/components/ui/use-toast"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  type DiscountCode,
  createDiscountCode,
  getDiscountCodeById,
  updateDiscountCode,
} from "@/data/mock-discount-codes"

interface DiscountCodeFormProps {
  discountCodeId?: string
}

export function DiscountCodeForm({ discountCodeId }: DiscountCodeFormProps) {
  const router = useRouter()
  const isEditing = !!discountCodeId
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Form state
  const [code, setCode] = useState("")
  const [description, setDescription] = useState("")
  const [dbDiscountType, setDbDiscountType] = useState<"percentage" | "fixed_amount">("percentage")
  const [dbDiscountValue, setDbDiscountValue] = useState<number | null>(10)
  const [minimum_amount, setMinimumAmount] = useState<number | null>(null)
  const [maximumUses, setMaximumUses] = useState<number | null>(null)
  const [currentUses, setCurrentUses] = useState(0)
  const [isActive, setIsActive] = useState(true)
  const [expiresAt, setExpiresAt] = useState<Date | null>(null)

  // Lade Rabattcode-Daten, wenn im Bearbeitungsmodus
  useEffect(() => {
    if (isEditing && discountCodeId) {
      setLoading(true)

      // In einer echten Anwendung würden wir hier eine API-Anfrage stellen
      const discountCodeDataFromDb = getDiscountCodeById(discountCodeId)

      if (discountCodeDataFromDb) {
        setCode(discountCodeDataFromDb.code)
        setDescription(discountCodeDataFromDb.description || "")
        setDbDiscountType(discountCodeDataFromDb.discount_type as "percentage" | "fixed_amount")
        setDbDiscountValue(discountCodeDataFromDb.discount_value)
        setMinimumAmount(discountCodeDataFromDb.minimum_amount)
        setMaximumUses(discountCodeDataFromDb.maximum_uses)
        setCurrentUses(discountCodeDataFromDb.current_uses)
        setIsActive(discountCodeDataFromDb.is_active)
        setExpiresAt(discountCodeDataFromDb.expires_at ? new Date(discountCodeDataFromDb.expires_at) : null)
      } else {
        toast({
          title: "Fehler",
          description: "Rabattcode nicht gefunden.",
          variant: "destructive",
        })
        router.push("/admin/discount-codes")
      }

      setLoading(false)
    }
  }, [isEditing, discountCodeId, router])

  // Generiere einen zufälligen Code
  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCode(result)
  }

  // Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validierung
      if (!code) {
        toast({
          title: "Fehler",
          description: "Bitte geben Sie einen Code ein.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      if (dbDiscountValue === null || dbDiscountValue <= 0) {
        toast({
          title: "Fehler",
          description: "Bitte geben Sie einen gültigen Rabattwert ein.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Erstelle Rabattcode-Objekt
      const discountCodeData: Partial<DiscountCode> = {
        code: code.toUpperCase(),
        description,
        discount_type: dbDiscountType,
        discount_value: dbDiscountValue,
        minimum_amount: minimum_amount,
        maximum_uses: maximumUses,
        current_uses: currentUses,
        is_active: isActive,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
      }

      // In einer echten Anwendung würden wir hier eine API-Anfrage stellen
      if (isEditing && discountCodeId) {
        updateDiscountCode(discountCodeId, discountCodeData)
        toast({
          title: "Erfolg",
          description: "Rabattcode wurde erfolgreich aktualisiert.",
        })
      } else {
        createDiscountCode(discountCodeData as Omit<DiscountCode, "id" | "created_at">)
        toast({
          title: "Erfolg",
          description: "Rabattcode wurde erfolgreich erstellt.",
        })
      }

      // Zurück zur Übersicht
      router.push("/admin/discount-codes")
    } catch (error) {
      console.error("Error saving discount code:", error)
      toast({
        title: "Fehler",
        description: "Beim Speichern des Rabattcodes ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rabattcode wird geladen...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Grundeinstellungen</TabsTrigger>
          <TabsTrigger value="usage">Nutzung & Gültigkeit</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Grundeinstellungen</CardTitle>
              <CardDescription>Legen Sie die grundlegenden Informationen für den Rabattcode fest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Rabattcode</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="z.B. SUMMER20"
                      className="uppercase"
                    />
                    <Button type="button" variant="outline" onClick={generateRandomCode}>
                      Generieren
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="is_active">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      {isActive ? "Aktiv" : "Inaktiv"}
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Beschreiben Sie den Zweck dieses Rabattcodes"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Rabatttyp</Label>
                <RadioGroup
                  value={dbDiscountType}
                  onValueChange={(value) => setDbDiscountType(value as "percentage" | "fixed_amount")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="percentage" id="percent" />
                    <Label htmlFor="percent" className="cursor-pointer">
                      Prozentualer Rabatt (%)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fixed_amount" id="fixed" />
                    <Label htmlFor="fixed" className="cursor-pointer">
                      Fester Betrag (€)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_value">Discount Value</Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={dbDiscountValue !== null ? dbDiscountValue : ""}
                  onChange={(e) => setDbDiscountValue(e.target.value ? Number(e.target.value) : null)}
                  min={0}
                  max={dbDiscountType === "percentage" ? 100 : undefined}
                  step={dbDiscountType === "percentage" ? 1 : 0.01}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/discount-codes")}>
                Abbrechen
              </Button>
              <Button type="button" onClick={() => setActiveTab("usage")}>
                Weiter
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Nutzung & Gültigkeit</CardTitle>
              <CardDescription>Legen Sie fest, wie oft und wann der Rabattcode verwendet werden kann</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max_uses">Maximum Uses</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={maximumUses !== null ? maximumUses : ""}
                  onChange={(e) => setMaximumUses(e.target.value ? Number(e.target.value) : null)}
                  min={0}
                  placeholder="Unbegrenzt"
                />
                <p className="text-sm text-muted-foreground">
                  Lassen Sie dieses Feld leer, wenn der Code unbegrenzt oft verwendet werden kann
                </p>
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="current_uses">Aktuelle Verwendungen</Label>
                  <Input
                    id="current_uses"
                    type="number"
                    value={currentUses}
                    onChange={(e) => setCurrentUses(Number(e.target.value))}
                    min={0}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="min_order_amount">Minimum Purchase Amount (€)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={minimum_amount !== null ? minimum_amount : ""}
                  onChange={(e) => setMinimumAmount(e.target.value ? Number(e.target.value) : null)}
                  min={0}
                  step={0.01}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires_at">Gültig bis</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="expires_at"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expiresAt && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiresAt ? format(expiresAt, "PPP", { locale: de }) : "Datum auswählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={expiresAt || undefined}
                      onSelect={setExpiresAt}
                      initialFocus
                      locale={de}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-sm text-muted-foreground">
                  Lassen Sie dieses Feld leer, wenn der Code unbegrenzt gültig sein soll
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                Zurück
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Wird gespeichert..." : isEditing ? "Aktualisieren" : "Erstellen"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}
