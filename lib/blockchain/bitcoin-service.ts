/**
 * Bitcoin Blockchain Service
 * Verwendet die Blockstream API für Bitcoin-Transaktionen
 * https://github.com/Blockstream/esplora/blob/master/API.md
 */

import { logger } from "@/lib/logger"

// Blockstream API Basis-URL
const BLOCKSTREAM_API_BASE = "https://blockstream.info/api"

export interface BitcoinTransaction {
  txid: string
  version: number
  locktime: number
  size: number
  weight: number
  fee: number
  status: {
    confirmed: boolean
    block_height?: number
    block_hash?: string
    block_time?: number
  }
  vin: Array<{
    txid: string
    vout: number
    prevout: {
      scriptpubkey: string
      scriptpubkey_asm: string
      scriptpubkey_type: string
      scriptpubkey_address: string
      value: number
    }
    scriptsig: string
    scriptsig_asm: string
    witness?: string[]
    sequence: number
  }>
  vout: Array<{
    scriptpubkey: string
    scriptpubkey_asm: string
    scriptpubkey_type: string
    scriptpubkey_address: string
    value: number
  }>
}

export interface BitcoinAddressInfo {
  address: string
  chain_stats: {
    funded_txo_count: number
    funded_txo_sum: number
    spent_txo_count: number
    spent_txo_sum: number
    tx_count: number
  }
  mempool_stats: {
    funded_txo_count: number
    funded_txo_sum: number
    spent_txo_count: number
    spent_txo_sum: number
    tx_count: number
  }
}

export interface BitcoinAddressTransaction {
  txid: string
  version: number
  locktime: number
  vin: any[]
  vout: any[]
  size: number
  weight: number
  fee: number
  status: {
    confirmed: boolean
    block_height?: number
    block_hash?: string
    block_time?: number
  }
}

/**
 * Überprüft, ob eine Bitcoin-Adresse gültig ist
 */
export function isValidBitcoinAddress(address: string): boolean {
  // Einfache Validierung für verschiedene Bitcoin-Adressformate
  const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
  const segwitRegex = /^bc1[ac-hj-np-z02-9]{39,59}$/
  return legacyRegex.test(address) || segwitRegex.test(address)
}

/**
 * Holt Informationen zu einer Bitcoin-Adresse
 */
export async function getBitcoinAddressInfo(address: string): Promise<BitcoinAddressInfo | null> {
  try {
    if (!isValidBitcoinAddress(address)) {
      throw new Error(`Invalid Bitcoin address: ${address}`)
    }

    const response = await fetch(`${BLOCKSTREAM_API_BASE}/address/${address}`)

    if (!response.ok) {
      throw new Error(`Blockstream API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    logger.error("Error fetching Bitcoin address info:", error)
    return null
  }
}

/**
 * Holt Transaktionen für eine Bitcoin-Adresse
 */
export async function getBitcoinAddressTransactions(
  address: string,
  limit = 10,
): Promise<BitcoinAddressTransaction[] | null> {
  try {
    if (!isValidBitcoinAddress(address)) {
      throw new Error(`Invalid Bitcoin address: ${address}`)
    }

    const response = await fetch(`${BLOCKSTREAM_API_BASE}/address/${address}/txs?limit=${limit}`)

    if (!response.ok) {
      throw new Error(`Blockstream API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    logger.error("Error fetching Bitcoin address transactions:", error)
    return null
  }
}

/**
 * Holt Details zu einer Bitcoin-Transaktion
 */
export async function getBitcoinTransaction(txid: string): Promise<BitcoinTransaction | null> {
  try {
    const response = await fetch(`${BLOCKSTREAM_API_BASE}/tx/${txid}`)

    if (!response.ok) {
      throw new Error(`Blockstream API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    logger.error("Error fetching Bitcoin transaction:", error)
    return null
  }
}

/**
 * Überprüft, ob eine Transaktion für eine bestimmte Adresse eingegangen ist
 * und ob der Betrag mindestens dem erwarteten Betrag entspricht
 */
export async function checkBitcoinPayment(
  address: string,
  expectedAmount: string,
): Promise<{ received: boolean; transactionId?: string; confirmations?: number; amount?: string }> {
  try {
    if (!isValidBitcoinAddress(address)) {
      throw new Error(`Invalid Bitcoin address: ${address}`)
    }

    // Konvertiere den erwarteten Betrag in Satoshis (1 BTC = 100,000,000 Satoshis)
    const expectedSatoshis = Math.floor(Number.parseFloat(expectedAmount) * 100000000)

    // Hole die letzten Transaktionen für diese Adresse
    const transactions = await getBitcoinAddressTransactions(address, 5)

    if (!transactions || transactions.length === 0) {
      return { received: false }
    }

    // Suche nach einer unbestätigten oder kürzlich bestätigten Transaktion mit dem richtigen Betrag
    for (const tx of transactions) {
      // Überprüfe die Ausgaben (vout) der Transaktion
      for (const output of tx.vout) {
        if (
          output.scriptpubkey_address === address &&
          output.value >= expectedSatoshis - 1000 // Toleranz für Gebühren
        ) {
          // Transaktion gefunden
          const confirmations = tx.status.confirmed ? 1 : 0 // Vereinfacht, in Wirklichkeit würden wir die aktuelle Blockhöhe abfragen

          return {
            received: true,
            transactionId: tx.txid,
            confirmations,
            amount: (output.value / 100000000).toString(), // Konvertiere zurück zu BTC
          }
        }
      }
    }

    return { received: false }
  } catch (error) {
    logger.error("Error checking Bitcoin payment:", error)
    return { received: false }
  }
}

/**
 * Überprüft die Anzahl der Bestätigungen für eine Bitcoin-Transaktion
 */
export async function checkBitcoinConfirmations(txid: string): Promise<{ confirmed: boolean; confirmations: number }> {
  try {
    const transaction = await getBitcoinTransaction(txid)

    if (!transaction) {
      return { confirmed: false, confirmations: 0 }
    }

    // Wenn die Transaktion bestätigt ist, berechne die Anzahl der Bestätigungen
    if (transaction.status.confirmed && transaction.status.block_height) {
      // In einer echten Implementierung würden wir die aktuelle Blockhöhe abfragen
      // und die Differenz berechnen. Für diese Demo verwenden wir einen festen Wert.
      const currentBlockHeight = transaction.status.block_height + 3 // Simuliere 3 Blöcke seit der Bestätigung
      const confirmations = currentBlockHeight - transaction.status.block_height + 1

      return {
        confirmed: confirmations >= 3, // Bitcoin-Zahlungen gelten typischerweise nach 3 Bestätigungen als sicher
        confirmations,
      }
    }

    return { confirmed: false, confirmations: 0 }
  } catch (error) {
    logger.error("Error checking Bitcoin confirmations:", error)
    return { confirmed: false, confirmations: 0 }
  }
}
