"use client"

import { usePathname } from "next/navigation"
import WhatsAppButton from "@/components/WhatsAppButton"
import ChatBot from "@/components/ChatBot"
import EnquiryButton from "./EnqueryButton"


const FloatingButtons = () => {
  const pathname = usePathname()
  const isOurResortPage = pathname === "/our-resort" || pathname.startsWith("/our-resort/")

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-50">
      {isOurResortPage && <EnquiryButton />}
      <WhatsAppButton />
      <ChatBot />
    </div>
  )
}

export default FloatingButtons