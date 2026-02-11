"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatBotTriggerProps {
  onClick: () => void;
}

const ChatBotTrigger = ({ onClick }: ChatBotTriggerProps) => {
  return (
    <Button
      onClick={onClick}
      className="w-14 h-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white hover:shadow-2xl transition-all duration-300 z-50 relative group"
      size="sm"
      aria-label="Chat with Assistant"
    >
      <MessageCircle className="w-6 h-6" />
      {/* Notification indicator */}
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
    </Button>
  );
};

export default ChatBotTrigger;