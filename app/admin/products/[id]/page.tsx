"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { mockProducts } from "@/data/mock-products"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Finde das Produkt in den Mock-Daten
    const foundProduct = mockProducts.find((p) => p.id === params.id)

    if (foundProduct) {
      setProduct(foundProduct)
    } else {
      // Wenn das Produkt nicht gefunden wurde, zurück zur Produktliste
      router.push("/admin/products")
    }

    setLoading(false)
  }, [params.id, router])

  if (loading) {
    return <div className="text-center py-10">Loading product details...</div>
  }

  if (!product) {
    return <div className="text-center py-10">Product not found</div>
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-lg">{product.name}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p>{product.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Price</h3>
                  <p className="text-lg">${product.price.toFixed(2)}</p>
                </div>

                {product.sale_price && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Sale Price</h3>
                    <p className="text-lg text-green-600">${product.sale_price.toFixed(2)}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                  <p>{product.category}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="capitalize">{product.status.status}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <p>{new Date(product.created_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-md overflow-hidden">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button onClick={() => alert("This is a demo. Editing is not available.")}>Edit Product</Button>
      </div>
    </div>
  )
}
