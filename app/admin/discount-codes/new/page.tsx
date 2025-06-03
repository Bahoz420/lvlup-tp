import { DiscountCodeForm } from "@/components/admin/discount-code-form"

export default function NewDiscountCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Neuen Rabattcode erstellen</h1>
        <p className="text-muted-foreground mt-2">Erstellen Sie einen neuen Rabattcode für Ihre Kunden</p>
      </div>

      <DiscountCodeForm />
    </div>
  )
}
