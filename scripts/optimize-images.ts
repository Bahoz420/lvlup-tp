import fs from "fs/promises"
import path from "path"
import { optimizeImage, generatePlaceholder } from "../lib/image-optimization"

const PUBLIC_DIR = path.join(process.cwd(), "public")
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, "optimized")
const PLACEHOLDERS_DIR = path.join(PUBLIC_DIR, "placeholders")

// Unterstützte Bildformate
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error) {
    console.error(`Failed to create directory ${dir}:`, error)
  }
}

async function processImage(filePath: string) {
  const relativePath = path.relative(PUBLIC_DIR, filePath)
  const fileExt = path.extname(filePath).toLowerCase()

  if (!IMAGE_EXTENSIONS.includes(fileExt)) return

  try {
    const fileBuffer = await fs.readFile(filePath)
    const fileName = path.basename(filePath, fileExt)
    const dirName = path.dirname(relativePath)

    // Optimierte Versionen erstellen
    const sizes = [640, 750, 828, 1080, 1200, 1920]
    const formats: ("webp" | "avif")[] = ["webp", "avif"]

    // Verzeichnisse erstellen
    const optimizedSubDir = path.join(OPTIMIZED_DIR, dirName)
    await ensureDirectoryExists(optimizedSubDir)

    // Placeholder erstellen
    const placeholderSubDir = path.join(PLACEHOLDERS_DIR, dirName)
    await ensureDirectoryExists(placeholderSubDir)
    const placeholderPath = path.join(placeholderSubDir, `${fileName}.webp`)
    const placeholderBuffer = await generatePlaceholder(fileBuffer)

    // Base64-Placeholder in Datei speichern
    await fs.writeFile(placeholderPath.replace(".webp", ".txt"), placeholderBuffer)

    // Optimierte Versionen für verschiedene Größen und Formate erstellen
    for (const size of sizes) {
      for (const format of formats) {
        const optimizedBuffer = await optimizeImage(fileBuffer, {
          width: size,
          format,
          quality: 80,
        })

        const optimizedPath = path.join(optimizedSubDir, `${fileName}-${size}.${format}`)

        await fs.writeFile(optimizedPath, optimizedBuffer)
      }
    }

    console.log(`Optimized: ${relativePath}`)
  } catch (error) {
    console.error(`Failed to process ${filePath}:`, error)
  }
}

async function scanDirectory(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    // Optimized und placeholders Verzeichnisse überspringen
    if (entry.name === "optimized" || entry.name === "placeholders" || entry.name.startsWith(".")) {
      continue
    }

    if (entry.isDirectory()) {
      await scanDirectory(fullPath)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (IMAGE_EXTENSIONS.includes(ext)) {
        await processImage(fullPath)
      }
    }
  }
}

async function main() {
  try {
    // Verzeichnisse erstellen
    await ensureDirectoryExists(OPTIMIZED_DIR)
    await ensureDirectoryExists(PLACEHOLDERS_DIR)

    // Bilder scannen und optimieren
    await scanDirectory(PUBLIC_DIR)

    console.log("Image optimization completed successfully!")
  } catch (error) {
    console.error("Image optimization failed:", error)
    process.exit(1)
  }
}

main()
