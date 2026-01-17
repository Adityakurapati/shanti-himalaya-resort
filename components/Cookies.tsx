import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1">
            <p className="text-foreground text-sm sm:text-base leading-relaxed">
              We use cookies to ensure that we give you the best experience on our website.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('/privacy-policy', '_blank')}
              className="text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Privacy Policy
            </Button>
            <Button
              onClick={acceptCookies}
              className="bg-primary hover:bg-primary/90 text-white px-6"
              size="sm"
            >
              Allow Cookies
            </Button>
            <button
              onClick={closeBanner}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;