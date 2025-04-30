import React, { useState, useEffect } from 'react';
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
        active: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-transparent hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg",
        inactive: "bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 hover:shadow-md"
      },
      animation: {
        pulse: "hover:animate-pulse",
        bounce: "hover:animate-bounce",
        scale: "hover:scale-105 active:scale-95",
        none: ""
      },
      size: {
        sm: "text-xs py-1 px-2",
        md: "text-sm py-1.5 px-3",
        lg: "text-base py-2 px-4"
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
  variant = 'outline',
  animation = 'scale',
  iconType = 'check',
  buttonSize = 'md'
}: ReactionButtonProps) {
  const [count, setCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      toast.error('Please sign in to react', {
        description: 'You need to be signed in to react to this item.'
      });
      return;
    }

    setIsLoading(true);

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
      }
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error with reaction',
        message: 'Could not process your reaction. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="custom"
            size={size}
            className={cn(
              reactionButtonVariants({
                state: hasReacted ? 'active' : 'inactive',
                animation,
                size: buttonSize
              }),
              'border-2 transition-all duration-300',
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
                  buttonSize === 'sm' ? 'h-3.5 w-3.5' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
                  hasReacted ? 'text-white scale-110 stroke-[3]' : 'text-gray-600',
                  showCount ? 'mr-1.5' : ''
                )} />
              ) : (
                <ThumbsUp className={cn(
                  'transition-all duration-300',
                  buttonSize === 'sm' ? 'h-3.5 w-3.5' : buttonSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5',
                  hasReacted ? 'text-white scale-110 stroke-[3]' : 'text-gray-600',
                  showCount ? 'mr-1.5' : ''
                )} />
              )}

              {/* Animated ring effect when active */}
              {hasReacted && (
                <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-white" />
              )}
            </span>

            {/* Count with animated transition */}
            {showCount && (
              <span className={cn(
                "font-bold transition-all duration-300",
                buttonSize === 'sm' ? 'text-xs' : buttonSize === 'lg' ? 'text-base' : 'text-sm',
                hasReacted ? 'text-white' : 'text-gray-700',
                count > 0 ? 'opacity-100' : 'opacity-0'
              )}>
                {count}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hasReacted ? 'Remove your tick' : 'Give it a tick'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
