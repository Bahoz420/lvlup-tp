import Script from "next/script"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  rating?: number
  review_count?: number
  slug: string
}

interface ProductsStructuredDataProps {
  products: Product[]
}

export function ProductsStructuredData({ products }: ProductsStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gaming Software Products",
    description: "Premium gaming software and cheats for CS2, Valorant, Fortnite and more",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "SoftwareApplication",
          name: product.name,
          description: product.description,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
          image: `${process.env.NEXT_PUBLIC_SITE_URL}${product.image_url}`,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "LvlUp",
            },
          },
          ...(product.rating &&
            product.review_count && {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.review_count,
                bestRating: 5,
                worstRating: 1,
              },
            }),
          applicationCategory: "GameApplication",
          operatingSystem: "Windows",
        },
      })),
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: process.env.NEXT_PUBLIC_SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Products",
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
        },
      ],
    },
  }

  return (
    <Script
      id="products-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
