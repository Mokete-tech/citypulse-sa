
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { handleSupabaseError } from '@/lib/error-handler';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

// Define reaction button styles with variants
const reactionButtonVariants = cva(
  "font-bold transition-all duration-300 relative overflow-hidden group rounded-full",
  {
    variants: {
      state: {
        active: "bg-gradient-to-r from-blue-600 to-blue-400 text-white border-transparent hover:from-blue-700 hover:to-blue-500 shadow-lg hover:shadow-xl ring-2 ring-blue-300 ring-offset-2 font-extrabold",
        inactive: "bg-white hover:bg-gray-50 border-gray-300 hover:border-blue-400 hover:shadow-md hover:ring-2 hover:ring-blue-200 hover:ring-offset-2"
      },
      animation: {
        pulse: "hover:animate-pulse",
        bounce: "hover:animate-bounce",
        scale: "hover:scale-110 active:scale-95",
        none: ""
      },
      size: {
        sm: "text-xs py-1.5 px-3",
        md: "text-sm py-2 px-4",
        lg: "text-base py-2.5 px-5"
      }
    },
    defaultVariants: {
      state: "inactive",
      animation: "scale",
      size: "md"
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
  animation?: 'pulse' | 'bounce' | 'scale' | 'none';
  iconType?: 'check' | 'thumbsUp';
  buttonSize?: 'sm' | 'md' | 'lg';
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
  animation = 'scale',
  iconType = 'check',
  buttonSize = 'md'
}: ReactionButtonProps) {
  const [count, setCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // isAnimating is set but not directly used in the component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Get reaction count
        const { data: countData, error: countError } = await supabase
          .rpc('get_reaction_count', {
            p_item_id: itemId,
            p_item_type: itemType
          });

        if (countError) throw countError;
        if (isMounted) setCount(countData || 0);

        // Check if user has reacted
        if (user) {
          const { data: hasReactedData, error: hasReactedError } = await supabase
            .rpc('has_user_reacted', {
              p_user_id: user.id,
              p_item_id: itemId,
              p_item_type: itemType
            });

          if (hasReactedError) throw hasReactedError;
          if (isMounted) setHasReacted(hasReactedData || false);
        }
      } catch (error) {
        console.error('Error fetching reaction data:', error);
      }
    };

    fetchData();

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
      if (hasReacted) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('user_id', user.id)
          .eq('item_id', itemId)
          .eq('item_type', itemType);

        if (error) throw error;

        setHasReacted(false);
        setCount(prev => Math.max(0, prev - 1));

        // Show success toast for removing tick
        toast.success('Tick removed', {
          description: `You've removed your tick from this ${itemType}.`
        });
      } else {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .insert({
            user_id: user.id,
            item_id: itemId,
            item_type: itemType,
            reaction_type: 'tick'
          });

        if (error) throw error;

        setHasReacted(true);
        setCount(prev => prev + 1);

        // Show success toast for adding tick
        toast.success('Give it a tick!', {
          description: `You've given this ${itemType} a tick! It's now saved to your profile.`
        });
      }
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error with reaction',
        message: 'Could not process your tick. Please try again.'
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
                size: buttonSize
              }),
              'border-2 transition-all duration-300 font-bold',
              hasReacted ? 'border-blue-400' : 'border-gray-300',
              className
            )}
            onClick={handleReaction}
            disabled={isLoading}
          >
            {/* Reaction icon with animated effect */}
            <span className="relative flex items-center justify-center">
              {iconType === 'check' ? (
                <Check className={cn(
                  'transition-all duration-300',
                  buttonSize === 'sm' ? 'h-4 w-4' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
                  hasReacted ? 'text-white scale-125 stroke-[4] drop-shadow-md' : 'text-gray-600 stroke-[3]',
                  showCount ? 'mr-2' : ''
                )} />
              ) : (
                <ThumbsUp className={cn(
                  'transition-all duration-300',
                  buttonSize === 'sm' ? 'h-4 w-4' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
                  hasReacted ? 'text-white scale-125 stroke-[4] drop-shadow-md' : 'text-gray-600 stroke-[2]',
                  showCount ? 'mr-2' : ''
                )} />
              )}

              {/* Animated effects when active */}
              {hasReacted && (
                <>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-white" />
                  <span className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-blue-200" />
                </>
              )}
            </span>

            {/* Count with animated transition */}
            {showCount && (
              <span className={cn(
                "font-bold transition-all duration-300",
                buttonSize === 'sm' ? 'text-xs' : buttonSize === 'lg' ? 'text-base' : 'text-sm',
                hasReacted ? 'text-white' : 'text-gray-700',
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
  `;
  document.head.appendChild(style);
}
