import { useState } from 'react';
import { aiContentService } from '@/lib/ai-service';
import { useToast } from '@/hooks/use-toast';

type DestinationAIType = 'basic' | 'overview' | 'places' | 'activities' | 'itinerary' | 'reach' | 'besttime' | 'stay' | 'tips' | 'faqs';

export const useDestinationAIDetail = () => {
  const [loading, setLoading] = useState<Record<DestinationAIType, boolean>>({
    basic: false,
    overview: false,
    places: false,
    activities: false,
    itinerary: false,
    reach: false,
    besttime: false,
    stay: false,
    tips: false,
    faqs: false,
  });
  
  const { toast } = useToast();

  const generateBasicInfo = async (destinationName: string) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, basic: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'destination'
      });

      toast({
        title: "Basic info generated!",
        description: "AI has filled the basic information fields",
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
      setLoading(prev => ({ ...prev, basic: false }));
    }
  };

  const generateOverview = async (destinationName: string) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, overview: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'destination'
      });

      toast({
        title: "Overview generated!",
        description: "AI has created a detailed overview",
      });

      return response.content.overview;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate overview",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, overview: false }));
    }
  };

  const generatePlaces = async (destinationName: string, count: number = 5) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, places: true }));

    try {
      const places = [];
      for (let i = 0; i < count; i++) {
        const response = await aiContentService.generateContent({
          title: destinationName,
          contentType: 'place'
        });
        places.push(response.content);
      }

      toast({
        title: "Places generated!",
        description: `${places.length} places added`,
      });

      return places;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate places",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, places: false }));
    }
  };

  const generateActivities = async (destinationName: string, count: number = 5) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, activities: true }));

    try {
      const activities = [];
      for (let i = 0; i < count; i++) {
        const response = await aiContentService.generateContent({
          title: destinationName,
          contentType: 'activity'
        });
        activities.push(response.content);
      }

      toast({
        title: "Activities generated!",
        description: `${activities.length} activities added`,
      });

      return activities;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate activities",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  const generateItinerary = async (destinationName: string, duration: string) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, itinerary: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'itinerary',
        context: { duration }
      });

      toast({
        title: "Itinerary generated!",
        description: "AI has created a daily itinerary",
      });

      return Array.isArray(response.content) ? response.content : [];
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate itinerary",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, itinerary: false }));
    }
  };

  const generateFAQs = async (destinationName: string, count: number = 5) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, faqs: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'faq'
      });

      const faqs = Array.isArray(response.content) ? response.content.slice(0, count) : [];

      toast({
        title: "FAQs generated!",
        description: `${faqs.length} FAQs added`,
      });

      return faqs;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate FAQs",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, faqs: false }));
    }
  };

  const generateTravelInfo = async (destinationName: string, type: 'air' | 'train' | 'road') => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    const typeKey = 'reach' as DestinationAIType;
    setLoading(prev => ({ ...prev, [typeKey]: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'travelInfo',
        context: { type }
      });

      const details = response.content.items || [];

      return details;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || `Failed to generate ${type} info`,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [typeKey]: false }));
    }
  };

  const generateSeasonInfo = async (destinationName: string, season: 'winter' | 'summer' | 'monsoon') => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, besttime: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'season',
        context: { season }
      });

      return response.content;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || `Failed to generate ${season} info`,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, besttime: false }));
    }
  };

  const generateAccommodation = async (destinationName: string, type: 'budget' | 'midrange' | 'luxury') => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, stay: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'accommodation',
        context: { type }
      });

      return response.content;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || `Failed to generate ${type} accommodation`,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, stay: false }));
    }
  };

  const generateTravelTips = async (destinationName: string) => {
    if (!destinationName.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a destination name first",
        variant: "destructive",
      });
      return null;
    }

    setLoading(prev => ({ ...prev, tips: true }));

    try {
      const response = await aiContentService.generateContent({
        title: destinationName,
        contentType: 'travelTips'
      });

      const tips = response.content.items || [];

      toast({
        title: "Travel tips generated!",
        description: `${tips.length} tips added`,
      });

      return tips;
    } catch (error: any) {
      toast({
        title: "AI Generation Failed",
        description: error.message || "Failed to generate travel tips",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(prev => ({ ...prev, tips: false }));
    }
  };

  return {
    loading,
    generateBasicInfo,
    generateOverview,
    generatePlaces,
    generateActivities,
    generateItinerary,
    generateFAQs,
    generateTravelInfo,
    generateSeasonInfo,
    generateAccommodation,
    generateTravelTips,
  };
};