"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, Search, ArrowUpDown, Eye, EyeOff, AlertCircle } from "lucide-react"
import { formatPrice } from "@/utils/price-formatter"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { mockProducts } from "@/data/mock-products"

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  sale_price: number | null
  category: string
  status: {
    status: "online" | "offline" | "maintenance" | "beta"
  }
  image_url: string
  created_at: string
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Verwende direkt die Mock-Daten
    setProducts(mockProducts)

    // Extrahiere eindeutige Kategorien
    const uniqueCategories = Array.from(new Set(mockProducts.map((p) => p.category)))
    setCategories(uniqueCategories)

    setLoading(false)
  }, [])

  const handleDeleteProduct = async (id: string) => {
    try {
      // Lokale Löschung für Mock-Daten
      setProducts(products.filter((p) => p.id !== id))

      toast({
        title: "Success",
        description: "Product deleted successfully (demo mode)",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Lokale Statusänderung für Mock-Daten
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, status: { status: newStatus as "online" | "offline" | "maintenance" | "beta" } } : p,
        ),
      )

      toast({
        title: "Success",
        description: `Product status updated to ${newStatus} (demo mode)`,
      })
    } catch (error) {
      console.error("Error updating product status:", error)
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Filter and sort products client-side
  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((product) => categoryFilter === "all" || product.category === categoryFilter)
    .filter((product) => statusFilter === "all" || product.status.status === statusFilter)
    .sort((a, b) => {
      if (sortField === "price") {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price
      } else if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortField === "created_at") {
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
      return 0
    })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-500">Online</Badge>
      case "offline":
        return <Badge className="bg-red-500">Offline</Badge>
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>
      case "beta":
        return <Badge className="bg-blue-500">Beta</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">Demo mode: Changes are not saved to the database.</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("name")}>
                      <div className="flex items-center">
                        Name
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("price")}>
                      <div className="flex items-center">
                        Price
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => toggleSort("created_at")}>
                      <div className="flex items-center">
                        Created
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md overflow-hidden">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        {product.sale_price ? (
                          <div>
                            <span className="line-through text-muted-foreground">{formatPrice(product.price)}</span>
                            <span className="ml-2 text-green-600 font-medium">{formatPrice(product.sale_price)}</span>
                          </div>
                        ) : (
                          formatPrice(product.price)
                        )}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{getStatusBadge(product.status.status)}</TableCell>
                      <TableCell>{new Date(product.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Select
                            defaultValue={product.status.status}
                            onValueChange={(value) => handleStatusChange(product.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue placeholder="Change status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="online">
                                <div className="flex items-center">
                                  <Eye className="mr-2 h-4 w-4" />
                                  <span>Online</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="offline">
                                <div className="flex items-center">
                                  <EyeOff className="mr-2 h-4 w-4" />
                                  <span>Offline</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="maintenance">
                                <div className="flex items-center">
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  <span>Maintenance</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="beta">
                                <div className="flex items-center">
                                  <AlertCircle className="mr-2 h-4 w-4" />
                                  <span>Beta</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Link href={`/admin/products/${product.id}`}>
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the product "{product.name}". This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  )
}
