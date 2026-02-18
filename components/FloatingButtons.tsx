"use client"

import { usePathname } from "next/navigation"
import WhatsAppButton from "@/components/WhatsAppButton"
import ChatBot from "@/components/ChatBot"
import EnquiryButton from "./EnqueryButton"
import { useEffect, useState } from "react"

const FloatingButtons = () => {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isOurResortPage = pathname === "/our-resort" || pathname.startsWith("/our-resort/")

  // Listen for mobile menu state changes
  useEffect(() => {
    const checkMobileMenu = () => {
      const mobileMenu = document.querySelector('.md\\:hidden.fixed.top-20')
      setIsMobileMenuOpen(!!mobileMenu)
    }

    // Check initially
    checkMobileMenu()

    // Create observer to watch for DOM changes
    const observer = new MutationObserver(checkMobileMenu)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <div 
      className={`
        fixed 
        bottom-6 
        right-6 
        flex 
        flex-col 
        items-center 
        gap-4 
        transition-all 
        duration-300
        ${isMobileMenuOpen ? 'z-0 pointer-events-none opacity-0' : 'z-40'}
        md:z-40
        md:opacity-100
        md:pointer-events-auto
      `}
    >
      {isOurResortPage && <EnquiryButton />}
      <WhatsAppButton />
      <ChatBot />
    </div>
  )
}

export default FloatingButtons