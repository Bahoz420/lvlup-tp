export interface DiscountCode {
  id: string
  code: string
  description: string
  discount_percent: number | null
  discount_amount: number | null
  min_order_amount: number | null
  max_uses: number | null
  current_uses: number
  is_active: boolean
  starts_at: string | null
  expires_at: string | null
  created_at: string
  scope?: "all" | "product" | "category" | "customer"
  scope_id?: string
  is_one_time_use?: boolean
  customer_email?: string
}

export const mockDiscountCodes: DiscountCode[] = [
  {
    id: "1",
    code: "WELCOME10",
    description: "10% Rabatt für Neukunden",
    discount_percent: 10,
    discount_amount: null,
    min_order_amount: null,
    max_uses: 1000,
    current_uses: 423,
    is_active: true,
    starts_at: "2023-01-01T00:00:00Z",
    expires_at: "2023-12-31T23:59:59Z",
    created_at: "2023-01-01T00:00:00Z",
    scope: "all",
    is_one_time_use: true,
  },
  {
    id: "2",
    code: "SUMMER20",
    description: "20% Rabatt für Sommeraktion",
    discount_percent: 20,
    discount_amount: null,
    min_order_amount: 50,
    max_uses: 500,
    current_uses: 289,
    is_active: true,
    starts_at: "2023-06-01T00:00:00Z",
    expires_at: "2023-08-31T23:59:59Z",
    created_at: "2023-05-15T00:00:00Z",
    scope: "all",
  },
  {
    id: "3",
    code: "FREESHIP",
    description: "Kostenloser Versand",
    discount_percent: null,
    discount_amount: 5,
    min_order_amount: 30,
    max_uses: null,
    current_uses: 1245,
    is_active: true,
    starts_at: null,
    expires_at: null,
    created_at: "2023-02-10T00:00:00Z",
    scope: "all",
  },
  {
    id: "4",
    code: "VIP25",
    description: "25% Rabatt für VIP-Kunden",
    discount_percent: 25,
    discount_amount: null,
    min_order_amount: 100,
    max_uses: null,
    current_uses: 78,
    is_active: true,
    starts_at: null,
    expires_at: null,
    created_at: "2023-03-15T00:00:00Z",
    scope: "customer",
    customer_email: "vip@example.com",
  },
  {
    id: "5",
    code: "FLASH30",
    description: "30% Rabatt für Flash-Sale",
    discount_percent: 30,
    discount_amount: null,
    min_order_amount: null,
    max_uses: 200,
    current_uses: 200,
    is_active: false,
    starts_at: "2023-04-01T00:00:00Z",
    expires_at: "2023-04-02T23:59:59Z",
    created_at: "2023-03-25T00:00:00Z",
    scope: "all",
  },
  {
    id: "6",
    code: "VALORANT15",
    description: "15% Rabatt auf Valorant-Produkte",
    discount_percent: 15,
    discount_amount: null,
    min_order_amount: null,
    max_uses: null,
    current_uses: 56,
    is_active: true,
    starts_at: null,
    expires_at: "2023-12-31T23:59:59Z",
    created_at: "2023-01-20T00:00:00Z",
    scope: "category",
    scope_id: "valorant",
  },
  {
    id: "7",
    code: "FORTNITE10",
    description: "10% Rabatt auf Fortnite-Produkte",
    discount_percent: 10,
    discount_amount: null,
    min_order_amount: null,
    max_uses: null,
    current_uses: 132,
    is_active: true,
    starts_at: null,
    expires_at: "2023-12-31T23:59:59Z",
    created_at: "2023-01-20T00:00:00Z",
    scope: "category",
    scope_id: "fortnite",
  },
  {
    id: "8",
    code: "BIRTHDAY20",
    description: "20% Rabatt zum Geburtstag",
    discount_percent: 20,
    discount_amount: null,
    min_order_amount: null,
    max_uses: 1,
    current_uses: 0,
    is_active: true,
    starts_at: null,
    expires_at: "2023-12-31T23:59:59Z",
    created_at: "2023-01-20T00:00:00Z",
    scope: "customer",
    customer_email: "birthday@example.com",
    is_one_time_use: true,
  },
  {
    id: "9",
    code: "PREMIUM50",
    description: "50€ Rabatt auf Premium-Abonnement",
    discount_percent: null,
    discount_amount: 50,
    min_order_amount: 100,
    max_uses: 100,
    current_uses: 45,
    is_active: true,
    starts_at: null,
    expires_at: "2023-12-31T23:59:59Z",
    created_at: "2023-02-01T00:00:00Z",
    scope: "product",
    scope_id: "premium-subscription",
  },
  {
    id: "10",
    code: "BLACKFRIDAY",
    description: "40% Rabatt zum Black Friday",
    discount_percent: 40,
    discount_amount: null,
    min_order_amount: null,
    max_uses: 500,
    current_uses: 0,
    is_active: false,
    starts_at: "2023-11-24T00:00:00Z",
    expires_at: "2023-11-27T23:59:59Z",
    created_at: "2023-10-15T00:00:00Z",
    scope: "all",
  },
]

export const getDiscountCodes = () => {
  return [...mockDiscountCodes]
}

export const getDiscountCodeById = (id: string) => {
  return mockDiscountCodes.find((code) => code.id === id)
}

export const createDiscountCode = (code: Omit<DiscountCode, "id" | "created_at">) => {
  const newCode = {
    ...code,
    id: Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString(),
    current_uses: 0,
  }
  return newCode
}

export const updateDiscountCode = (id: string, updates: Partial<DiscountCode>) => {
  const index = mockDiscountCodes.findIndex((code) => code.id === id)
  if (index === -1) return null

  const updatedCode = {
    ...mockDiscountCodes[index],
    ...updates,
  }
  return updatedCode
}

export const deleteDiscountCode = (id: string) => {
  const index = mockDiscountCodes.findIndex((code) => code.id === id)
  if (index === -1) return false
  return true
}
