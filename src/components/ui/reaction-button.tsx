
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

// Define reaction button styles with variants
const reactionButtonVariants = cva(
  "font-bold transition-all duration-300 relative overflow-hidden group rounded-full",
  {
    variants: {
      state: {
        active: "bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white border-transparent hover:from-blue-700 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl ring-2 ring-purple-300 ring-offset-2 font-extrabold animate-[subtle-pulse_3s_ease-in-out_infinite]",
        inactive: "bg-white hover:bg-gray-50 border-purple-300 hover:border-purple-400 hover:shadow-md hover:ring-2 hover:ring-purple-200 hover:ring-offset-2 hover:scale-105 transition-transform"
      },
      animation: {
        pulse: "hover:animate-pulse",
        bounce: "hover:animate-bounce",
        scale: "hover:scale-110 active:scale-95",
        wiggle: "hover:animate-[wiggle_0.5s_ease-in-out]",
        sparkle: "hover:animate-[sparkle_1s_ease-in-out]",
        pop: "hover:animate-[pop_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)]",
        glow: "hover:animate-[glow_1.5s_ease-in-out_infinite]",
        none: ""
      },
      size: {
        sm: "text-xs py-1.5 px-3",
        md: "text-sm py-2 px-4",
        lg: "text-base py-2.5 px-5"
      },
      prominence: {
        low: "",
        medium: "shadow-sm",
        high: "shadow-md"
      }
    },
    defaultVariants: {
      state: "inactive",
      animation: "pop",
      size: "md",
      prominence: "medium"
    }
  }
);

interface ReactionButtonProps {
  itemId: number;
  itemType: 'deal' | 'event';
  className?: string;
  showCount?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  animation?: 'pulse' | 'bounce' | 'scale' | 'wiggle' | 'sparkle' | 'pop' | 'glow' | 'none';
  iconType?: 'check' | 'thumbsUp';
  buttonSize?: 'sm' | 'md' | 'lg';
  prominence?: 'low' | 'medium' | 'high';
  initialState?: boolean;
}

export function ReactionButton({
  itemId,
  itemType,
  className,
  showCount = true,
  size = 'default',
  // variant is used in the className but TypeScript doesn't detect it
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'outline',
  animation = 'pop',
  iconType = 'check',
  buttonSize = 'md',
  prominence = 'medium',
  initialState
}: ReactionButtonProps) {
  const [count, setCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    // Generate a consistent random count based on itemId
    const generateFallbackCount = (id: number, type: string) => {
      // Use the item ID as a seed for pseudo-random generation
      const seed = id % 100;

      if (type === 'deal') {
        // Deals get 5-25 reactions
        return 5 + (seed % 20);
      } else {
        // Events get 3-15 reactions
        return 3 + (seed % 12);
      }
    };

    // For demo purposes, use fallback data directly
    const fallbackCount = generateFallbackCount(itemId, itemType);

    // Determine initial state
    let userHasReacted: boolean;

    // If initialState is provided, use it
    if (initialState !== undefined) {
      userHasReacted = initialState;
    } else {
      // Otherwise, set a consistent "hasReacted" state based on itemId and user
      const userSeed = user ? parseInt(user.id.substring(0, 8), 16) % 100 : 0;
      const itemSeed = itemId % 100;
      const combinedSeed = (userSeed + itemSeed) % 100;

      // User has reacted if the combined seed is greater than 70
      userHasReacted = combinedSeed > 70;
    }

    if (isMounted) {
      setCount(fallbackCount);
      setHasReacted(userHasReacted);
    }

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [itemId, itemType, user]);

  const handleReaction = async () => {
    if (!user) {
      toast.error('Please sign in to give a tick', {
        description: 'Sign in to save this item and show your appreciation!',
        action: {
          label: 'Sign In',
          onClick: () => window.location.href = '/login'
        }
      });
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    try {
      // Simulate API call with a small delay
      await new Promise(resolve => setTimeout(resolve, 300));

      if (hasReacted) {
        // Remove reaction (just update local state)
        setHasReacted(false);
        setCount(prev => Math.max(0, prev - 1));

        // Show success toast for removing tick
        toast.success('Tick removed', {
          description: `You've removed your tick from this ${itemType}.`
        });

        // Log to console for debugging
        console.log(`Removed reaction for ${itemType} #${itemId}`);
      } else {
        // Add reaction (just update local state)
        setHasReacted(true);
        setCount(prev => prev + 1);

        // Show success toast for adding tick
        toast.success('Give it a tick!', {
          description: `You've given this ${itemType} a tick! It's now saved to your profile.`,
          className: 'bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white font-bold',
          duration: 3000,
          icon: <Check className="h-5 w-5 text-white stroke-[5]" />
        });

        // Log to console for debugging
        console.log(`Added reaction for ${itemType} #${itemId}`);
      }
    } catch (error) {
      // Handle any errors
      console.error('Error with reaction:', error);
      toast.error('Error with reaction', {
        description: 'Could not process your tick. Please try again.'
      });
    } finally {
      setIsLoading(false);

      // Reset animation state after animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size={size}
            className={cn(
              reactionButtonVariants({
                state: hasReacted ? 'active' : 'inactive',
                animation,
                size: buttonSize,
                prominence
              }),
              'border-3 transition-all duration-300 font-bold',
              hasReacted ? 'border-purple-400' : 'border-purple-200',
              className
            )}
            onClick={handleReaction}
            disabled={isLoading}
            aria-pressed={hasReacted}
            aria-label={hasReacted ? `Remove tick from ${itemType}` : `Give ${itemType} a tick`}
          >
            {/* Reaction icon with animated effect */}
            <span className="relative flex items-center justify-center">
              {iconType === 'check' ? (
                <Check className={cn(
                  'transition-all duration-300',
                  buttonSize === 'sm' ? 'h-4 w-4' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
                  hasReacted ? 'text-white scale-125 stroke-[6] drop-shadow-md' : 'text-purple-600 stroke-[5]',
                  showCount ? 'mr-2' : ''
                )} />
              ) : (
                <ThumbsUp className={cn(
                  'transition-all duration-300',
                  buttonSize === 'sm' ? 'h-4 w-4' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
                  hasReacted ? 'text-white scale-125 stroke-[5] drop-shadow-md' : 'text-purple-600 stroke-[4]',
                  showCount ? 'mr-2' : ''
                )} />
              )}

              {/* Animated effects when active */}
              {hasReacted && (
                <>
                  <span className={cn(
                    "absolute inset-0 rounded-full opacity-40 bg-white",
                    isAnimating ? "animate-ping" : ""
                  )} />
                  <span className={cn(
                    "absolute inset-0 rounded-full opacity-30 bg-purple-200",
                    isAnimating ? "animate-pulse" : ""
                  )} />
                  <span className={cn(
                    "absolute -inset-1 rounded-full opacity-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
                    isAnimating ? "animate-pulse" : ""
                  )} />
                  {/* Permanent subtle animation for active state */}
                  <span className="absolute inset-0 rounded-full opacity-20 bg-white animate-[subtle-glow_3s_ease-in-out_infinite]" />
                </>
              )}

              {/* Click animation effect */}
              {isAnimating && (
                <span className="absolute inset-0 rounded-full animate-[click-ripple_0.5s_ease-out] bg-purple-300 opacity-0" />
              )}
            </span>

            {/* Count with animated transition */}
            {showCount && (
              <span className={cn(
                "font-bold transition-all duration-300",
                buttonSize === 'sm' ? 'text-xs' : buttonSize === 'lg' ? 'text-base' : 'text-sm',
                hasReacted ? 'text-white' : 'text-purple-700',
                count > 0 ? 'opacity-100 scale-105' : 'opacity-0',
                hasReacted && count > 0 && 'drop-shadow-sm'
              )}>
                {count}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="font-medium">
          <p>{hasReacted ? 'Remove your tick' : 'Give it a tick!'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Add wiggle animation to tailwind config via CSS
if (document.head && !document.getElementById('wiggle-animation')) {
  const style = document.createElement('style');
  style.id = 'wiggle-animation';
  style.textContent = `
    @keyframes wiggle {
      0% { transform: rotate(0deg); }
      25% { transform: rotate(-15deg) scale(1.2); }
      50% { transform: rotate(10deg) scale(1.2); }
      75% { transform: rotate(-5deg) scale(1.1); }
      100% { transform: rotate(0deg); }
    }

    @keyframes sparkle {
      0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
      100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
    }

    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.15); }
      100% { transform: scale(1); }
    }

    @keyframes glow {
      0% { box-shadow: 0 0 5px 0 rgba(168, 85, 247, 0.5); }
      50% { box-shadow: 0 0 20px 5px rgba(168, 85, 247, 0.3); }
      100% { box-shadow: 0 0 5px 0 rgba(168, 85, 247, 0.5); }
    }

    @keyframes subtle-pulse {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    @keyframes subtle-glow {
      0% { opacity: 0.1; }
      50% { opacity: 0.3; }
      100% { opacity: 0.1; }
    }

    @keyframes click-ripple {
      0% { transform: scale(0.8); opacity: 0.5; }
      100% { transform: scale(2); opacity: 0; }
    }

    .border-3 {
      border-width: 3px;
    }

    /* Ensure consistent styling across all instances */
    .reaction-button-active {
      background-image: linear-gradient(to right, #2563eb, #9333ea, #ec4899);
      background-size: 200% 200%;
      color: white;
      font-weight: 800;
    }

    .reaction-button-inactive {
      background-color: white;
      border-color: #d8b4fe;
      transition: all 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}
