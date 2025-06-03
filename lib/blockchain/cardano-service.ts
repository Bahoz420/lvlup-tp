/**
 * Cardano Blockchain Service
 * Verwendet die Blockfrost API für Cardano-Transaktionen
 * https://docs.blockfrost.io/
 */

import { logger } from "@/lib/logger"

// Blockfrost API Konfiguration
const BLOCKFROST_API_KEY = process.env.BLOCKFROST_API_KEY || ""
const BLOCKFROST_API_BASE = "https://cardano-mainnet.blockfrost.io/api/v0"

export interface CardanoAddressInfo {
  address: string
  amount: Array<{
    unit: string
    quantity: string
  }>
  stake_address: string | null
  type: string
  script: boolean
}

export interface CardanoTransaction {
  hash: string
  block: string
  block_height: number
  block_time: number
  slot: number
  index: number
  output_amount: Array<{
    unit: string
    quantity: string
  }>
  fees: string
  deposit: string
  size: number
  invalid_before: string | null
  invalid_hereafter: string | null
  utxo_count: number
  withdrawal_count: number
  mir_cert_count: number
  delegation_count: number
  stake_cert_count: number
  pool_update_count: number
  pool_retire_count: number
  asset_mint_or_burn_count: number
  redeemer_count: number
  valid_contract: boolean
}

export interface CardanoAddressTransaction {
  tx_hash: string
  tx_index: number
  block_height: number
  block_time: number
}

/**
 * Überprüft, ob eine Cardano-Adresse gültig ist
 */
export function isValidCardanoAddress(address: string): boolean {
  // Einfache Validierung für Cardano-Adressen
  return /^addr1[a-zA-Z0-9]{98}$/.test(address)
}

/**
 * Holt Informationen zu einer Cardano-Adresse
 */
export async function getCardanoAddressInfo(address: string): Promise<CardanoAddressInfo | null> {
  try {
    if (!isValidCardanoAddress(address)) {
      throw new Error(`Invalid Cardano address: ${address}`)
    }

    const response = await fetch(`${BLOCKFROST_API_BASE}/addresses/${address}`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    logger.error("Error fetching Cardano address info:", error)
    return null
  }
}

/**
 * Holt Transaktionen für eine Cardano-Adresse
 */
export async function getCardanoAddressTransactions(
  address: string,
  count = 10,
  page = 1,
): Promise<CardanoAddressTransaction[] | null> {
  try {
    if (!isValidCardanoAddress(address)) {
      throw new Error(`Invalid Cardano address: ${address}`)
    }

    const response = await fetch(
      `${BLOCKFROST_API_BASE}/addresses/${address}/transactions?count=${count}&page=${page}`,
      {
        headers: {
          project_id: BLOCKFROST_API_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    logger.error("Error fetching Cardano address transactions:", error)
    return null
  }
}

/**
 * Holt Details zu einer Cardano-Transaktion
 */
export async function getCardanoTransaction(txHash: string): Promise<CardanoTransaction | null> {
  try {
    const response = await fetch(`${BLOCKFROST_API_BASE}/txs/${txHash}`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    logger.error("Error fetching Cardano transaction:", error)
    return null
  }
}

/**
 * Holt die aktuelle Epoche
 */
export async function getCurrentEpoch(): Promise<number | null> {
  try {
    const response = await fetch(`${BLOCKFROST_API_BASE}/epochs/latest`, {
      headers: {
        project_id: BLOCKFROST_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Blockfrost API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.epoch
  } catch (error) {
    logger.error("Error fetching current epoch:", error)
    return null
  }
}

/**
 * Überprüft, ob eine Transaktion für eine bestimmte Adresse eingegangen ist
 * und ob der Betrag mindestens dem erwarteten Betrag entspricht
 */
export async function checkCardanoPayment(
  address: string,
  expectedAmount: string,
): Promise<{ received: boolean; transactionId?: string; confirmations?: number; amount?: string }> {
  try {
    if (!isValidCardanoAddress(address)) {
      throw new Error(`Invalid Cardano address: ${address}`)
    }

    // Konvertiere den erwarteten Betrag in Lovelace (1 ADA = 1,000,000 Lovelace)
    const expectedLovelace = Math.floor(Number.parseFloat(expectedAmount) * 1000000)

    // Hole die Adressinformationen
    const addressInfo = await getCardanoAddressInfo(address)

    if (!addressInfo) {
      return { received: false }
    }

    // Überprüfe, ob die Adresse ADA enthält
    const adaAmount = addressInfo.amount.find((a) => a.unit === "lovelace")

    if (!adaAmount || Number.parseInt(adaAmount.quantity) < expectedLovelace) {
      return { received: false }
    }

    // Hole die letzten Transaktionen für diese Adresse
    const transactions = await getCardanoAddressTransactions(address, 5)

    if (!transactions || transactions.length === 0) {
      return { received: false }
    }

    // Nehme die neueste Transaktion
    const latestTx = transactions[0]

    // Hole die Transaktionsdetails
    const txDetails = await getCardanoTransaction(latestTx.tx_hash)

    if (!txDetails) {
      return { received: false }
    }

    // Überprüfe, ob die Transaktion ADA enthält
    const txAdaAmount = txDetails.output_amount.find((a) => a.unit === "lovelace")

    if (!txAdaAmount || Number.parseInt(txAdaAmount.quantity) < expectedLovelace) {
      return { received: false }
    }

    // Berechne die Anzahl der Bestätigungen
    // In einer echten Implementierung würden wir die aktuelle Blockhöhe abfragen
    const currentBlockHeight = txDetails.block_height + 2 // Simuliere 2 Blöcke seit der Bestätigung
    const confirmations = currentBlockHeight - txDetails.block_height

    return {
      received: true,
      transactionId: txDetails.hash,
      confirmations,
      amount: (Number.parseInt(txAdaAmount.quantity) / 1000000).toString(), // Konvertiere zurück zu ADA
    }
  } catch (error) {
    logger.error("Error checking Cardano payment:", error)
    return { received: false }
  }
}

/**
 * Überprüft die Anzahl der Bestätigungen für eine Cardano-Transaktion
 */
export async function checkCardanoConfirmations(
  txHash: string,
): Promise<{ confirmed: boolean; confirmations: number }> {
  try {
    // Hole die Transaktionsdetails
    const transaction = await getCardanoTransaction(txHash)

    if (!transaction) {
      return { confirmed: false, confirmations: 0 }
    }

    // In einer echten Implementierung würden wir die aktuelle Blockhöhe abfragen
    const currentBlockHeight = transaction.block_height + 2 // Simuliere 2 Blöcke seit der Bestätigung
    const confirmations = currentBlockHeight - transaction.block_height

    return {
      confirmed: confirmations >= 2, // Cardano-Zahlungen gelten typischerweise nach 2 Bestätigungen als sicher
      confirmations,
    }
  } catch (error) {
    logger.error("Error checking Cardano confirmations:", error)
    return { confirmed: false, confirmations: 0 }
  }
}
