"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageCircle, Send, Bot, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatMarkdownResponse } from "@/lib/format-markdown";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your Shanti Himalaya assistant. I can help you with:\n\n• Resort packages & pricing\n• Himalayan journey details\n• Booking information\n• Activities & experiences\n• Contact details\n\nWhat would you like to know today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatChatHistoryForGemini = (messages: Message[]): ChatHistory[] => {
    return messages
      .slice(-6) // Keep last 6 messages for context (3 pairs)
      .map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
  };

  const getGeminiResponse = async (userInput: string, history: Message[]): Promise<string> => {
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is not configured");
    }

    const formattedHistory = formatChatHistoryForGemini(history);
    
    // System prompt for Shanti Himalaya
    const systemPrompt = {
      role: 'user',
      parts: [{
        text: `You are the Shanti Himalaya Assistant, an AI chatbot for a luxury Himalayan resort and trekking company. Your personality is warm, knowledgeable, and helpful.

Company Information:
- Name: Shanti Himalaya
- Type: Luxury Himalayan Resort & Trekking Company
- Location: Near Corbett National Park, Uttarakhand, India
- Unique Selling Points: Only 4 luxury glamps, personalized experiences, sustainable tourism
- Contact: +91 98765 43210, info@shantihimalaya.com, shantihimalaya.com

Available Services:
1. Himalayan Journeys (Treks):
   - Everest Base Camp (12-14 days)
   - Annapurna Circuit (18 days)
   - Markha Valley, Ladakh (8 days)
   - Valley of Flowers (6 days)
   - Bhutan Cultural Tour (10 days)
   - Langtang Valley Trek (7-10 days)

2. Resort Packages at Shanti Himalaya:
   - Holi Special: ₹8,999 (2 Days, 1 Night)
   - Long Weekend: ₹15,999 (3 Days, 2 Nights)
   - New Year Special: ₹25,999 (4 Days, 3 Nights)
   - Includes: Luxury glamping, all meals, activities

3. Activities:
   - Guided nature treks
   - Bird watching (200+ species)
   - Village walks
   - Cultural experiences
   - Bonfire evenings
   - Photography sessions

4. Booking Process:
   - Contact via phone/WhatsApp: +91 98765 43210
   - Check availability
   - 50% deposit to secure booking
   - Balance on arrival
   - Only 4 glamps available - book early!

Guidelines:
- Be conversational but professional
- Use Himalayan references and warm tone
- Always end with a question or suggestion to continue conversation
- For specific pricing/availability, encourage direct contact
- Use markdown formatting for better readability
- Keep responses informative but concise (300-500 words max)
- If unsure, suggest contacting the team directly
- Highlight the exclusive nature of the experiences

Current date: ${new Date().toLocaleDateString()}

Now, respond to the user's query:`
      }]
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            systemPrompt,
            ...formattedHistory,
            {
              role: 'user',
              parts: [{ text: userInput }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const responseText = data.candidates[0].content.parts[0].text;
      
      // Add contact info if response is short or seems incomplete
      if (responseText.length < 150 || !responseText.includes('contact') || !responseText.includes('+91')) {
        return `${responseText}\n\n**For personalized assistance and bookings:**\n📞 +91 98765 43210\n📧 info@shantihimalaya.com\n🌐 shantihimalaya.com`;
      }

      return responseText;

    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get response from Gemini
      const responseText = await getGeminiResponse(inputMessage, messages);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      toast({
        title: "Response Generated",
        description: "From Shanti Himalaya AI Assistant",
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Chat error:', error);

      // Fallback response
      const fallbackResponse = `Namaste! 🙏 I'm experiencing some technical difficulties connecting to our knowledge base.

Here's what I can tell you about **Shanti Himalaya**:

**🏔️ Himalayan Journeys:**
• Everest Base Camp (12-14 days)
• Annapurna Circuit (18 days)
• Bhutan Cultural Tour (10 days)
• Valley of Flowers (6 days)
• Markha Valley, Ladakh (8 days)

**🏕️ Resort Experiences:**
• Only 4 luxury glamps available
• All-inclusive packages from ₹8,999
• Guided activities & cultural experiences
• Sustainable tourism practices

**📞 Direct Contact:**
For real-time availability and personalized planning:
• Phone/WhatsApp: +91 98765 43210
• Email: info@shantihimalaya.com
• Website: shantihimalaya.com

Which experience are you most interested in exploring today?`;

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Using Cached Information",
        description: "Contact us for live availability",
        variant: "default",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! 👋 I'm your Shanti Himalaya assistant. I can help you with:\n\n• Resort packages & pricing\n• Himalayan journey details\n• Booking information\n• Activities & experiences\n• Contact details\n\nWhat would you like to know today?",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Chat Cleared",
      description: "Starting fresh conversation",
      duration: 2000,
    });
  };

  const quickReplies = [
    { text: "Packages & prices" },
    { text: "What's included?" },
    { text: "How to book?" },
    { text: "Activities" },
    { text: "Contact info" },
    { text: "Himalayan treks" }
  ];

  return (
    <>
      {/* Chat Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-2xl transition-all duration-300 z-50"
        size="sm"
        aria-label="Chat with Assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
      </Button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md max-h-[550px] flex flex-col p-0 rounded-xl overflow-hidden">
          <DialogHeader className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <DialogTitle className="text-white text-sm font-bold">
                Shanti Himalaya Assistant
              </DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearChat}
                className="text-xs text-white/90 hover:text-white hover:bg-white/20 h-8 px-3"
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white/90 hover:text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <Card className="flex-1 border-0 shadow-none">
            <CardContent className="p-0 flex flex-col h-[450px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${message.isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {formatMarkdownResponse(message.text)}
                      </div>
                      <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              <div className="px-4 py-3 border-t border-gray-200 bg-white">
                <div className="flex flex-wrap gap-2 mb-3">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInputMessage(reply.text);
                        setTimeout(sendMessage, 100);
                      }}
                      className="text-xs h-8 px-3 rounded-full"
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBot;