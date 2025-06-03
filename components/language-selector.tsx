"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

type Language = {
  code: string
  name: string
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
]

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    // Here you would implement actual language switching logic
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-purple-200">
          <Globe className="h-4 w-4 text-purple-600" />
          <span className="text-purple-700">{currentLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="cursor-pointer"
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
