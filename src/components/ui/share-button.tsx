import React from 'react';
import { Button } from './button';
import { Share } from 'lucide-react';

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
  const renderLinkIcon = (link: any) => {
    if (!link.icon) return null;
    
    // If icon is a React component
    if (typeof link.icon === 'function' || typeof link.icon === 'object') {
      return React.createElement(link.icon);
    }
    
    // If icon is a string (e.g., a URL)
    return <img src={link.icon} alt={link.name} className="h-5 w-5" />;
  };

  return (
    <Button size={size} variant={variant}>
      <Share className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
}

// Add default export for backward compatibility
export default ShareButton;
