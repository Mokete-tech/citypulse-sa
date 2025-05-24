
import React from 'react';
import { SocialShareButtons } from './social-share-buttons';

interface ShareButtonProps {
  title?: string;
  description?: string;
  url?: string;
  itemId?: string | number;
  itemType?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ShareButton({
  title = "Share this content",
  description = "",
  url = window.location.href,
  itemId,
  itemType,
  size = "default",
  variant = "default"
}: ShareButtonProps) {
  return (
    <SocialShareButtons
      title={title}
      description={description}
      url={url}
      compact={true}
      size={size}
      variant={variant}
    />
  );
}

// Add default export for backward compatibility
export default ShareButton;
