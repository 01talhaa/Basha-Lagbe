import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-accent-blue text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Basha-Lagbe</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Bangladesh's most trusted platform for finding and listing rental properties
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-neutral-900">Our Story</h2>
            <div className="space-y-4 text-neutral-700 leading-relaxed">
              <p>
                Basha-Lagbe was founded with a simple mission: to make finding the perfect rental home in Bangladesh as easy and transparent as possible. We understand the challenges renters face - from limited information to unreliable listings and complicated processes.
              </p>
              <p>
                Our platform brings together property owners and renters in a trusted environment, where every listing is verified, prices are transparent, and the entire rental process is streamlined for your convenience.
              </p>
              <p>
                Today, we're proud to serve thousands of happy renters and property owners across Bangladesh, helping people find their perfect "basha" (home) every day.
              </p>
            </div>
          </div>
          <div className="bg-neutral-200 rounded-2xl h-96 flex items-center justify-center">
            <img
              src="/placeholder.svg?height=400&width=600&text=Our+Team"
              alt="Basha-Lagbe Team"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-2xl border border-primary/20">
              <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Our Mission</h3>
              <p className="text-neutral-700 leading-relaxed">
                To revolutionize the rental experience in Bangladesh by providing a seamless, transparent, and trustworthy platform that connects property owners with quality tenants, making the process of finding a home simple, safe, and stress-free.
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 p-8 rounded-2xl border border-accent-blue/20">
              <div className="w-14 h-14 bg-accent-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">Our Vision</h3>
              <p className="text-neutral-700 leading-relaxed">
                To become the leading rental platform in Bangladesh, setting the standard for quality, reliability, and innovation in the real estate market, while empowering communities and creating lasting value for all our stakeholders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-neutral-900">Our Core Values</h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-900">Trust & Transparency</h3>
            <p className="text-neutral-600">
              We believe in honest communication and verified listings to build lasting trust with our community.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-900">Excellence</h3>
            <p className="text-neutral-600">
              We continuously improve our platform to deliver the best rental experience in Bangladesh.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-neutral-900">Community First</h3>
            <p className="text-neutral-600">
              Your success is our success. We prioritize the needs of renters and property owners above all.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary-dark to-accent-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-white/90">Growing stronger every day</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-gold mb-2">10K+</div>
              <div className="text-lg text-white/90">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-gold mb-2">25K+</div>
              <div className="text-lg text-white/90">Happy Renters</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-gold mb-2">50+</div>
              <div className="text-lg text-white/90">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent-gold mb-2">4.8★</div>
              <div className="text-lg text-white/90">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold mb-6 text-neutral-900">Ready to Find Your Perfect Home?</h2>
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
          Join thousands of satisfied renters who found their ideal apartment through Basha-Lagbe
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/search"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl"
          >
            Browse Properties
          </Link>
          <Link
            href="/host/new-listing"
            className="bg-white hover:bg-neutral-50 text-primary border-2 border-primary px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl"
          >
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  )
}
