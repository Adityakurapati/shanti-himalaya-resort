"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, ExternalLink, X, Info, Copy, Check } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface MapPickerProps {
  mapUrl?: string;
  zoom?: number;
  address?: string;
  onMapUrlChange?: (url: string) => void;
  onLocationSelect?: (lat: number, lng: number, zoom: number) => void;
}

export default function MapPicker({
  mapUrl = "",
  zoom = 13,
  address = "",
  onMapUrlChange,
  onLocationSelect
}: MapPickerProps) {
  const [inputUrl, setInputUrl] = useState(mapUrl);
  const [displayUrl, setDisplayUrl] = useState<string>(mapUrl);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Extract embed URL from iframe or clean URL
  const extractEmbedUrl = (input: string): string => {
    if (!input) return "";
    
    // If it's an iframe tag, extract src attribute
    const iframeMatch = input.match(/src="([^"]+)"/);
    if (iframeMatch) {
      return iframeMatch[1];
    }
    
    // If it's already a clean URL, return as is
    return input.trim();
  };

  const openGoogleMapsWithSearch = () => {
    const searchQuery = encodeURIComponent(address || "");
    if (searchQuery) {
      window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank', 'width=1200,height=800');
    } else {
      window.open('https://maps.google.com', '_blank', 'width=1200,height=800');
    }
    
    setIsModalOpen(true);
    
    toast({
      title: "Follow these steps:",
      description: "1. Find your location 2. Click 'Share' or 'Embed map' 3. Copy the embed iframe 4. Paste it here",
      duration: 8000,
    });
  };

  const handleSetLocation = () => {
    if (!inputUrl.trim()) {
      setError("Please enter a Google Maps URL or iframe");
      return;
    }

    const extractedUrl = extractEmbedUrl(inputUrl);
    
    // Simple validation
    if (!extractedUrl.includes('google.com/maps')) {
      setError("Please enter a valid Google Maps embed URL");
      return;
    }

    setError("");
    setDisplayUrl(extractedUrl);
    setIsModalOpen(false);
    
    // Store only the clean URL
    if (onMapUrlChange) {
      onMapUrlChange(extractedUrl);
    }

    toast({
      title: "Success!",
      description: "Location map has been set",
    });
  };

  const handleClear = () => {
    setInputUrl("");
    setDisplayUrl("");
    setError("");
    
    if (onMapUrlChange) {
      onMapUrlChange("");
    }

    toast({
      title: "Cleared",
      description: "Location map has been removed",
    });
  };

  const handleOpenInGoogleMaps = () => {
    if (displayUrl) {
      window.open(displayUrl, '_blank');
    }
  };

  const copyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Display */}
      {displayUrl ? (
        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Location Preview</h3>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenInGoogleMaps}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Maps
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative w-full h-[450px] rounded-lg overflow-hidden border bg-muted">
            <iframe
              src={displayUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              className="absolute inset-0"
            />
          </div>

          <div className="text-xs text-muted-foreground break-all p-2 bg-muted rounded">
            <strong>Stored URL:</strong> {displayUrl}
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-4 text-muted-foreground">
            <MapPin className="h-12 w-12 opacity-50" />
            <div className="space-y-2">
              <p className="font-medium text-lg">No location map set</p>
              <p className="text-sm">Click the button below to add a Google Maps location</p>
            </div>
            <Button onClick={openGoogleMapsWithSearch} size="lg" className="mt-4">
              <MapPin className="h-5 w-5 mr-2" />
              Set Location on Map
            </Button>
          </div>
        </Card>
      )}

      {/* Helper Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Set Location on Google Maps</DialogTitle>
            <DialogDescription>
              Paste the Google Maps embed iframe or URL
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Step-by-step Guide */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3 mt-2">
                  <div className="font-semibold text-sm">Quick Steps:</div>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Open Google Maps and find your location</li>
                    <li>Click the <strong>"Share"</strong> button</li>
                    <li>Go to the <strong>"Embed a map"</strong> tab</li>
                    <li>Click <strong>"COPY HTML"</strong></li>
                    <li>Paste the iframe code below</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>

            {/* Address Helper */}
            {address && (
              <div className="space-y-2">
                <Label>Your Address (click to copy)</Label>
                <div 
                  className="flex items-center gap-2 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={copyAddressToClipboard}
                >
                  <div className="flex-1 text-sm">{address}</div>
                  <Button type="button" variant="ghost" size="sm">
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Open Maps Button */}
            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              onClick={openGoogleMapsWithSearch}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {address ? "Open Google Maps with this address" : "Open Google Maps"}
            </Button>

            {/* URL/Iframe Input */}
            <div className="space-y-2">
              <Label htmlFor="map-url">Paste Google Maps Embed Iframe or URL</Label>
              <div className="flex gap-2">
                <Input
                  id="map-url"
                  type="text"
                  placeholder="<iframe src='https://www.google.com/maps/embed?...'></iframe>"
                  value={inputUrl}
                  onChange={(e) => {
                    setInputUrl(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSetLocation();
                    }
                  }}
                  className="flex-1 font-mono text-xs"
                />
                <Button type="button" onClick={handleSetLocation}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Set
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Examples */}
            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <div className="text-sm font-medium">Example of what to paste:</div>
              <div className="text-xs space-y-2">
                <p className="bg-muted p-2 rounded break-all">
                  ✅ <span className="text-green-600">&lt;iframe src="https://www.google.com/maps/embed?pb=!1m18!...&"&gt;&lt;/iframe&gt;</span>
                </p>
                <p className="bg-muted p-2 rounded break-all">
                  ✅ <span className="text-green-600">https://www.google.com/maps/embed?pb=!1m18!...</span>
                </p>
                <p className="text-muted-foreground mt-2">
                  The system will automatically extract just the URL from the iframe
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}