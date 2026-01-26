'use client'

import { Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SocialSharingProps {
  title: string
  description?: string
  url: string
}

export default function SocialSharing({ title, description, url }: SocialSharingProps) {
  const handleShare = async (platform: string) => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
        break
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          '_blank'
        )
        break
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          '_blank'
        )
        break
      case 'native':
        if (navigator.share) {
          navigator.share({
            title,
            text: description,
            url,
          }).catch(() => {
            // Silently fail if user cancels
          })
        }
        break
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
        <Share2 className="w-4 h-4" />
        Share:
      </span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('facebook')}
        title="Share on Facebook"
        className="gap-1"
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('twitter')}
        title="Share on Twitter"
        className="gap-1"
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleShare('linkedin')}
        title="Share on LinkedIn"
        className="gap-1"
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
    </div>
  )
}
