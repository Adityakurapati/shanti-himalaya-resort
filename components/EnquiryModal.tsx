"use client"

import React, { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface EnquiryModalProps {
  item: {
    id: string
    title: string
    type: 'journey' | 'destination' | 'experience' | 'blog' | 'our-resort'
  }
  isOpen: boolean
  onClose: () => void
}

const EnquiryModal = ({ item, isOpen, onClose }: EnquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const { error: submitError } = await supabase.from("enquiries").insert([
        {
          journey_id: item.id,
          journey_title: `[${item.type.toUpperCase()}] ${item.title}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          enquiry_type: item.type,
          status: "new",
          is_read: false,
        },
      ])

      if (submitError) throw submitError

      setIsSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        })
        setIsSuccess(false)
        onClose()
      }, 2000)

    } catch (err: any) {
      console.error("Error submitting enquiry:", err)
      setError(err.message || "There was an error submitting your enquiry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-background rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border"
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Enquire About</h3>
              <p className="text-primary font-medium mt-1">{item.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="m-6 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">Enquiry Submitted!</h4>
                <p className="text-green-600 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="m-6 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Submission Failed</h4>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message / Query *
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px]"
                placeholder="Tell us about your requirements, questions, or specific needs..."
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-medium"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Enquiry"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3"
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              We respect your privacy. Your information will only be used to respond to your enquiry.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default EnquiryModal