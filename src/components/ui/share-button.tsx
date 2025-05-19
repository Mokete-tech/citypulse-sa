import React from 'react';
import { Button } from './button';
import { Share } from 'lucide-react';

// The rest of the component definition
export function ShareButton() {
  // ... keep existing code

  // Fix for the link.icon error
  const renderLinkIcon = (link: any) => {
    if (!link.icon) return null;
    
    // If icon is a React component
    if (typeof link.icon === 'function' || typeof link.icon === 'object') {
      return React.createElement(link.icon);
    }
    
    // If icon is a string (e.g., a URL)
    return <img src={link.icon} alt={link.name} className="h-5 w-5" />;
  };

  // Use renderLinkIcon instead of <link.icon />

  // ... keep existing code

  return (
    <Button>
      <Share className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
}
