"use client"

import { useState } from "react"

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "General",
    question: "What is Basha-Lagbe?",
    answer: "Basha-Lagbe is Bangladesh's premier online platform for finding and listing rental properties. We connect property owners with quality tenants, making the rental process simple, transparent, and secure."
  },
  {
    id: 2,
    category: "General",
    question: "Is Basha-Lagbe free to use?",
    answer: "Yes! Browsing and searching for properties is completely free. Property owners can list their first property for free, and we offer competitive pricing for additional listings and premium features."
  },
  {
    id: 3,
    category: "For Renters",
    question: "How do I search for properties?",
    answer: "Simply use our search bar on the homepage or visit the 'Find Rentals' page. You can filter by location, price range, number of bedrooms, amenities, and more to find your perfect home."
  },
  {
    id: 4,
    category: "For Renters",
    question: "Are all listings verified?",
    answer: "Yes! We verify all property listings to ensure authenticity. Our team reviews each listing, and we encourage renters to report any discrepancies they encounter."
  },
  {
    id: 5,
    category: "For Renters",
    question: "How do I contact property owners?",
    answer: "Once you find a property you're interested in, you can contact the owner directly through our platform, call them, or use our WhatsApp integration for quick communication."
  },
  {
    id: 6,
    category: "For Renters",
    question: "What payment methods do you accept?",
    answer: "We support various payment methods including bank transfers, mobile banking (bKash, Nagad, Rocket), and credit/debit cards for secure transactions."
  },
  {
    id: 7,
    category: "For Property Owners",
    question: "How do I list my property?",
    answer: "Click on 'List Property' in the navigation menu, create an account if you haven't already, and fill out the property listing form with details, photos, and pricing. Our team will review and verify your listing within 24-48 hours."
  },
  {
    id: 8,
    category: "For Property Owners",
    question: "What are the listing fees?",
    answer: "Your first property listing is completely free! For additional listings, we offer affordable monthly and annual plans. Contact us for current pricing and special offers."
  },
  {
    id: 9,
    category: "For Property Owners",
    question: "How long does it take to verify my listing?",
    answer: "Most listings are verified within 24-48 hours. Our team reviews the property details, photos, and documentation to ensure quality and authenticity."
  },
  {
    id: 10,
    category: "For Property Owners",
    question: "Can I edit my listing after it's published?",
    answer: "Absolutely! You can log in to your account anytime and update your property details, photos, availability, and pricing through your dashboard."
  },
  {
    id: 11,
    category: "Booking & Payments",
    question: "How does the booking process work?",
    answer: "After finding your ideal property, you can request a lease through our platform. The property owner will review your request, and once approved, you'll proceed with the payment and documentation process."
  },
  {
    id: 12,
    category: "Booking & Payments",
    question: "Is there a security deposit required?",
    answer: "Security deposit requirements vary by property and are set by the property owner. The amount is clearly stated in each listing and typically ranges from one to three months' rent."
  },
  {
    id: 13,
    category: "Booking & Payments",
    question: "Are payments secure?",
    answer: "Yes! We use industry-standard encryption and secure payment gateways to protect your financial information. We never store your complete payment details on our servers."
  },
  {
    id: 14,
    category: "Booking & Payments",
    question: "What is your refund policy?",
    answer: "Refund policies vary by property. Please review the specific cancellation and refund policy listed on each property page before making a booking. Contact our support team if you have questions."
  },
  {
    id: 15,
    category: "Account & Privacy",
    question: "How do I create an account?",
    answer: "Click 'Sign Up' in the top right corner, provide your email, phone number, and create a password. You'll receive a verification link to activate your account."
  },
  {
    id: 16,
    category: "Account & Privacy",
    question: "Is my personal information safe?",
    answer: "We take privacy seriously. Your personal information is encrypted and never shared with third parties without your consent. Read our Privacy Policy for complete details."
  },
  {
    id: 17,
    category: "Support",
    question: "How can I contact customer support?",
    answer: "You can reach us through our Contact page, via email at info@bashalagbe.com, WhatsApp at +880 1401-658685, or use our live chat feature on the website."
  },
  {
    id: 18,
    category: "Support",
    question: "What are your business hours?",
    answer: "Our support team is available Saturday through Thursday, 9:00 AM to 6:00 PM (Bangladesh Time). We're closed on Fridays. For urgent matters, you can reach us via WhatsApp."
  }
]

const categories = ["All", "General", "For Renters", "For Property Owners", "Booking & Payments", "Account & Privacy", "Support"]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-dark to-accent-blue text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Find answers to common questions about Basha-Lagbe
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-xl text-neutral-900 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform ${openFAQ === faq.id ? "rotate-180" : ""}`}>
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-5 pt-0 border-t border-neutral-100">
                    <p className="text-neutral-700 leading-relaxed mt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-neutral-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-neutral-500">No FAQs found matching your search.</p>
              <p className="text-neutral-400 mt-2">Try different keywords or browse all categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-neutral-900">Still Have Questions?</h2>
          <p className="text-xl text-neutral-600 mb-8">
            Can't find what you're looking for? Our support team is here to help!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl"
            >
              Contact Support
            </a>
            <a
              href="https://wa.me/8801401658685"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
