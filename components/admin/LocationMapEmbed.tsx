"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ExternalLink, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LocationMapEmbedProps {
  // Map URL from embed (stored in database)
  mapUrl?: string | null;
  
  // Location info (for display only, not for generating maps)
  address?: string | null;
  locationName?: string;
  
  // Display options
  showTitle?: boolean;
  showBadge?: boolean;
  showAddress?: boolean;
  showOpenButton?: boolean;
  className?: string;
  height?: string | number;
  width?: string | number;
  
  // Callbacks
  onLoad?: () => void;
  onError?: (error: string) => void;
}

export default function LocationMapEmbed({
  mapUrl,
  address,
  locationName,
  showTitle = true,
  showBadge = true,
  showAddress = true,
  showOpenButton = true,
  className = "",
  height = "400px",
  width = "100%",
  onLoad,
  onError
}: LocationMapEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Extract embed URL from stored mapUrl
  useEffect(() => {
    if (mapUrl) {
      const extracted = extractEmbedUrl(mapUrl);
      if (extracted) {
        setEmbedUrl(extracted);
        setHasError(false);
        setErrorMessage("");
      } else {
        setEmbedUrl("");
        setHasError(true);
        setErrorMessage("Invalid Google Maps embed URL");
        onError?.("Invalid embed URL");
      }
    } else {
      setEmbedUrl("");
      setHasError(true);
      setErrorMessage("No map location set");
      setIsLoading(false);
    }
  }, [mapUrl, onError]);

  // Extract URL from iframe or clean URL
  const extractEmbedUrl = (input: string): string => {
    if (!input) return "";
    
    // If it's an iframe tag, extract src attribute
    const iframeMatch = input.match(/src="([^"]+)"/);
    if (iframeMatch) {
      return iframeMatch[1];
    }
    
    // If it's already a clean embed URL, return as is
    if (input.includes('/maps/embed')) {
      return input.trim();
    }
    
    // Not a valid embed URL
    return "";
  };

  const handleOpenInGoogleMaps = () => {
    if (mapUrl) {
      // Convert embed URL to regular maps URL if needed
      const mapsUrl = mapUrl.replace('/embed/', '/');
      window.open(mapsUrl, '_blank');
    } else if (address) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
    } else if (locationName) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(locationName)}`, '_blank');
    } else {
      window.open('https://maps.google.com', '_blank');
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    setHasError(true);
    setErrorMessage("Failed to load map preview");
    setIsLoading(false);
    onError?.("Iframe failed to load");
  };

  return (
    <Card className={cn("overflow-hidden max-w-5xl mx-auto mb-8", className)}>
      {/* Header */}
      {(showTitle || showBadge || showOpenButton) && (
        <div className="flex  items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {showBadge && embedUrl ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Check className="h-3 w-3 mr-1" />
                Map Set
              </Badge>
            ) : showBadge && (
              <Badge variant="outline" className="bg-gray-50 text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                No Map
              </Badge>
            )}
            
            {showTitle && locationName && (
              <span className="text-sm font-medium">
                {locationName}
              </span>
            )}
          </div>
          
          {showOpenButton && embedUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenInGoogleMaps}
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Google Maps
            </Button>
          )}
        </div>
      )}

      {/* Address */}
      {showAddress && address && (
        <div className="px-4 py-2 bg-muted/30 border-b text-sm">
          <span className="text-muted-foreground">📍</span> {address}
        </div>
      )}

      {/* Map Container */}
      <div 
        className="relative bg-muted flex items-center justify-center"
        style={{ height, width }}
      >
        {isLoading && embedUrl && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/50 backdrop-blur-sm z-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        )}

        {embedUrl && !hasError ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map - ${locationName || 'Location'}`}
            className="absolute inset-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-muted-foreground/10 flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="font-medium text-muted-foreground">
              {errorMessage || "No map location available"}
            </p>
            {address && (
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                {address}
              </p>
            )}
            {showOpenButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInGoogleMaps}
                className="mt-4 gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {address || locationName ? "Search on Google Maps" : "Open Google Maps"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Embed URL (debug - remove in production) */}
      {process.env.NODE_ENV === 'development' && embedUrl && (
        <div className="p-2 bg-muted/50 border-t text-xs text-muted-foreground truncate">
          <span className="font-mono">{embedUrl}</span>
        </div>
      )}
    </Card>
  );
}