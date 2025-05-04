import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Mail, Link, Check, MessageCircle, Instagram } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShareButtonProps {
  itemId: number;
  itemType: 'deal' | 'event';
  title: string;
  description?: string;
  imageUrl?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showText?: boolean;
}

export function ShareButton({
  itemId,
  itemType,
  title,
  description = '',
  imageUrl = '',
  className,
  variant = 'outline',
  size = 'sm',
  showText = true
}: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  // Try native share API first if available
  const handleNativeShare = async () => {
    const url = getShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || `Check out this ${itemType}: ${title}`,
          url
        });
        trackShare('Native Share');
        return true;
      } catch (error) {
        // User cancelled or share API failed
        if ((error as Error).name !== 'AbortError') {
          console.error('Error using native share:', error);
        }
        return false;
      }
    }
    return false;
  };

  const shareOnX = async () => {
    // Try native share first
    if (await handleNativeShare()) return;

    const url = getShareUrl();
    const text = `Check out this ${itemType}: ${title}`;
    const shareUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    trackShare('X');
  };

  const shareOnWhatsApp = async () => {
    // Try native share first
    if (await handleNativeShare()) return;

    const url = getShareUrl();
    const text = `Check out this ${itemType}: ${title}\n${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    trackShare('WhatsApp');
  };

  const shareOnFacebook = async () => {
    // Try native share first
    if (await handleNativeShare()) return;

    const url = getShareUrl();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    trackShare('Facebook');
  };

  const shareOnLinkedIn = async () => {
    // Try native share first
    if (await handleNativeShare()) return;

    const url = getShareUrl();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    trackShare('LinkedIn');
  };

  const shareOnTelegram = async () => {
    // Try native share first
    if (await handleNativeShare()) return;

    const url = getShareUrl();
    const text = `Check out this ${itemType}: ${title}`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    trackShare('Telegram');
  };

  const shareViaEmail = async () => {
    // Try native share first
    if (await handleNativeShare()) return;

    const url = getShareUrl();
    const subject = encodeURIComponent(`Check out this ${itemType}: ${title}`);
    const body = encodeURIComponent(`${description || title}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    trackShare('Email');
  };

  const copyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success('Link copied', {
        description: 'The link has been copied to your clipboard.'
      });
      trackShare('Copy Link');

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link:', err);
      toast.error('Failed to copy link');
    });
  };

  // Try native share on mobile devices first
  if (navigator.share && size !== 'icon') {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        disabled={isSharing}
        onClick={handleNativeShare}
      >
        <Share2 className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
        {showText && 'Share'}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={isSharing}
        >
          <Share2 className={`h-4 w-4 ${showText ? 'mr-2' : ''}`} />
          {showText && 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareOnX} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-blue-400" />
          <span>X (Twitter)</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#25D366"
            className="mr-2"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          <span>WhatsApp</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareOnTelegram} className="cursor-pointer">
          <MessageCircle className="h-4 w-4 mr-2 text-blue-500" />
          <span>Telegram</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={shareOnLinkedIn} className="cursor-pointer">
          <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
          <span>LinkedIn</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
          <Mail className="h-4 w-4 mr-2 text-gray-600" />
          <span>Email</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-600" />
          ) : (
            <Link className="h-4 w-4 mr-2 text-gray-600" />
          )}
          <span>{copied ? 'Copied!' : 'Copy link'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
