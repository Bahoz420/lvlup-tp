"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { calculateSubscriptionPrice } from "@/utils/price-formatter"

export interface CartItem {
  id: string
  name: string
  price: number
  subscription: string
  image_url?: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: string; subscription: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; subscription: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.subscription === action.payload.subscription,
      )

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items]
        updatedItems[existingItemIndex].quantity += action.payload.quantity
        return { ...state, items: updatedItems }
      }

      return { ...state, items: [...state.items, action.payload] }
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === action.payload.id && item.subscription === action.payload.subscription),
        ),
      }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => !(item.id === action.payload.id && item.subscription === action.payload.subscription),
          ),
        }
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.subscription === action.payload.subscription
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
    }

    case "CLEAR_CART":
      return { ...state, items: [] }

    case "LOAD_CART":
      return { ...state, items: action.payload }

    default:
      return state
  }
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, subscription: string) => void
  updateQuantity: (id: string, subscription: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          // Validate and fix cart items
          const validatedCart = parsedCart.map((item: any) => ({
            id: item.id || "unknown",
            name: item.name || `${item.id || "Unknown"} Product`,
            price:
              typeof item.price === "number" && !isNaN(item.price)
                ? item.price
                : calculateSubscriptionPrice(item.id || "default", item.subscription || "3day"),
            subscription: item.subscription || "3day",
            image_url: item.image_url || "/placeholder.svg",
            quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
          }))
          dispatch({ type: "LOAD_CART", payload: validatedCart })
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
        localStorage.removeItem("cart")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length >= 0) {
      localStorage.setItem("cart", JSON.stringify(state.items))
    }
  }, [state.items])

  const addItem = (item: CartItem) => {
    // Ensure the item has valid data
    const validatedItem: CartItem = {
      id: item.id || "unknown",
      name: item.name || `${item.id || "Unknown"} Product`,
      price:
        typeof item.price === "number" && !isNaN(item.price)
          ? item.price
          : calculateSubscriptionPrice(item.id || "default", item.subscription || "3day"),
      subscription: item.subscription || "3day",
      image_url: item.image_url || "/placeholder.svg",
      quantity: typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 1,
    }

    console.log("Adding validated item to cart:", validatedItem)
    dispatch({ type: "ADD_ITEM", payload: validatedItem })
  }

  const removeItem = (id: string, subscription: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, subscription } })
  }

  const updateQuantity = (id: string, subscription: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, subscription, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  // Calculate item count
  const itemCount = state.items.reduce((total, item) => {
    const quantity = typeof item.quantity === "number" && !isNaN(item.quantity) ? item.quantity : 0
    return total + quantity
  }, 0)

  // Calculate subtotal with proper error handling
  const subtotal = state.items.reduce((total, item) => {
    const price =
      typeof item.price === "number" && !isNaN(item.price)
        ? item.price
        : calculateSubscriptionPrice(item.id || "default", item.subscription || "3day")

    const quantity = typeof item.quantity === "number" && !isNaN(item.quantity) ? item.quantity : 0

    const itemTotal = price * quantity
    console.log(`Item: ${item.name}, Price: ${price}, Quantity: ${quantity}, Total: ${itemTotal}`)

    return total + itemTotal
  }, 0)

  console.log("Cart state:", { items: state.items, itemCount, subtotal })

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
