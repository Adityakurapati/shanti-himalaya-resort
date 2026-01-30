"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import EnquiryModal from "./EnquiryModal"

const EnquiryButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  // Animation effect - slide in from left
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000) // Wait 1 second before showing

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setIsHidden(true)
    }, 500) // Wait for animation to finish
  }

  if (isHidden) return null

  return (
    <>
      {/* Enquiry Button */}
      <div className={`fixed left-0 bottom-5 z-50 transition-all duration-500 ease-out ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <div className="relative group">
          {/* Main Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white rounded-r-full rounded-l-lg p-4 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center gap-3 pl-6 pr-8 relative overflow-hidden group"
            aria-label="Enquire Now"
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 group-hover:from-primary group-hover:to-primary/80 transition-all duration-300" />
            
            {/* Icon */}
            <MessageCircle className="w-6 h-6 relative z-10" />
            
            {/* Text */}
            <div className="relative z-10 text-left">
              <span className="text-sm font-bold whitespace-nowrap block leading-tight">
                Enquire Now
              </span>
              <span className="text-xs font-medium text-primary-foreground/80 block">
                Get Quote
              </span>
            </div>

            {/* Hover arrow effect */}
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute -right-3 -top-3 bg-gray-800 text-white rounded-full p-1.5 shadow-lg hover:bg-gray-900 hover:scale-110 transition-all duration-300 z-20"
            aria-label="Close enquiry button"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Tooltip */}
          <div className="absolute -top-12 left-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
            Click to enquire about our resort
            {/* Tooltip arrow */}
            <div className="absolute bottom-0 left-4 transform translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
          </div>
        </div>

        {/* Pulse animation circle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-primary/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        item={{
          id: "our-resort-id",
          title: "Shanti Himalaya Resort",
          type: 'our-resort'
        }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Add CSS for animations */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          70% {
            transform: translateX(10%);
            opacity: 1;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}

export default EnquiryButton