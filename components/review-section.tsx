import type { Review } from "@/data/types"

interface ReviewSectionProps {
  reviews: Review[]
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">★ {review.rating}</span>
                </div>
                <span className="text-sm text-neutral-600">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-neutral-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-neutral-600">No reviews yet</p>
        )}
      </div>
    </div>
  )
}
