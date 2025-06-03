"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

export default function CacheControlPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [revalidationType, setRevalidationType] = useState<"path" | "tag">("path")
  const [pathInput, setPathInput] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [selectedPreset, setSelectedPreset] = useState("")

  // Vordefinierte Pfade und Tags für schnellen Zugriff
  const pathPresets = [
    { label: "Startseite", value: "/" },
    { label: "Produkte", value: "/products" },
    { label: "Status", value: "/status" },
    { label: "Forum", value: "/forum" },
  ]

  const tagPresets = [
    { label: "Alle Produkte", value: "products" },
    { label: "Status", value: "status" },
    { label: "Fortnite", value: "product-fortnite" },
    { label: "Valorant", value: "product-valorant" },
    { label: "Apex Legends", value: "product-apex-legends" },
  ]

  const handleRevalidate = async () => {
    try {
      setIsLoading(true)

      const value = revalidationType === "path" ? pathInput : tagInput

      if (!value) {
        toast({
          title: "Fehler",
          description: `Bitte gib einen ${revalidationType === "path" ? "Pfad" : "Tag"} ein.`,
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "your-secret-token",
        },
        body: JSON.stringify({
          type: revalidationType,
          [revalidationType]: value,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Erfolg",
          description: data.message,
        })
      } else {
        toast({
          title: "Fehler",
          description: data.message || "Revalidierung fehlgeschlagen",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Bei der Revalidierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
      console.error("Revalidation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset)
    if (revalidationType === "path") {
      setPathInput(preset)
    } else {
      setTagInput(preset)
    }
  }

  const handleRevalidateAll = async () => {
    try {
      setIsLoading(true)

      // Revalidiere alle wichtigen Pfade und Tags
      const promises = [
        // Wichtige Pfade
        fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "your-secret-token",
          },
          body: JSON.stringify({ type: "path", path: "/" }),
        }),
        fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "your-secret-token",
          },
          body: JSON.stringify({ type: "path", path: "/products" }),
        }),

        // Wichtige Tags
        fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "your-secret-token",
          },
          body: JSON.stringify({ type: "tag", tag: "products" }),
        }),
        fetch("/api/revalidate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-revalidate-token": process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || "your-secret-token",
          },
          body: JSON.stringify({ type: "tag", tag: "status" }),
        }),
      ]

      await Promise.all(promises)

      toast({
        title: "Erfolg",
        description: "Alle Caches wurden erfolgreich revalidiert.",
      })
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Bei der Revalidierung ist ein Fehler aufgetreten.",
        variant: "destructive",
      })
      console.error("Revalidation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Cache-Verwaltung</CardTitle>
        <CardDescription>
          Verwalte den Cache deiner Website. Revalidiere bestimmte Pfade oder Tags, um sicherzustellen, dass die
          neuesten Inhalte angezeigt werden.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manuelle Revalidierung</TabsTrigger>
            <TabsTrigger value="presets">Voreinstellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup
                value={revalidationType}
                onValueChange={(value) => setRevalidationType(value as "path" | "tag")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="path" id="path" />
                  <Label htmlFor="path">Pfad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tag" id="tag" />
                  <Label htmlFor="tag">Tag</Label>
                </div>
              </RadioGroup>

              {revalidationType === "path" ? (
                <div className="space-y-2">
                  <Label htmlFor="path-input">Pfad</Label>
                  <Input
                    id="path-input"
                    placeholder="/products"
                    value={pathInput}
                    onChange={(e) => setPathInput(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Beispiele: /, /products, /products/fortnite-premium</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="tag-input">Tag</Label>
                  <Input
                    id="tag-input"
                    placeholder="products"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">Beispiele: products, status, product-fortnite</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-4">
              <RadioGroup
                value={revalidationType}
                onValueChange={(value) => setRevalidationType(value as "path" | "tag")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="path" id="path-preset" />
                  <Label htmlFor="path-preset">Pfad</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tag" id="tag-preset" />
                  <Label htmlFor="tag-preset">Tag</Label>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-2 gap-2">
                {revalidationType === "path"
                  ? pathPresets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={selectedPreset === preset.value ? "default" : "outline"}
                        onClick={() => handlePresetSelect(preset.value)}
                        className="justify-start"
                      >
                        {preset.label}
                      </Button>
                    ))
                  : tagPresets.map((preset) => (
                      <Button
                        key={preset.value}
                        variant={selectedPreset === preset.value ? "default" : "outline"}
                        onClick={() => handlePresetSelect(preset.value)}
                        className="justify-start"
                      >
                        {preset.label}
                      </Button>
                    ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleRevalidateAll} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird ausgeführt...
            </>
          ) : (
            "Alle revalidieren"
          )}
        </Button>
        <Button onClick={handleRevalidate} disabled={isLoading || (!pathInput && !tagInput)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Wird ausgeführt...
            </>
          ) : (
            "Revalidieren"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
