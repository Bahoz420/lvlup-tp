"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ProductReview } from "@/types/product"

// Fetcher-Funktion für SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface DynamicReviewsProps {
  productId: string
  initialReviews: ProductReview[]
}

export function DynamicReviews({ productId, initialReviews }: DynamicReviewsProps) {
  // SWR für Echtzeit-Updates mit mittleren Revalidierungsintervallen
  const { data, error, mutate } = useSWR(`/api/reviews?productId=${productId}`, fetcher, {
    refreshInterval: 300000, // Alle 5 Minuten aktualisieren
    revalidateOnFocus: true, // Bei Fokuswechsel aktualisieren
    fallbackData: { reviews: initialReviews },
  })

  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState(0)
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews || [])

  // Aktualisiere die Bewertungen, wenn sich die Daten ändern
  useEffect(() => {
    if (data?.reviews) {
      let sortedReviews = [...data.reviews]

      // Filtere nach Bewertung
      if (filterRating > 0) {
        sortedReviews = sortedReviews.filter((review) => review.rating === filterRating)
      }

      // Sortiere nach ausgewähltem Kriterium
      switch (sortBy) {
        case "newest":
          sortedReviews.sort(
            (a, b) =>
              new Date(b.date || b.created_at || "").getTime() - new Date(a.date || a.created_at || "").getTime(),
          )
          break
        case "oldest":
          sortedReviews.sort(
            (a, b) =>
              new Date(a.date || a.created_at || "").getTime() - new Date(b.date || b.created_at || "").getTime(),
          )
          break
        case "highest":
          sortedReviews.sort((a, b) => b.rating - a.rating)
          break
        case "lowest":
          sortedReviews.sort((a, b) => a.rating - b.rating)
          break
      }

      setReviews(sortedReviews)
    }
  }, [data?.reviews, sortBy, filterRating]) // Spezifische Dependencies

  // Berechne die durchschnittliche Bewertung
  const averageRating =
    reviews && reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length : 0

  if (error) {
    return <div className="text-red-500">Error loading reviews. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-800">Customer Reviews ({reviews?.length || 0})</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(averageRating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-muted stroke-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{averageRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-purple-300 rounded-md text-sm text-gray-900 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>

        <select
          className="px-3 py-1 bg-white/90 backdrop-blur-sm border border-purple-300 rounded-md text-sm text-gray-900 shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={filterRating}
          onChange={(e) => setFilterRating(Number(e.target.value))}
        >
          <option value="0">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border border-purple-100 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-purple-800">{review.user_name}</h3>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted stroke-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-purple-500">{new Date(review.date || "").toLocaleDateString()}</span>
              </div>
              <p className="mt-2 text-white">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-purple-600">No reviews match your filter criteria.</p>
        )}
      </div>

      <div className="mt-6">
        <Button
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white"
          onClick={() => mutate()} // Manuelles Aktualisieren der Daten
        >
          Write a Review
        </Button>
      </div>
    </div>
  )
}
