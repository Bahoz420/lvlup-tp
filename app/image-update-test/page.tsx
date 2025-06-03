"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { products } from "@/data/products"
import { Navigation } from "@/components/navigation"

export default function ImageUpdateTest() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const fortniteProduct = products.find((p) => p.slug === "fortnite")

  useEffect(() => {
    // Test image loading
    const img = new Image()
    img.onload = () => {
      setImageLoaded(true)
      setDimensions({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      setImageError(true)
    }
    img.src = fortniteProduct?.image_url || ""
  }, [fortniteProduct?.image_url])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fortnite Image Update Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-white rounded-lg border p-4">
                  <h3 className="text-lg font-semibold mb-2">Image Status</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className={`w-3 h-3 rounded-full ${imageLoaded ? "bg-green-500" : imageError ? "bg-red-500" : "bg-yellow-500"}`}
                    ></div>
                    <span>
                      {imageLoaded ? "Image loaded successfully" : imageError ? "Error loading image" : "Loading..."}
                    </span>
                  </div>

                  {imageLoaded && (
                    <div className="text-sm text-gray-600">
                      <p>
                        Dimensions: {dimensions.width} × {dimensions.height}px
                      </p>
                      <p>Path: {fortniteProduct?.image_url}</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="aspect-video relative">
                    {fortniteProduct?.image_url && (
                      <Image
                        src={fortniteProduct.image_url || "/placeholder.svg"}
                        alt="Fortnite"
                        fill
                        className="object-cover"
                        priority
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold">{fortniteProduct?.name}</h2>
                    <p className="text-gray-600">{fortniteProduct?.description}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button asChild>
                    <a href="/products/fortnite">View Product Page</a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="/products">All Products</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
