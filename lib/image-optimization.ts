import sharp from "sharp"

export type ImageFormat = "webp" | "avif" | "jpeg" | "png"

interface OptimizeImageOptions {
  width?: number
  height?: number
  quality?: number
  format?: ImageFormat
  progressive?: boolean
}

export async function optimizeImage(inputBuffer: Buffer, options: OptimizeImageOptions = {}): Promise<Buffer> {
  const { width, height, quality = 80, format = "webp", progressive = true } = options

  let pipeline = sharp(inputBuffer)

  // Resize wenn Dimensionen angegeben
  if (width || height) {
    pipeline = pipeline.resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    })
  }

  // Format-spezifische Optionen anwenden
  switch (format) {
    case "webp":
      pipeline = pipeline.webp({ quality, effort: 6 })
      break
    case "avif":
      pipeline = pipeline.avif({ quality, effort: 6 })
      break
    case "jpeg":
      pipeline = pipeline.jpeg({ quality, progressive })
      break
    case "png":
      pipeline = pipeline.png({ quality, progressive })
      break
  }

  // Metadaten entfernen für kleinere Dateien
  pipeline = pipeline.withMetadata(false)

  return pipeline.toBuffer()
}

export async function generatePlaceholder(inputBuffer: Buffer, width = 20): Promise<string> {
  const placeholderBuffer = await sharp(inputBuffer)
    .resize(width, null, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer()

  return `data:image/webp;base64,${placeholderBuffer.toString("base64")}`
}

export async function getImageDimensions(inputBuffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(inputBuffer).metadata()
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  }
}
