import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
// Remove QueryClientProvider from here
import ChatBot from "@/components/ChatBot"
import WhatsAppButton from "@/components/WhatsAppButton"
import CookieConsent from "@/components/Cookies"
import ClientProviders from '@/components/providers/ClientProviders'

const inter = Inter({ subsets: ['latin'] })

const SITE_NAME = 'Shanti Himalaya'
const SITE_URL = 'https://shantihimalaya.com'
const SITE_DESCRIPTION = 'Luxury Himalayan resort & wilderness glamping near Corbett National Park. Experience tranquility with exclusive stays, guided nature walks, and wellness retreats in the majestic Himalayas.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Luxury Himalayan Resort & Glamping near Corbett`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'Shanti Himalaya',
    'luxury Himalayan resort',
    'wilderness glamping',
    'Corbett National Park',
    'mountain retreat',
    'adventure travel',
    'wellness retreat',
    'luxury camping India',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: `${SITE_NAME} - Luxury Resort & Glamping near Corbett`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Luxury Himalayan Resort & Glamping near Corbett`,
    description: SITE_DESCRIPTION,
    images: ['/images/og-default.jpg'],
    creator: '@shantihimalaya',
  },

  // Verification
  verification: {
    // Add your verification codes here
    // google: 'google-site-verification-code',
    // yandex: 'yandex-verification-code',
    // yahoo: 'yahoo-site-verification',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },

  // Manifest
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX');
            `,
          }}
        />
        {/* ... keep your head content ... */}
      </head>
      <body>
        <ClientProviders>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}

            {/* Floating Buttons Container */}
            <div className="fixed bottom-6 right-6 flex flex-col items-center gap-4 z-50">
              <WhatsAppButton />
              <ChatBot />
            </div>

            <CookieConsent />
          </TooltipProvider>
        </ClientProviders>
      </body>
    </html>
  )
}
