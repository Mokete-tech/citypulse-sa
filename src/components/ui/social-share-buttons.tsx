
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Facebook, Twitter, Linkedin, Mail, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  compact?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SocialShareButtons({
  title,
  description = "",
  url = window.location.href,
  compact = true,
  variant = "outline",
  size = "sm"
}: SocialShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      name: 'Email',
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
    }
  ];

  // Handle native share if available
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        toast.success('Shared successfully');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error('Could not copy text:', err);
        toast.error('Failed to copy link');
      }
    );
  };

  // Compact version just shows the share button
  if (compact) {
    return (
      <Button 
        onClick={handleShare} 
        variant={variant} 
        size={size}
        className="gap-1"
      >
        <Share className="h-4 w-4" />
        {size !== "icon" && "Share"}
      </Button>
    );
  }

  // Full version shows all social sharing options
  return (
    <div className="flex flex-wrap gap-2">
      {navigator.share && (
        <Button
          onClick={handleShare}
          variant={variant}
          size={size}
          className="gap-1"
        >
          <Share className="h-4 w-4" />
          {size !== "icon" && "Share"}
        </Button>
      )}
      
      {socialLinks.map((social) => (
        <Button
          key={social.name}
          onClick={() => window.open(social.url, '_blank')}
          variant={variant}
          size={size}
          title={`Share on ${social.name}`}
          className="gap-1"
        >
          <social.icon className="h-4 w-4" />
          {size !== "icon" && social.name}
        </Button>
      ))}
      
      <Button
        onClick={copyToClipboard}
        variant={variant}
        size={size}
        title="Copy link to clipboard"
        className="gap-1"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {size !== "icon" && (copied ? "Copied" : "Copy")}
      </Button>
    </div>
  );
}
