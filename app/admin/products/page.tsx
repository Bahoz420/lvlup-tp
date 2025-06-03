import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductList } from "@/components/admin/product-list"
import { Plus } from "lucide-react"

export const metadata = {
  title: "Product Management | Admin Dashboard",
}

export default function ProductsAdminPage() {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your products, update details, and control availability.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <ProductList />
    </div>
  )
}
