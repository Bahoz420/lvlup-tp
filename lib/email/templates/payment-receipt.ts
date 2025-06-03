import type { EmailTemplateRenderer } from "@/types/email"

export const paymentReceiptTemplate: EmailTemplateRenderer = (data) => {
  const { orderId, amount, paymentMethod, transactionId, date, supportEmail } = data

  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Receipt</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #10b981;
          padding: 20px;
          text-align: center;
          color: white;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
        }
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .receipt {
          background-color: white;
          padding: 15px;
          margin-top: 20px;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .receipt-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .receipt-row:last-child {
          border-bottom: none;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #10b981;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Receipt</h1>
        </div>
        <div class="content">
          <p>Thank you for your payment!</p>
          <p>We're pleased to confirm that your payment has been processed successfully.</p>
          
          <div class="receipt">
            <h2>Payment Details</h2>
            <div class="receipt-row">
              <span>Order ID:</span>
              <span>${orderId}</span>
            </div>
            <div class="receipt-row">
              <span>Date:</span>
              <span>${formattedDate}</span>
            </div>
            <div class="receipt-row">
              <span>Payment Method:</span>
              <span>${paymentMethod}</span>
            </div>
            <div class="receipt-row">
              <span>Transaction ID:</span>
              <span>${transactionId}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Amount:</strong></span>
              <span><strong>${formattedAmount}</strong></span>
            </div>
          </div>
          
          <p>You can view your order details and download your products by clicking the button below:</p>
          <a href="https://lvlup.io/dashboard" class="button">View Order</a>
          
          <p>If you have any questions about your payment, please contact our support team at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} lvlup.io. All rights reserved.</p>
          <p>This email was sent to confirm your recent payment.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
