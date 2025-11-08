"use client"

import { useState, useEffect } from "react"

const testimonials = [
  {
    id: 1,
    name: "Anika Rahman",
    role: "Software Engineer",
    location: "Dhaka, Bangladesh",
    image: "/placeholder.svg?height=80&width=80&text=AR",
    rating: 5,
    text: "Finding my apartment through Basha-Lagbe was incredibly easy! The platform is user-friendly, and I found the perfect place in Gulshan within days. Highly recommended!",
  },
  {
    id: 2,
    name: "Mehedi Hasan",
    role: "Business Owner",
    location: "Chittagong, Bangladesh",
    image: "/placeholder.svg?height=80&width=80&text=MH",
    rating: 5,
    text: "As a property owner, listing on Basha-Lagbe has been fantastic. The platform brings quality tenants, and the payment process is seamless. My properties are always booked!",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Marketing Manager",
    location: "Sylhet, Bangladesh",
    image: "/placeholder.svg?height=80&width=80&text=NJ",
    rating: 5,
    text: "The verified listings gave me peace of mind. I moved from the USA and found a beautiful apartment in Banani. The whole process was transparent and professional.",
  },
  {
    id: 4,
    name: "Rafiq Ahmed",
    role: "University Professor",
    location: "Rajshahi, Bangladesh",
    image: "/placeholder.svg?height=80&width=80&text=RA",
    rating: 5,
    text: "Excellent service! The AI-powered search helped me find exactly what I was looking for. The customer support team was also very responsive and helpful throughout.",
  },
  {
    id: 5,
    name: "Sabrina Khan",
    role: "Entrepreneur",
    location: "Dhaka, Bangladesh",
    image: "/placeholder.svg?height=80&width=80&text=SK",
    rating: 5,
    text: "I've been using Basha-Lagbe for both renting and listing properties. The platform is reliable, and the community is trustworthy. Best real estate platform in Bangladesh!",
  },
]

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume auto-play after 10 seconds
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="py-20 md:py-28 bg-neutral-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">
            What Our Users Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join thousands of satisfied renters and property owners who trust Basha-Lagbe
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Quote */}
            <div className="absolute top-8 right-8 opacity-10">
              <svg className="w-24 h-24 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Testimonial Content */}
            <div className="relative">
              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-accent-gold fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-xl md:text-2xl text-neutral-700 leading-relaxed mb-8 min-h-[120px]">
                "{testimonials[currentIndex].text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-neutral-900">{testimonials[currentIndex].name}</h4>
                  <p className="text-neutral-600">{testimonials[currentIndex].role}</p>
                  <p className="text-sm text-neutral-500">{testimonials[currentIndex].location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group"
            aria-label="Previous testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 group"
            aria-label="Next testimonial"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-3 bg-primary"
                    : "w-3 h-3 bg-neutral-300 hover:bg-neutral-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Indicator */}
          {/* {isAutoPlaying && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  animation: "progress 5s linear infinite",
                }}
              />
            </div>
          )} */}
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
