import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SaveButtonProps {
  itemId: number;
  itemType: 'deal' | 'event';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
}

export function SaveButton({ itemId, itemType, size = 'sm', className }: SaveButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if the item is saved when the component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('saved_items')
          .select('*')
          .eq('user_id', user.id)
          .eq('item_id', itemId)
          .eq('item_type', itemType)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking saved status:', error);
          return;
        }

        setIsSaved(!!data);
      } catch (error) {
        console.error('Error checking saved status:', error);
      }
    };

    checkIfSaved();
  }, [user, itemId, itemType]);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save items', {
        description: 'Create an account or sign in to save your favorite deals and events.',
        action: {
          label: 'Sign In',
          onClick: () => navigate('/login')
        }
      });
      return;
    }

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const { data, error } = await supabase.rpc('toggle_saved_item', {
        p_user_id: user.id,
        p_item_id: itemId,
        p_item_type: itemType
      });

      if (error) {
        throw error;
      }

      // The function returns true if the item was saved, false if it was removed
      setIsSaved(data);

      toast.success(data ? 'Item saved' : 'Item removed', {
        description: data
          ? `This ${itemType} has been added to your saved items.`
          : `This ${itemType} has been removed from your saved items.`
      });
    } catch (error) {
      console.error('Error toggling saved status:', error);
      toast.error('Failed to save item', {
        description: 'Please try again later.'
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
    <Button
      variant="outline"
      size={size}
      className={cn(
        'transition-all duration-300',
        isSaved && 'bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600',
        isAnimating && 'scale-110',
        className
      )}
      onClick={handleSave}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          'h-4 w-4',
          isSaved && 'fill-red-500'
        )}
      />
      {size !== 'icon' && (
        <span className="ml-1">{isSaved ? 'Saved' : 'Save'}</span>
      )}
    </Button>
  );
}
