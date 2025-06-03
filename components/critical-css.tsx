// Kritisches CSS für die Startseite
const homepageCriticalCSS = `
  /* Kritisches CSS für die Startseite */
  .hero-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    background: linear-gradient(to right, #0f172a, #1e293b);
    color: white;
    padding: 2rem;
  }
  
  .hero-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    text-align: center;
    max-width: 800px;
  }
  
  .cta-button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    border-radius: 0.375rem;
    text-decoration: none;
    transition: background-color 0.2s;
  }
  
  .cta-button:hover {
    background-color: #2563eb;
  }
  
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 2rem;
  }
  
  .product-card {
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    background-color: white;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
    }
    
    .product-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
`

// Kritisches CSS für Produktseiten
const productPageCriticalCSS = `
  /* Kritisches CSS für Produktseiten */
  .product-container {
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .product-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
  }
  
  .product-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .product-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #3b82f6;
    margin-bottom: 1rem;
  }
  
  .product-description {
    font-size: 1.125rem;
    line-height: 1.75;
    margin-bottom: 2rem;
  }
  
  .product-image {
    width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }
  
  .add-to-cart-button {
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .add-to-cart-button:hover {
    background-color: #2563eb;
  }
  
  @media (min-width: 768px) {
    .product-container {
      flex-direction: row;
      gap: 2rem;
    }
    
    .product-image-container {
      flex: 1;
    }
    
    .product-details {
      flex: 1;
    }
  }
`

// Kritisches CSS für die Navigation
const navigationCriticalCSS = `
  /* Kritisches CSS für die Navigation */
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 50;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #0f172a;
    text-decoration: none;
  }
  
  .nav-links {
    display: flex;
    gap: 1.5rem;
  }
  
  .nav-link {
    color: #1e293b;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .nav-link:hover {
    color: #3b82f6;
  }
  
  .mobile-menu-button {
    display: none;
  }
  
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    
    .mobile-menu-button {
      display: block;
    }
  }
`

// Kritisches CSS für den Footer
const footerCriticalCSS = `
  /* Kritisches CSS für den Footer */
  .footer {
    background-color: #0f172a;
    color: white;
    padding: 2rem;
    margin-top: 2rem;
  }
  
  .footer-content {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .footer-section {
    flex: 1;
    min-width: 200px;
  }
  
  .footer-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .footer-link {
    color: #cbd5e1;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .footer-link:hover {
    color: white;
  }
  
  .footer-bottom {
    margin-top: 2rem;
    text-align: center;
    color: #94a3b8;
    font-size: 0.875rem;
  }
`

// Kombiniere alle kritischen CSS-Stile
const allCriticalCSS = `
  ${navigationCriticalCSS}
  ${homepageCriticalCSS}
  ${productPageCriticalCSS}
  ${footerCriticalCSS}
`

interface CriticalCSSProps {
  page?: "home" | "product" | "all"
}

export function CriticalCSS({ page = "all" }: CriticalCSSProps) {
  // Wähle das entsprechende CSS basierend auf der Seite
  let css = ""

  switch (page) {
    case "home":
      css = `${navigationCriticalCSS}${homepageCriticalCSS}${footerCriticalCSS}`
      break
    case "product":
      css = `${navigationCriticalCSS}${productPageCriticalCSS}${footerCriticalCSS}`
      break
    case "all":
    default:
      css = allCriticalCSS
      break
  }

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
