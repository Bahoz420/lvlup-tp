"use client"

import { useState, useEffect } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastState extends ToastProps {
  id: number
  visible: boolean
}

let toastCounter = 0
const toasts: ToastState[] = []
const listeners: Set<(toasts: ToastState[]) => void> = new Set()

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]))
}

export function toast({ title, description, variant = "default", duration = 5000 }: ToastProps) {
  const id = toastCounter++
  const newToast: ToastState = {
    id,
    title,
    description,
    variant,
    visible: true,
    duration,
  }

  toasts.push(newToast)
  notifyListeners()

  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      toasts[index].visible = false
      notifyListeners()

      setTimeout(() => {
        const removeIndex = toasts.findIndex((t) => t.id === id)
        if (removeIndex !== -1) {
          toasts.splice(removeIndex, 1)
          notifyListeners()
        }
      }, 300) // Animation duration
    }
  }, duration)

  return {
    id,
    dismiss: () => {
      const index = toasts.findIndex((t) => t.id === id)
      if (index !== -1) {
        toasts[index].visible = false
        notifyListeners()

        setTimeout(() => {
          const removeIndex = toasts.findIndex((t) => t.id === id)
          if (removeIndex !== -1) {
            toasts.splice(removeIndex, 1)
            notifyListeners()
          }
        }, 300) // Animation duration
      }
    },
  }
}

export function useToast() {
  return { toast }
}

export function Toaster() {
  const [visibleToasts, setVisibleToasts] = useState<ToastState[]>([])

  useEffect(() => {
    const handleToastsChange = (newToasts: ToastState[]) => {
      setVisibleToasts(newToasts)
    }

    listeners.add(handleToastsChange)
    return () => {
      listeners.delete(handleToastsChange)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[-10px]"}
            ${
              toast.variant === "destructive"
                ? "bg-red-100 border-red-200 text-red-800"
                : toast.variant === "success"
                  ? "bg-green-100 border-green-200 text-green-800"
                  : "bg-white border-gray-200 text-gray-800"
            }
            transform transition-all duration-300 ease-in-out
            rounded-lg border shadow-lg p-4
          `}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button onClick={() => toast.dismiss()} className="ml-4 text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
