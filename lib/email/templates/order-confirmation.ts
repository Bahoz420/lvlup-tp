import type { EmailTemplateRenderer } from "@/types/email"

export const orderConfirmationTemplate: EmailTemplateRenderer = (data) => {
  const { orderId, products, total, paymentMethod, date, supportEmail } = data

  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total)

  const productsList = products
    .map(
      (product: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e1e1e1;">${product.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e1e1e1;">${product.subscription}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e1e1e1; text-align: right;">${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.price)}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
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
          background-color: #7c3aed;
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
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background-color: #f1f1f1;
          padding: 12px;
          text-align: left;
        }
        .order-summary {
          background-color: white;
          padding: 15px;
          margin-top: 20px;
          border-radius: 5px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #7c3aed;
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
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Thank you for your order!</p>
          <p>We're pleased to confirm that we've received your order.</p>
          
          <div class="order-summary">
            <h2>Order Summary</h2>
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            
            <h3>Products</h3>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Subscription</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${productsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 12px; text-align: right;"><strong>${formattedTotal}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p>You can view your order details and download your products by clicking the button below:</p>
          <a href="https://lvlup.io/dashboard" class="button">View Order</a>
          
          <p>If you have any questions about your order, please contact our support team at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} lvlup.io. All rights reserved.</p>
          <p>This email was sent to confirm your recent order.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
