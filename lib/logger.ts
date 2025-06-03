/**
 * Logger Service
 * Bietet einheitliche Logging-Funktionen für die Anwendung
 */

type LogLevel = "debug" | "info" | "warn" | "error"

interface LoggerOptions {
  level: LogLevel
  prefix?: string
  enableConsole?: boolean
}

class Logger {
  private level: LogLevel
  private prefix: string
  private enableConsole: boolean

  constructor(options: LoggerOptions) {
    this.level = options.level
    this.prefix = options.prefix || ""
    this.enableConsole = options.enableConsole !== undefined ? options.enableConsole : true
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }

    return levels[level] >= levels[this.level]
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString()
    const prefix = this.prefix ? `[${this.prefix}]` : ""
    const formattedMessage = `${timestamp} ${level.toUpperCase()} ${prefix} ${message}`

    if (args.length > 0) {
      return `${formattedMessage} ${args.map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg)).join(" ")}`
    }

    return formattedMessage
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog("debug")) {
      const formattedMessage = this.formatMessage("debug", message, ...args)
      if (this.enableConsole) {
        console.debug(formattedMessage)
      }
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog("info")) {
      const formattedMessage = this.formatMessage("info", message, ...args)
      if (this.enableConsole) {
        console.info(formattedMessage)
      }
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog("warn")) {
      const formattedMessage = this.formatMessage("warn", message, ...args)
      if (this.enableConsole) {
        console.warn(formattedMessage)
      }
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog("error")) {
      const formattedMessage = this.formatMessage("error", message, ...args)
      if (this.enableConsole) {
        console.error(formattedMessage)
      }
    }
  }
}

// Erstelle eine Instanz des Loggers mit Standardeinstellungen
export const logger = new Logger({
  level: (process.env.LOG_LEVEL as LogLevel) || "info",
  prefix: "CRYPTO-API",
  enableConsole: process.env.NODE_ENV !== "production",
})
