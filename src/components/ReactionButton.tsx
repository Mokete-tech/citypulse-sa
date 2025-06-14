
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
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

  const Icon = type === 'like' ? ThumbsUp : ThumbsDown;
  const activeColor = type === 'like' ? 'text-green-600' : 'text-red-600';
  const hoverColor = type === 'like' ? 'hover:text-green-600' : 'hover:text-red-600';

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleClick}
      className={cn(
        "flex items-center space-x-1 transition-colors",
        isActive ? activeColor : "text-gray-500",
        !isActive && hoverColor
      )}
    >
      <Icon className={cn(
        "w-4 h-4",
        isActive && type === 'like' && "fill-green-600",
        isActive && type === 'dislike' && "fill-red-600"
      )} />
      <span className="text-sm font-medium">{count}</span>
    </Button>
  );
};

export default ReactionButton;
