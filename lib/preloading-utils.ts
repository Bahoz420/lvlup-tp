// Hilfsfunktionen für Preloading

// Funktion zum Preloaden eines Bildes
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Funktion zum Preloaden mehrerer Bilder
export async function preloadImages(srcs: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(srcs.map((src) => preloadImage(src)))
}

// Funktion zum Preloaden eines Skripts
export function preloadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.rel = "preload"
    script.as = "script"
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Funktion zum Preloaden mehrerer Skripte
export async function preloadScripts(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map((src) => preloadScript(src)))
}

// Funktion zum Preloaden eines Stylesheets
export function preloadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link")
    link.href = href
    link.rel = "preload"
    link.as = "style"
    link.onload = () => resolve()
    link.onerror = reject
    document.head.appendChild(link)
  })
}

// Funktion zum Preloaden mehrerer Stylesheets
export async function preloadStylesheets(hrefs: string[]): Promise<void[]> {
  return Promise.all(hrefs.map((href) => preloadStylesheet(href)))
}

// Funktion zum Preloaden einer Schriftart
export function preloadFont(src: string, type: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link")
    link.href = src
    link.rel = "preload"
    link.as = "font"
    link.type = type
    link.crossOrigin = "anonymous"
    link.onload = () => resolve()
    link.onerror = reject
    document.head.appendChild(link)
  })
}

// Funktion zum Preloaden mehrerer Schriftarten
export async function preloadFonts(fonts: { src: string; type: string }[]): Promise<void[]> {
  return Promise.all(fonts.map((font) => preloadFont(font.src, font.type)))
}

// Funktion zum Preloaden einer Seite
export function preloadPage(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link")
    link.href = href
    link.rel = "prefetch"
    link.onload = () => resolve()
    link.onerror = reject
    document.head.appendChild(link)
  })
}

// Funktion zum Preloaden mehrerer Seiten
export async function preloadPages(hrefs: string[]): Promise<void[]> {
  return Promise.all(hrefs.map((href) => preloadPage(href)))
}

// Funktion zum Preloaden von Daten
export async function preloadData(url: string): Promise<any> {
  try {
    const response = await fetch(url, { method: "GET", headers: { Purpose: "prefetch" } })
    return await response.json()
  } catch (error) {
    console.error(`Failed to preload data from ${url}:`, error)
    return null
  }
}

// Funktion zum Preloaden mehrerer Daten
export async function preloadDataSources(urls: string[]): Promise<any[]> {
  return Promise.all(urls.map((url) => preloadData(url)))
}
