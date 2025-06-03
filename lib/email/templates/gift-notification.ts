import type { EmailTemplateRenderer } from "@/types/email"

interface GiftNotificationData {
  to: string // Recipient's email, for context, not usually displayed directly in template body
  fromName: string
  products: Array<{
    name: string
    description?: string
    // Potentially add image_url if desired in email
  }>
  message?: string
  // These should be passed from emailService
  siteUrl: string // e.g., https://lvlup.io
  claimGiftUrl: string // e.g., https://lvlup.io/claim-gift (could include a token later)
  supportEmail: string // e.g., support@lvlup.io
}

export const giftNotificationTemplate: EmailTemplateRenderer<GiftNotificationData> = (data) => {
  const { fromName, products, message, siteUrl, claimGiftUrl, supportEmail } = data

  const productsList = products
    .map(
      (product) => `
    <div style="background-color: #ffffff; padding: 15px; margin-bottom: 10px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <h3 style="margin-top: 0; margin-bottom: 5px; font-size: 18px; color: #333;">${product.name}</h3>
      ${product.description ? `<p style="margin: 0; font-size: 14px; color: #555;">${product.description}</p>` : ""}
    </div>
  `,
    )
    .join("")

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Du hast ein Geschenk erhalten!</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .header { background-color: #ec4899; /* Pink */ color: #ffffff; padding: 30px 20px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { padding: 30px; }
    .content p { margin-bottom: 15px; font-size: 16px; }
    .message-box { background-color: #fdf2f8; /* Light pink */ border-left: 4px solid #ec4899; /* Pink */ padding: 15px 20px; margin: 25px 0; border-radius: 4px; }
    .message-box p { margin: 0; font-style: italic; }
    .products-section h2 { font-size: 20px; color: #ec4899; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .button-container { text-align: center; margin: 30px 0; }
    .button { display: inline-block; background-color: #ec4899; /* Pink */ color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-size: 16px; font-weight: bold; transition: background-color 0.3s ease; }
    .button:hover { background-color: #d03d83; /* Darker Pink */ }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
    .footer a { color: #ec4899; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ein Geschenk für Dich!</h1>
    </div>
    <div class="content">
      <p>Hallo!</p>
      <p><strong>${fromName}</strong> hat Dir ein Geschenk von <a href="${siteUrl}" style="color: #ec4899; text-decoration: none;">lvlup.io</a> geschickt!</p>
      
      ${
        message
          ? `
      <div class="message-box">
        <p>"${message}"</p>
        <p style="text-align: right; margin-top: 10px;"><em>– ${fromName}</em></p>
      </div>`
          : ""
      }
      
      <div class="products-section">
        <h2>Dein Geschenk beinhaltet:</h2>
        ${productsList}
      </div>
      
      <p>Um Dein Geschenk einzulösen und ggf. Deinen Account einzurichten, klicke einfach auf den Button unten:</p>
      <div class="button-container">
        <a href="${claimGiftUrl}" class="button">Geschenk jetzt einlösen</a>
      </div>
      
      <p>Falls Du Fragen zu Deinem Geschenk hast oder Hilfe benötigst, kontaktiere bitte unseren Support unter <a href="mailto:${supportEmail}" style="color: #ec4899; text-decoration: none;">${supportEmail}</a>.</p>
      <p>Viel Spaß damit!</p>
      <p>Dein lvlup.io Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} lvlup.io. Alle Rechte vorbehalten.</p>
      <p><a href="${siteUrl}/terms">Nutzungsbedingungen</a> | <a href="${siteUrl}/privacy">Datenschutz</a></p>
    </div>
  </div>
</body>
</html>
  `
}
