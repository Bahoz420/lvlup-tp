// Hilfsfunktionen für CSS-Optimierung

// Kritisches CSS extrahieren
export function extractCriticalCSS(html: string, options = {}): string {
  // In einer echten Implementierung würde hier eine Bibliothek wie 'critical' verwendet werden
  // Dies ist eine vereinfachte Beispielimplementierung

  // Extrahiere alle <style>-Tags
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  let match
  let criticalCSS = ""

  while ((match = styleRegex.exec(html)) !== null) {
    criticalCSS += match[1] + "\n"
  }

  return criticalCSS
}

// CSS-Klassen optimieren
export function optimizeCSS(css: string): string {
  // Entferne Kommentare
  let optimizedCSS = css.replace(/\/\*[\s\S]*?\*\//g, "")

  // Entferne Leerzeichen
  optimizedCSS = optimizedCSS.replace(/\s+/g, " ")

  // Entferne Leerzeichen um Selektoren
  optimizedCSS = optimizedCSS.replace(/\s*([{}:;,])\s*/g, "$1")

  // Entferne führende Nullen
  optimizedCSS = optimizedCSS.replace(/0\./g, ".")

  // Entferne unnötige Einheiten bei 0-Werten
  optimizedCSS = optimizedCSS.replace(/(\s|:)0(px|em|rem|%|in|cm|mm|pt|pc)/g, "$10")

  // Kürze Hexadezimalfarben
  optimizedCSS = optimizedCSS.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, "#$1$2$3")

  return optimizedCSS
}

// Generiere CSS für Responsive Images
export function generateResponsiveImageCSS(
  selector: string,
  breakpoints: Record<string, { width: string; height?: string }>,
): string {
  let css = `${selector} { width: 100%; height: auto; }\n`

  Object.entries(breakpoints).forEach(([breakpoint, dimensions]) => {
    css += `@media (min-width: ${breakpoint}) {\n`
    css += `  ${selector} {\n`
    css += `    width: ${dimensions.width};\n`
    if (dimensions.height) {
      css += `    height: ${dimensions.height};\n`
    }
    css += `  }\n`
    css += `}\n`
  })

  return css
}
