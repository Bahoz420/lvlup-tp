/**
 * Ethereum Blockchain Service
 * Verwendet die Etherscan API für Ethereum-Transaktionen
 * https://docs.etherscan.io/
 */

import { logger } from "@/lib/logger"

// Etherscan API Konfiguration
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const ETHERSCAN_API_BASE = "https://api.etherscan.io/api"

// Etherscan API Endpunkte
const ETHERSCAN_ENDPOINTS = {
  ACCOUNT_BALANCE: "?module=account&action=balance",
  ACCOUNT_TRANSACTIONS: "?module=account&action=txlist",
  TRANSACTION: "?module=proxy&action=eth_getTransactionByHash",
  TRANSACTION_RECEIPT: "?module=proxy&action=eth_getTransactionReceipt",
  GAS_PRICE: "?module=proxy&action=eth_gasPrice",
  CURRENT_BLOCK: "?module=proxy&action=eth_blockNumber",
}

export interface EthereumTransaction {
  hash: string
  nonce: string
  blockHash: string | null
  blockNumber: string | null
  transactionIndex: string | null
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  input: string
  v: string
  r: string
  s: string
}

export interface EthereumTransactionReceipt {
  transactionHash: string
  transactionIndex: string
  blockHash: string
  blockNumber: string
  from: string
  to: string
  cumulativeGasUsed: string
  gasUsed: string
  contractAddress: string | null
  logs: any[]
  logsBloom: string
  status: string
}

export interface EthereumAccountTransaction {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  transactionIndex: string
  from: string
  to: string
  value: string
  gas: string
  gasPrice: string
  isError: string
  txreceipt_status: string
  input: string
  contractAddress: string
  cumulativeGasUsed: string
  gasUsed: string
  confirmations: string
}

/**
 * Überprüft, ob eine Ethereum-Adresse gültig ist
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Holt den Kontostand einer Ethereum-Adresse
 */
export async function getEthereumBalance(address: string): Promise<string | null> {
  try {
    if (!isValidEthereumAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`)
    }

    const url = `${ETHERSCAN_API_BASE}${ETHERSCAN_ENDPOINTS.ACCOUNT_BALANCE}&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== "1") {
      throw new Error(`Etherscan API error: ${data.message}`)
    }

    // Konvertiere von Wei zu Ether (1 Ether = 10^18 Wei)
    return (Number.parseInt(data.result) / 1e18).toString()
  } catch (error) {
    logger.error("Error fetching Ethereum balance:", error)
    return null
  }
}

/**
 * Holt Transaktionen für eine Ethereum-Adresse
 */
export async function getEthereumTransactions(
  address: string,
  startBlock = 0,
  endBlock = 99999999,
  page = 1,
  offset = 10,
): Promise<EthereumAccountTransaction[] | null> {
  try {
    if (!isValidEthereumAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`)
    }

    const url = `${ETHERSCAN_API_BASE}${ETHERSCAN_ENDPOINTS.ACCOUNT_TRANSACTIONS}&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.status !== "1" && data.message !== "No transactions found") {
      throw new Error(`Etherscan API error: ${data.message}`)
    }

    return data.result || []
  } catch (error) {
    logger.error("Error fetching Ethereum transactions:", error)
    return null
  }
}

/**
 * Holt Details zu einer Ethereum-Transaktion
 */
export async function getEthereumTransaction(txHash: string): Promise<EthereumTransaction | null> {
  try {
    const url = `${ETHERSCAN_API_BASE}${ETHERSCAN_ENDPOINTS.TRANSACTION}&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Etherscan API error: ${data.error.message}`)
    }

    return data.result
  } catch (error) {
    logger.error("Error fetching Ethereum transaction:", error)
    return null
  }
}

/**
 * Holt die Quittung einer Ethereum-Transaktion
 */
export async function getEthereumTransactionReceipt(txHash: string): Promise<EthereumTransactionReceipt | null> {
  try {
    const url = `${ETHERSCAN_API_BASE}${ETHERSCAN_ENDPOINTS.TRANSACTION_RECEIPT}&txhash=${txHash}&apikey=${ETHERSCAN_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Etherscan API error: ${data.error.message}`)
    }

    return data.result
  } catch (error) {
    logger.error("Error fetching Ethereum transaction receipt:", error)
    return null
  }
}

/**
 * Holt die aktuelle Blocknummer
 */
export async function getCurrentBlockNumber(): Promise<number | null> {
  try {
    const url = `${ETHERSCAN_API_BASE}${ETHERSCAN_ENDPOINTS.CURRENT_BLOCK}&apikey=${ETHERSCAN_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Etherscan API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(`Etherscan API error: ${data.error.message}`)
    }

    // Konvertiere von Hex zu Dezimal
    return Number.parseInt(data.result, 16)
  } catch (error) {
    logger.error("Error fetching current block number:", error)
    return null
  }
}

/**
 * Überprüft, ob eine Transaktion für eine bestimmte Adresse eingegangen ist
 * und ob der Betrag mindestens dem erwarteten Betrag entspricht
 */
export async function checkEthereumPayment(
  address: string,
  expectedAmount: string,
): Promise<{ received: boolean; transactionId?: string; confirmations?: number; amount?: string }> {
  try {
    if (!isValidEthereumAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`)
    }

    // Konvertiere den erwarteten Betrag in Wei (1 Ether = 10^18 Wei)
    const expectedWei = BigInt(Math.floor(Number.parseFloat(expectedAmount) * 1e18))

    // Hole die letzten Transaktionen für diese Adresse
    const transactions = await getEthereumTransactions(address, 0, 99999999, 1, 5)

    if (!transactions || transactions.length === 0) {
      return { received: false }
    }

    // Suche nach einer Transaktion mit dem richtigen Betrag
    for (const tx of transactions) {
      if (
        tx.to.toLowerCase() === address.toLowerCase() &&
        BigInt(tx.value) >= expectedWei - BigInt(1e16) // Toleranz für Gebühren
      ) {
        // Transaktion gefunden
        const confirmations = Number.parseInt(tx.confirmations)

        return {
          received: true,
          transactionId: tx.hash,
          confirmations,
          amount: (Number.parseInt(tx.value) / 1e18).toString(), // Konvertiere zurück zu Ether
        }
      }
    }

    return { received: false }
  } catch (error) {
    logger.error("Error checking Ethereum payment:", error)
    return { received: false }
  }
}

/**
 * Überprüft die Anzahl der Bestätigungen für eine Ethereum-Transaktion
 */
export async function checkEthereumConfirmations(
  txHash: string,
): Promise<{ confirmed: boolean; confirmations: number }> {
  try {
    // Hole die Transaktionsdetails
    const receipt = await getEthereumTransactionReceipt(txHash)

    if (!receipt || !receipt.blockNumber) {
      return { confirmed: false, confirmations: 0 }
    }

    // Hole die aktuelle Blocknummer
    const currentBlock = await getCurrentBlockNumber()

    if (currentBlock === null) {
      throw new Error("Failed to get current block number")
    }

    // Berechne die Anzahl der Bestätigungen
    const txBlock = Number.parseInt(receipt.blockNumber, 16)
    const confirmations = currentBlock - txBlock + 1

    return {
      confirmed: confirmations >= 1, // Ethereum-Zahlungen gelten typischerweise nach 1 Bestätigung als sicher
      confirmations,
    }
  } catch (error) {
    logger.error("Error checking Ethereum confirmations:", error)
    return { confirmed: false, confirmations: 0 }
  }
}
