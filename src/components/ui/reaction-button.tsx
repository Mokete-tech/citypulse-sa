
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { handleSupabaseError } from '@/lib/error-handler';
import { cn } from '@/lib/utils';

interface ReactionButtonProps {
  itemId: number;
  itemType: 'deal' | 'event';
  className?: string;
  showCount?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export function ReactionButton({
  itemId,
  itemType,
  className,
  showCount = true,
  size = 'default',
  variant = 'outline',
}: ReactionButtonProps) {
  const [count, setCount] = useState(0);
  const [hasReacted, setHasReacted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchReactionData();
  }, [itemId, itemType, user]);

  const fetchReactionData = async () => {
    try {
      // Get reaction count
      const { data: countData, error: countError } = await supabase
        .rpc('get_reaction_count' as any, {
          p_item_id: itemId,
          p_item_type: itemType
        });

      if (countError) throw countError;
      setCount(countData || 0);

      // Check if user has reacted
      if (user) {
        const { data: hasReactedData, error: hasReactedError } = await supabase
          .rpc('has_user_reacted' as any, {
            p_user_id: user.id,
            p_item_id: itemId,
            p_item_type: itemType
          });

        if (hasReactedError) throw hasReactedError;
        setHasReacted(hasReactedData || false);
      }
    } catch (error) {
      console.error('Error fetching reaction data:', error);
    }
  };

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
    <Button
      variant={hasReacted ? 'secondary' : variant}
      size={size}
      className={cn(
        className,
        'transition-all duration-200',
        hasReacted && 'bg-green-500 hover:bg-green-600 text-white border-green-500'
      )}
      onClick={handleReaction}
      disabled={isLoading}
    >
      <Check 
        className={cn(
          'h-4 w-4 transition-transform', 
          showCount && 'mr-2',
          hasReacted && 'animate-[scale_0.2s_ease-out] scale-110 stroke-[3]'
        )}
      />
      {showCount && count > 0 && <span className={cn(hasReacted && 'font-medium')}>{count}</span>}
    </Button>
  );
}
