import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCryptoSymbol, getNetworkName } from "@/lib/crypto-api-service"
import { ExternalLink } from "lucide-react"
import type { PaymentProvider } from "@/types/payment"

interface TransactionDetailsProps {
  provider: PaymentProvider
  transactionId: string
  amount: string
  confirmations: number
  timestamp?: string
}

export function TransactionDetails({
  provider,
  transactionId,
  amount,
  confirmations,
  timestamp,
}: TransactionDetailsProps) {
  const cryptoSymbol = getCryptoSymbol(provider)
  const networkName = getNetworkName(provider)

  const getExplorerUrl = () => {
    switch (provider) {
      case "bitcoin":
        return `https://blockstream.info/tx/${transactionId}`
      case "ethereum":
        return `https://etherscan.io/tx/${transactionId}`
      case "cardano":
        return `https://cardanoscan.io/transaction/${transactionId}`
      default:
        return null
    }
  }

  const explorerUrl = getExplorerUrl()
  const formattedTimestamp = timestamp ? new Date(timestamp).toLocaleString() : "N/A"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{networkName} Transaction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-500">Transaction ID</div>
          <div className="font-mono text-sm break-all">{transactionId}</div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">Amount</div>
          <div className="font-medium">
            {amount} {cryptoSymbol}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">Confirmations</div>
          <div className="font-medium">{confirmations}</div>
        </div>

        <div>
          <div className="text-sm font-medium text-gray-500">Timestamp</div>
          <div className="font-medium">{formattedTimestamp}</div>
        </div>

        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-purple-600 flex items-center hover:underline"
          >
            View on Blockchain Explorer
            <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        )}
      </CardContent>
    </Card>
  )
}
