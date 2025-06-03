"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GiftOptionProps {
  onGiftOptionChange: (isGift: boolean, email: string | null) => void
}

export function GiftOption({ onGiftOptionChange }: GiftOptionProps) {
  const [isGift, setIsGift] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState("")

  useEffect(() => {
    onGiftOptionChange(isGift, isGift ? recipientEmail : null)
  }, [isGift, recipientEmail, onGiftOptionChange])

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="is-gift"
          checked={isGift}
          onCheckedChange={(checked) => {
            setIsGift(checked === true)
          }}
        />
        <Label htmlFor="is-gift" className="cursor-pointer">
          Als Geschenk kaufen
        </Label>
      </div>

      {isGift && (
        <div>
          <Label htmlFor="recipient-email">E-Mail-Adresse des Empfängers</Label>
          <Input
            id="recipient-email"
            type="email"
            placeholder="empfaenger@email.de"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Der Aktivierungscode wird an diese E-Mail-Adresse gesendet.
          </p>
        </div>
      )}
    </div>
  )
}
