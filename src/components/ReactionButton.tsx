
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReactionButtonProps {
  type: 'like' | 'dislike';
  initialCount?: number;
  size?: 'sm' | 'default' | 'lg';
  onReaction?: (type: 'like' | 'dislike', count: number) => void;
}

const ReactionButton = ({ 
  type, 
  initialCount = 0, 
  size = 'default',
  onReaction 
}: ReactionButtonProps) => {
  const [count, setCount] = useState(initialCount);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    const newActive = !isActive;
    const newCount = newActive ? count + 1 : count - 1;
    
    setIsActive(newActive);
    setCount(newCount);
    
    if (onReaction) {
      onReaction(type, newCount);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      className={cn(
        "flex items-center space-x-1 transition-colors",
        isActive ? "text-red-500" : "text-gray-500",
        "hover:text-red-500"
      )}
    >
      <Heart className={cn(
        "w-4 h-4 transition-all",
        isActive && "fill-red-500 text-red-500"
      )} />
      <span className="text-sm font-medium">{count}</span>
    </Button>
  );
};

export default ReactionButton;
