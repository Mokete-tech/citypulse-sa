import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShareButtonProps {
  itemId: number;
  itemType: 'deal' | 'event';
  title: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({
  itemId,
  itemType,
  title,
  className,
  variant = 'outline',
  size = 'sm'
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = React.useState(false);

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${itemType}s/${itemId}`;
  };

  const trackShare = async (platform: string) => {
    try {
      setIsSharing(true);
      
      // Track share in analytics
      await supabase.from('analytics').insert({
        event_type: 'share',
        event_source: `${itemType}_page`,
        source_id: itemId,
        metadata: { 
          platform,
          item_type: itemType,
          item_id: itemId
        }
      });

      // Increment share count in the database
      const { data: shareData, error: shareError } = await supabase
        .from(`${itemType}s`)
        .select('shares')
        .eq('id', itemId)
        .single();

      if (!shareError) {
        const currentShares = shareData?.shares || 0;
        await supabase
          .from(`${itemType}s`)
          .update({ shares: currentShares + 1 })
          .eq('id', itemId);
      }

      toast.success(`Shared on ${platform}`, {
        description: `You've shared this ${itemType} on ${platform}.`
      });
    } catch (error) {
      console.error('Error tracking share:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const shareOnX = () => {
    const url = getShareUrl();
    const text = `Check out this ${itemType}: ${title}`;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    trackShare('X');
  };

  const shareOnWhatsApp = () => {
    const url = getShareUrl();
    const text = `Check out this ${itemType}: ${title}\n${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    trackShare('WhatsApp');
  };

  const shareOnFacebook = () => {
    const url = getShareUrl();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    trackShare('Facebook');
  };

  const copyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied', {
        description: 'The link has been copied to your clipboard.'
      });
      trackShare('Copy Link');
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isSharing}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareOnX} className="cursor-pointer">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M10 9V5l5 7v-7" />
            <path d="M14 9h-4" />
          </svg>
          Share on X
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
            <path d="M8.5 13.5a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 0-1H9a.5.5 0 0 0-.5.5Z" />
          </svg>
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
          Share on Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
