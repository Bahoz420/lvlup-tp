// Hilfsfunktionen für JavaScript-Optimierung

// Dynamisches Importieren von JavaScript-Modulen
export function loadModuleWhenNeeded(modulePath: string, condition: () => boolean): Promise<any> {
  return new Promise((resolve) => {
    if (condition()) {
      import(modulePath).then(resolve)
    } else {
      // Beobachter einrichten, um das Modul zu laden, wenn die Bedingung erfüllt ist
      const checkCondition = () => {
        if (condition()) {
          import(modulePath).then(resolve)
          clearInterval(intervalId)
        }
      }

      const intervalId = setInterval(checkCondition, 100)
    }
  })
}

// Verzögertes Laden von JavaScript
export function deferScript(src: string, priority = "low"): void {
  if (typeof window === "undefined") return

  const script = document.createElement("script")
  script.src = src
  script.defer = true
  script.fetchPriority = priority as any

  // Füge das Script am Ende des Body hinzu
  document.body.appendChild(script)
}

// Verzögertes Ausführen von Code
export function runWhenIdle(callback: () => void, timeout = 2000): void {
  if (typeof window === "undefined") return

  if ("requestIdleCallback" in window) {
    ;(window as any).requestIdleCallback(callback, { timeout })
  } else {
    // Fallback für Browser ohne requestIdleCallback
    setTimeout(callback, 200)
  }
}

// Code ausführen, wenn der Benutzer mit der Seite interagiert
export function runOnUserInteraction(callback: () => void): void {
  if (typeof window === "undefined") return

  const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]

  const handler = () => {
    callback()
    events.forEach((event) => window.removeEventListener(event, handler))
  }

  events.forEach((event) => window.addEventListener(event, handler, { once: true, passive: true }))
}
