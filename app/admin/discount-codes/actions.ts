"use server"

import { revalidatePath } from "next/cache"
import { createDiscountCode, updateDiscountCode, deleteDiscountCode } from "@/lib/discount-service"
import type { DiscountCodeCreateInput, DiscountCodeUpdateInput } from "@/lib/types"
import { redirect } from "next/navigation"

export async function createDiscountCodeAction(data: DiscountCodeCreateInput) {
  try {
    await createDiscountCode(data)
    revalidatePath("/admin/discount-codes")
    redirect("/admin/discount-codes")
  } catch (error) {
    console.error("Error creating discount code:", error)
    return { message: "Failed to create discount code" }
  }
}

export async function updateDiscountCodeAction(id: string, data: DiscountCodeUpdateInput) {
  try {
    await updateDiscountCode(id, data)
    revalidatePath("/admin/discount-codes")
    redirect("/admin/discount-codes")
  } catch (error) {
    console.error("Error updating discount code:", error)
    return { message: "Failed to update discount code" }
  }
}

export async function deleteDiscountCodeAction(id: string) {
  try {
    await deleteDiscountCode(id)
    revalidatePath("/admin/discount-codes")
  } catch (error) {
    console.error("Error deleting discount code:", error)
    return { message: "Failed to delete discount code" }
  }
}
