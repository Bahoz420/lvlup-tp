import { DiscountCodeForm } from "@/components/admin/discount-code-form"

interface EditDiscountCodePageProps {
  params: {
    id: string
  }
}

export default function EditDiscountCodePage({ params }: EditDiscountCodePageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rabattcode bearbeiten</h1>
        <p className="text-muted-foreground mt-2">Bearbeiten Sie die Details des ausgewählten Rabattcodes</p>
      </div>

      <DiscountCodeForm discountCodeId={params.id} />
    </div>
  )
}
