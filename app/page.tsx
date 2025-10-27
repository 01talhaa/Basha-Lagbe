import Link from "next/link"
import SearchBar from "@/components/search-bar"
import HomepageChatbot from "@/components/homepage-chatbot"
import ListingCard from "@/components/listing-card"
import { getListings } from "@/lib/api-utils"

export default async function HomePage() {
  const listings = await getListings()
  const featuredListings = listings.slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Apartment</h1>
            <p className="text-lg text-neutral-100 mb-8">
              Discover and book long-term apartments, studios, and rooms worldwide
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </section>

      <HomepageChatbot />

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Popular in Your Area</h2>
          <p className="text-neutral-600">Discover the most popular apartments near you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/search" className="btn-primary inline-block">
            View All Listings
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to List Your Property?</h2>
          <p className="text-lg mb-8 text-neutral-100">Start earning by renting out your apartment today</p>
          <Link
            href="/host/new-listing"
            className="bg-accent-gold text-neutral-900 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all inline-block"
          >
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  )
}
