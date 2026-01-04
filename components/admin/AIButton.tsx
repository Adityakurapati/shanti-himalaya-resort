"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { aiContentService } from "@/lib/ai-service";
import { useToast } from "@/hooks/use-toast";

interface AIButtonProps {
  title: string;
  contentType: 'journey' | 'experience' | 'package' | 'daySchedule' | 'resortActivity' | 'resortPackage';
  onContentGenerated: (content: Record<string, any>) => void;
  disabled?: boolean;
  className?: string;
}

export const AIButton = ({
  title,
  contentType,
  onContentGenerated,
  disabled = false,
  className = ""
}: AIButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAIClick = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title first to generate content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await aiContentService.generateContent({
        title,
        contentType
      });

      onContentGenerated(response.content);
      
      toast({
        title: "Content generated!",
        description: "AI has filled the form with relevant content",
      });
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleAIClick}
      disabled={disabled || loading || !title.trim()}
      className={`gap-2 ${className}`}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
};