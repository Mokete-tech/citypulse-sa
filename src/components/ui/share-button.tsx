import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Linkedin, Copy, Check, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { trackShare } from '@/lib/analytics';

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  itemId?: number;
  itemType?: 'deal' | 'event';
}

export function ShareButton({
  title,
  description = '',
  url = window.location.href,
  className,
  variant = "outline",
  size = "default",
  itemId,
  itemType
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'text-[#1877F2] hover:bg-[#1877F2]/10'
    },
    {
      name: 'X',
      icon: () => (
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      url: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'text-black hover:bg-gray-100'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'text-[#0A66C2] hover:bg-[#0A66C2]/10'
    },
    {
      name: 'WhatsApp',
      icon: () => (
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'text-[#25D366] hover:bg-[#25D366]/10'
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Link copied to clipboard');

      // Track the share if itemId and itemType are provided
      if (itemId && itemType) {
        trackShare(itemType, itemId, 'copy');
      }
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        toast.success('Shared successfully');

        // Track the share if itemId and itemType are provided
        if (itemId && itemType) {
          // For native sharing, we don't know the platform, so we'll use a generic "native" platform
          trackShare(itemType, itemId, 'whatsapp', { method: 'native' });
        }
      } catch (error) {
        // User cancelled or share failed
        console.error('Error sharing:', error);
      }
    } else {
      setOpen(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Share this {description ? 'deal' : 'page'}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {shareLinks.map((link) => (
            <Button
              key={link.name}
              variant="ghost"
              size="icon"
              className={cn("flex flex-col items-center justify-center h-16 w-full gap-1", link.color)}
              onClick={() => {
                window.open(link.url, '_blank', 'noopener,noreferrer');
                setOpen(false);

                // Track the share if itemId and itemType are provided
                if (itemId && itemType) {
                  const platform = link.name.toLowerCase() as 'facebook' | 'x' | 'linkedin' | 'whatsapp';
                  trackShare(itemType, itemId, platform);
                }
              }}
            >
              {typeof link.icon === 'function' ? (
                <link.icon className="h-5 w-5" />
              ) : (
                <link.icon className="h-5 w-5" />
              )}
              <span className="text-xs">{link.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="border rounded-md px-3 py-2 text-sm flex-1 truncate bg-muted">
            {url.length > 30 ? `${url.substring(0, 30)}...` : url}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="flex-shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ShareButton;
