import { useState } from 'react';
import { aiContentService } from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';

export const useDestinationAI = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAllDestinationContent = async (destinationName: string) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'destinationAll'
      });

      toast({
        title: "✨ All Content Generated!",
        description: "AI has created comprehensive destination content",
        duration: 5000,
      });

      return response.content;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate content",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    generateAllDestinationContent,
  };
};