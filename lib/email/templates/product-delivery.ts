import type { EmailTemplateDataProductDelivery, EmailTemplateRenderer } from "@/types/email"

export const productDeliveryTemplate: EmailTemplateRenderer<EmailTemplateDataProductDelivery> = (data) => {
  const { orderId, products, expiryHours, date, supportEmail, siteUrl, customerName } = data

  const formattedDate = new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const productsList = products
    .map(
      (product) => `
    <div class="product">
      <h3>${product.name}</h3>
      ${product.description ? `<p>${product.description}</p>` : ""}
      ${
        product.activationCode
          ? `<p><strong>Activation Code:</strong> <code class="activation-code">${product.activationCode}</code></p>`
          : ""
      }
      ${
        product.downloadLink
          ? `<a href="${product.downloadLink}" class="download-button">Download Now</a>`
          : "<p><em>No direct download for this item. Access via your account.</em></p>"
      }
    </div>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Products Are Ready</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; border: 1px solid #dddddd; }
        .header { background-color: #3b82f6; padding: 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .content h2 { color: #3b82f6; }
        .product { background-color: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 5px; border: 1px solid #eeeeee; }
        .product h3 { margin-top: 0; color: #333333; }
        .activation-code { background-color: #e0e0e0; padding: 3px 6px; border-radius: 3px; font-family: monospace; }
        .download-button { display: inline-block; padding: 10px 15px; background-color: #3b82f6; color: white !important; text-decoration: none; border-radius: 5px; margin-top: 10px; }
        .warning { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px 15px; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; background-color: #f9f9f9; border-top: 1px solid #dddddd;}
        .footer a { color: #3b82f6; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Products Are Ready!</h1>
        </div>
        <div class="content">
          <p>Hello ${customerName || "Valued Customer"},</p>
          <p>Thank you for your purchase! Your products are now ready. Please find the details below:</p>
          
          ${
            expiryHours
              ? `<div class="warning">
                  <p><strong>Important:</strong> If applicable, download links may expire in ${expiryHours} hours for security reasons. Please access your products as soon as possible.</p>
                 </div>`
              : ""
          }
          
          <h2>Your Products - Order #${orderId}</h2>
          ${productsList}
          
          <p><strong>Purchase Date:</strong> ${formattedDate}</p>
          
          <p>You can also access your purchased products and manage your account anytime from your dashboard:</p>
          <p style="text-align: center;">
            <a href="${siteUrl}/dashboard" class="download-button" style="background-color: #2563eb;">Go to Dashboard</a>
          </p>
          
          <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
          <p>Thank you for choosing us!</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} lvlup.io. All rights reserved.</p>
          <p><a href="${siteUrl}/terms">Terms of Service</a> | <a href="${siteUrl}/privacy">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>
  `
}
