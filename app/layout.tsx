"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatBot from "@/components/ChatBot";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/Cookies";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
        return (
                <html lang="en">
                        <body>
                                <QueryClientProvider client={queryClient}>
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
                                </QueryClientProvider>
                        </body>
                </html>
        );
}
