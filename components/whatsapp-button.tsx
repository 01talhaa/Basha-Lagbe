"use client"

import { useState, useEffect } from "react"

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [message, setMessage] = useState("")
  const whatsappNumber = "+8801401658685"

  // Show widget after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const predefinedMessages = [
    "Hi! I'm looking for a rental property.",
    "I need help finding a home in a specific area.",
    "Can you help me with property details?",
    "I want to list my property on Basha-Lagbe.",
    "I need assistance with booking."
  ]

  const handleSendMessage = (messageText = message) => {
    if (!messageText.trim()) return
    
    const encodedMessage = encodeURIComponent(messageText)
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    setMessage("")
    setIsExpanded(false)
  }

  const handlePredefinedMessage = (msg: string) => {
    handleSendMessage(msg)
  }

  const handleButtonClick = () => {
    setIsExpanded(!isExpanded)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Expanded Chat Window */}
      {isExpanded && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 overflow-hidden animate-slide-up z-[9999]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">🏠</span>
                </div>
                <div>
                  <div className="font-semibold">Basha-Lagbe Support</div>
                  <div className="text-xs opacity-90">Online now</div>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {/* Welcome Message */}
            <div className="mb-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-2">
                <div className="text-sm text-gray-800">
                  👋 Hi there! Welcome to Basha-Lagbe. How can we help you today?
                </div>
              </div>
              <div className="text-xs text-gray-500">Support Team • Just now</div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 mb-4">
              <div className="text-xs font-semibold text-gray-600 mb-2">Quick Messages:</div>
              {predefinedMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedMessage(msg)}
                  className="w-full text-left text-sm bg-green-50 hover:bg-green-100 text-green-700 p-2 rounded-lg transition-colors border border-green-200"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:border-transparent"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-[#25D366] hover:bg-[#128C7E] text-white p-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2 text-center">
              Powered by WhatsApp
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <div className="relative">
        {/* Main WhatsApp Button - Opens chat interface first */}
        <button
          onClick={handleButtonClick}
          className="group relative bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 z-[9999] cursor-pointer"
          style={{ zIndex: 9999 }}
          title="Chat with us on WhatsApp"
        >
          {/* WhatsApp Icon */}
          <svg 
            className="w-8 h-8" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>

          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            1
          </div>

          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Chat with us on WhatsApp
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
          </div>
        </button>

        {/* Subtle background ring for attention */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-10 animate-pulse pointer-events-none" style={{ animationDuration: '2s' }}></div>
      </div>
    </div>
  )
}
