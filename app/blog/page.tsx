import Link from "next/link"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Blog</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Stay updated with the latest news, tips, and insights about rental properties in Bangladesh
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Coming Soon</h2>
            <p className="text-neutral-600 mb-8">
              We're working on creating valuable content for you. Our blog will feature articles about
              rental tips, market insights, and guides for both renters and property owners.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
