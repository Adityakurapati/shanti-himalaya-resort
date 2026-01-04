import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "919910775073";
    const message = "Hi! I'm interested in learning more about Shanti Himalaya Resort. Can you help me with booking information?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-5 w-12 h-12 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white z-50"
      size="lg"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};

export default WhatsAppButton;
