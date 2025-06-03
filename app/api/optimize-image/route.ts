import { type NextRequest, NextResponse } from "next/server"
import { optimizeImage, type ImageFormat } from "@/lib/image-optimization"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File | null

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const width = Number.parseInt(formData.get("width") as string) || undefined
    const height = Number.parseInt(formData.get("height") as string) || undefined
    const quality = Number.parseInt(formData.get("quality") as string) || 80
    const format = (formData.get("format") as ImageFormat) || "webp"
    const progressive = formData.get("progressive") !== "false"

    const buffer = await imageFile.arrayBuffer()
    const optimizedBuffer = await optimizeImage(Buffer.from(buffer), {
      width,
      height,
      quality,
      format,
      progressive,
    })

    return new NextResponse(optimizedBuffer, {
      headers: {
        "Content-Type": `image/${format}`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Image optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize image" }, { status: 500 })
  }
}
