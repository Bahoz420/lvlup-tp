"use client"

import { useState } from "react"
import { generateDiscountCodesAction } from "@/app/admin/discount-codes/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { de } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DiscountCode } from "@/types/discount"

export function DiscountCodeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [count, setCount] = useState(10)
  const [prefix, setPrefix] = useState("")
  const [length, setLength] = useState(8)
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent")
  const [discountValue, setDiscountValue] = useState(10)
  const [minOrderAmount, setMinOrderAmount] = useState<number | null>(null)
  const [maxUses, setMaxUses] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(true)
  const [expiryDate, setExpiryDate] = useState<Date | null>(null)
  const [generatedCodes, setGeneratedCodes] = useState<DiscountCode[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const template: Partial<DiscountCode> = {
        discount_percent: discountType === "percent" ? discountValue : null,
        discount_amount: discountType === "fixed" ? discountValue : null,
        min_order_amount: minOrderAmount,
        max_uses: maxUses,
        is_active: isActive,
        expires_at: expiryDate ? expiryDate.toISOString() : null,
      }

      const result = await generateDiscountCodesAction(count, template, prefix, length)

      if (result.success && result.data) {
        setGeneratedCodes(result.data)
        toast({
          title: "Rabattcodes generiert",
          description: `${result.data.length} Rabattcodes wurden erfolgreich generiert.`,
        })
      } else {
        toast({
          title: "Fehler",
          description: result.error || "Fehler beim Generieren der Rabattcodes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating discount codes:", error)
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    const codesText = generatedCodes.map((code) => code.code).join("\n")
    navigator.clipboard.writeText(codesText)
    toast({
      title: "Kopiert",
      description: "Rabattcodes wurden in die Zwischenablage kopiert",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rabattcodes generieren</CardTitle>
        <CardDescription>Erstellen Sie mehrere Rabattcodes auf einmal mit den gleichen Eigenschaften.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Grundeinstellungen</TabsTrigger>
            <TabsTrigger value="advanced">Erweiterte Einstellungen</TabsTrigger>
            {generatedCodes.length > 0 && <TabsTrigger value="results">Generierte Codes</TabsTrigger>}
          </TabsList>

          <TabsContent value="basic">
            <div className="space-y-4">
              <div>
                <Label htmlFor="count">Anzahl der Codes</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Slider
                    id="count"
                    min={1}
                    max={100}
                    step={1}
                    value={[count]}
                    onValueChange={(values) => setCount(values[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{count}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="prefix">Präfix (optional)</Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="z.B. SUMMER"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="length">Codelänge</Label>
                  <Select value={length.toString()} onValueChange={(value) => setLength(Number.parseInt(value))}>
                    <SelectTrigger id="length" className="mt-1">
                      <SelectValue placeholder="Codelänge auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 Zeichen</SelectItem>
                      <SelectItem value="8">8 Zeichen</SelectItem>
                      <SelectItem value="10">10 Zeichen</SelectItem>
                      <SelectItem value="12">12 Zeichen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Rabatttyp</Label>
                <RadioGroup
                  value={discountType}
                  onValueChange={(value) => setDiscountType(value as "percent" | "fixed")}
                  className="flex items-center gap-4 mt-1"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="percent" id="percent" />
                    <Label htmlFor="percent">Prozentual (%)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    <Label htmlFor="fixed">Fester Betrag (€)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="discountValue">{discountType === "percent" ? "Rabatt in %" : "Rabatt in €"}</Label>
                <div className="flex items-center gap-4 mt-1">
                  <Slider
                    id="discountValue"
                    min={1}
                    max={discountType === "percent" ? 100 : 200}
                    step={discountType === "percent" ? 1 : 5}
                    value={[discountValue]}
                    onValueChange={(values) => setDiscountValue(values[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center">
                    {discountValue}
                    {discountType === "percent" ? "%" : "€"}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced">
            <div className="space-y-4">
              <div>
                <Label htmlFor="minOrderAmount">Mindestbestellwert (optional)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={minOrderAmount !== null ? minOrderAmount : ""}
                  onChange={(e) => setMinOrderAmount(e.target.value ? Number(e.target.value) : null)}
                  placeholder="z.B. 50"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="maxUses">Maximale Verwendungen (optional)</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={maxUses !== null ? maxUses : ""}
                  onChange={(e) => setMaxUses(e.target.value ? Number(e.target.value) : null)}
                  placeholder="z.B. 100"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked === true)}
                />
                <Label htmlFor="isActive">Rabattcodes sofort aktivieren</Label>
              </div>

              <div>
                <Label htmlFor="expiryDate">Ablaufdatum (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="expiryDate"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !expiryDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP", { locale: de }) : "Ablaufdatum auswählen"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={expiryDate} onSelect={setExpiryDate} initialFocus locale={de} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </TabsContent>

          {generatedCodes.length > 0 && (
            <TabsContent value="results">
              <div className="space-y-4">
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  <ul className="space-y-1">
                    {generatedCodes.map((code) => (
                      <li key={code.id} className="font-mono">
                        {code.code}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button onClick={copyToClipboard} className="w-full">
                  Alle Codes kopieren
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(activeTab === "basic" ? "advanced" : "basic")}>
          {activeTab === "basic" ? "Weiter zu erweiterten Einstellungen" : "Zurück zu Grundeinstellungen"}
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Generiere..." : "Rabattcodes generieren"}
        </Button>
      </CardFooter>
    </Card>
  )
}
