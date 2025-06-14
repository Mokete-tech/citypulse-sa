
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CategoryType = Database['public']['Enums']['category_type'];

export interface Deal {
  id: string;
  business_id: string;
  title: string;
  description: string;
  category: string;
  discount_text: string;
  discount_percentage: number;
  original_price: number;
  discounted_price: number;
  image_url: string;
  featured: boolean;
  expires_at: string;
  businesses: {
    name: string;
    rating: number;
  };
}

export const useDeals = (category?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['deals', category, searchTerm],
    queryFn: async (): Promise<Deal[]> => {
      let query = supabase
        .from('deals')
        .select(`
          *,
          businesses!inner(name, rating)
        `)
        .eq('status', 'active');

      if (category && category !== 'All') {
        const categoryMap: Record<string, CategoryType> = {
          'Food & Drink': 'food_drink',
          'Retail': 'retail',
          'Beauty': 'beauty',
          'Entertainment': 'entertainment',
          'Health & Fitness': 'health_fitness',
          'Travel': 'travel'
        };
        const mappedCategory = categoryMap[category];
        if (mappedCategory) {
          query = query.eq('category', mappedCategory);
        }
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,businesses.name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useFavoriteToggle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ dealId, isFavorite }: { dealId: string; isFavorite: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('deal_id', dealId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, deal_id: dealId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};

export const useReactionToggle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ dealId, reactionType }: { dealId: string; reactionType: 'like' | 'dislike' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      // Check if reaction exists
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('deal_id', dealId)
        .single();

      if (existingReaction) {
        if (existingReaction.reaction_type === reactionType) {
          // Remove reaction if same type
          const { error } = await supabase
            .from('reactions')
            .delete()
            .eq('user_id', user.id)
            .eq('deal_id', dealId);
          if (error) throw error;
        } else {
          // Update reaction type
          const { error } = await supabase
            .from('reactions')
            .update({ reaction_type: reactionType })
            .eq('user_id', user.id)
            .eq('deal_id', dealId);
          if (error) throw error;
        }
      } else {
        // Create new reaction
        const { error } = await supabase
          .from('reactions')
          .insert({ user_id: user.id, deal_id: dealId, reaction_type: reactionType });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['reactions'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
};
