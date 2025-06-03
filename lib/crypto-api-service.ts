import type { PaymentProvider } from "@/types/payment"
import { logger } from "@/lib/logger"
import { checkBitcoinPayment, checkBitcoinConfirmations, isValidBitcoinAddress } from "@/lib/blockchain/bitcoin-service"
import {
  checkEthereumPayment,
  checkEthereumConfirmations,
  isValidEthereumAddress,
} from "@/lib/blockchain/ethereum-service"
import { checkCardanoPayment, checkCardanoConfirmations, isValidCardanoAddress } from "@/lib/blockchain/cardano-service"

// Mapping von internen Bezeichnern zu CoinGecko-IDs
const COIN_ID_MAP: Record<string, string> = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  cardano: "cardano",
}

// Mapping von internen Bezeichnern zu Währungssymbolen
const COIN_SYMBOL_MAP: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  cardano: "ADA",
}

// Mapping von internen Bezeichnern zu Netzwerknamen
export const NETWORK_NAME_MAP: Record<string, string> = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  cardano: "Cardano",
}

// Mapping von internen Bezeichnern zu geschätzten Bestätigungszeiten (in Sekunden)
export const CONFIRMATION_TIME_MAP: Record<string, number> = {
  bitcoin: 600, // ~10 Minuten
  ethereum: 15, // ~15 Sekunden
  cardano: 300, // ~5 Minuten
}

// Mapping von internen Bezeichnern zu erforderlichen Bestätigungen
export const REQUIRED_CONFIRMATIONS_MAP: Record<string, number> = {
  bitcoin: 3,
  ethereum: 1,
  cardano: 2,
}

// Schnittstelle für Kryptowährungspreisdaten
export interface CryptoPriceData {
  price: number
  lastUpdated: string
  change24h: number
}

/**
 * Überprüft, ob eine Wallet-Adresse für die angegebene Kryptowährung gültig ist
 */
export function isValidCryptoAddress(cryptoType: PaymentProvider, address: string): boolean {
  switch (cryptoType) {
    case "bitcoin":
      return isValidBitcoinAddress(address)
    case "ethereum":
      return isValidEthereumAddress(address)
    case "cardano":
      return isValidCardanoAddress(address)
    default:
      return false
  }
}

/**
 * Holt den aktuellen Preis einer Kryptowährung in der angegebenen Fiat-Währung
 */
export async function getCryptoPrice(cryptoType: PaymentProvider, currency = "eur"): Promise<CryptoPriceData | null> {
  try {
    if (!Object.keys(COIN_ID_MAP).includes(cryptoType)) {
      throw new Error(`Unsupported crypto type: ${cryptoType}`)
    }

    const coinId = COIN_ID_MAP[cryptoType]
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return {
      price: data.market_data.current_price[currency.toLowerCase()],
      lastUpdated: data.market_data.last_updated,
      change24h: data.market_data.price_change_percentage_24h,
    }
  } catch (error) {
    logger.error("Error fetching crypto price:", error)
    return null
  }
}

/**
 * Konvertiert einen Fiat-Betrag in die entsprechende Kryptowährungsmenge
 */
export async function convertFiatToCrypto(
  amount: number,
  cryptoType: PaymentProvider,
  currency = "eur",
): Promise<{ cryptoAmount: string; fiatPrice: number } | null> {
  try {
    const priceData = await getCryptoPrice(cryptoType, currency)

    if (!priceData) {
      throw new Error(`Failed to get price data for ${cryptoType}`)
    }

    const cryptoAmount = amount / priceData.price

    // Formatierung basierend auf der Kryptowährung
    // Bitcoin und Ethereum werden mit 8 Dezimalstellen angezeigt, Cardano mit 2
    const decimals = cryptoType === "cardano" ? 2 : 8

    return {
      cryptoAmount: cryptoAmount.toFixed(decimals),
      fiatPrice: priceData.price,
    }
  } catch (error) {
    logger.error("Error converting fiat to crypto:", error)
    return null
  }
}

/**
 * Generiert eine neue Wallet-Adresse für die angegebene Kryptowährung
 * In einer echten Anwendung würde dies eine Verbindung zu einem Wallet-Service oder einer Node herstellen
 */
export async function generateWalletAddress(cryptoType: PaymentProvider): Promise<string | null> {
  try {
    // In einer echten Anwendung würden Sie hier eine API aufrufen, um eine neue Adresse zu generieren
    // Für Demozwecke verwenden wir statische Adressen
    const addresses: Record<string, string> = {
      bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      ethereum: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      cardano: "addr1qxck6ztj8lqgcek5qh9zr0ypwpfj7t4xvqq8ekcn4y0xr8qmldtm5h53rz0lq0qfjxkvqh7nrya29r5y9v4nevn7masmgpv8a",
    }

    return addresses[cryptoType] || null
  } catch (error) {
    logger.error("Error generating wallet address:", error)
    return null
  }
}

/**
 * Überprüft, ob eine Transaktion für eine bestimmte Wallet-Adresse eingegangen ist
 */
export async function checkTransactionStatus(
  cryptoType: PaymentProvider,
  walletAddress: string,
  expectedAmount: string,
): Promise<{ received: boolean; transactionId?: string; confirmations?: number; amount?: string }> {
  try {
    logger.info(`Checking transaction status for ${cryptoType} address ${walletAddress}`)

    switch (cryptoType) {
      case "bitcoin":
        return await checkBitcoinPayment(walletAddress, expectedAmount)
      case "ethereum":
        return await checkEthereumPayment(walletAddress, expectedAmount)
      case "cardano":
        return await checkCardanoPayment(walletAddress, expectedAmount)
      default:
        throw new Error(`Unsupported crypto type: ${cryptoType}`)
    }
  } catch (error) {
    logger.error(`Error checking transaction status for ${cryptoType}:`, error)
    return { received: false }
  }
}

/**
 * Überprüft, ob eine Transaktion genügend Bestätigungen hat
 */
export async function checkTransactionConfirmations(
  cryptoType: PaymentProvider,
  transactionId: string,
): Promise<{ confirmed: boolean; confirmations: number }> {
  try {
    logger.info(`Checking confirmations for ${cryptoType} transaction ${transactionId}`)

    switch (cryptoType) {
      case "bitcoin":
        return await checkBitcoinConfirmations(transactionId)
      case "ethereum":
        return await checkEthereumConfirmations(transactionId)
      case "cardano":
        return await checkCardanoConfirmations(transactionId)
      default:
        throw new Error(`Unsupported crypto type: ${cryptoType}`)
    }
  } catch (error) {
    logger.error(`Error checking confirmations for ${cryptoType}:`, error)
    return { confirmed: false, confirmations: 0 }
  }
}

/**
 * Gibt das Symbol für eine Kryptowährung zurück
 */
export function getCryptoSymbol(cryptoType: PaymentProvider): string {
  return COIN_SYMBOL_MAP[cryptoType] || cryptoType.toUpperCase()
}

/**
 * Gibt den Netzwerknamen für eine Kryptowährung zurück
 */
export function getNetworkName(cryptoType: PaymentProvider): string {
  return NETWORK_NAME_MAP[cryptoType] || cryptoType
}

/**
 * Gibt die Anzahl der erforderlichen Bestätigungen für eine Kryptowährung zurück
 */
export function getRequiredConfirmations(cryptoType: PaymentProvider): number {
  return REQUIRED_CONFIRMATIONS_MAP[cryptoType] || 1
}
