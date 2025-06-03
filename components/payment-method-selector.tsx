"use client"
import Image from "next/image"
import type { PaymentMethod } from "@/types/payment"
import { cn } from "@/lib/utils"

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[]
  selectedPaymentMethodId: string
  onSelectPaymentMethod: (methodId: string) => void
  disabled?: boolean
}

export function PaymentMethodSelector({
  paymentMethods,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  disabled = false,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Select Payment Method</div>
      <div className="grid gap-3">
        {paymentMethods.map((method) => (
          <PaymentMethodOption
            key={method.id}
            method={method}
            isSelected={method.id === selectedPaymentMethodId}
            onSelect={() => onSelectPaymentMethod(method.id)}
            disabled={disabled || !method.isActive}
          />
        ))}
      </div>
    </div>
  )
}

interface PaymentMethodOptionProps {
  method: PaymentMethod
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

function PaymentMethodOption({ method, isSelected, onSelect, disabled = false }: PaymentMethodOptionProps) {
  return (
    <div
      className={cn(
        "relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
        isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-200",
        disabled && "opacity-50 cursor-not-allowed",
      )}
      onClick={!disabled ? onSelect : undefined}
    >
      <div className="mr-4 w-12 h-12 relative">
        <Image src={method.iconPath || "/placeholder.svg"} alt={method.label} fill className="object-contain" />
      </div>
      <div className="flex-1">
        <div className="font-medium">{method.label}</div>
        <div className="text-sm text-gray-500">{method.description}</div>
        {method.processingFee && <div className="text-xs text-gray-400 mt-1">Fee: {method.processingFee}</div>}
        {method.processingTime && <div className="text-xs text-gray-400">Processing time: {method.processingTime}</div>}
      </div>
      <div className="w-5 h-5 rounded-full border-2 relative flex-shrink-0">
        {isSelected && <div className="absolute inset-1 rounded-full bg-purple-500"></div>}
      </div>
    </div>
  )
}
