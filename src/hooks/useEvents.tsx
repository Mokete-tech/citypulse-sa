
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CategoryType = Database['public']['Enums']['category_type'];

export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  event_date: string;
  start_time: string;
  price: number;
  image_url: string;
  premium: boolean;
  max_attendees: number;
  current_attendees: number;
}

export const useEvents = (category?: string, searchTerm?: string) => {
  return useQuery({
    queryKey: ['events', category, searchTerm],
    queryFn: async (): Promise<Event[]> => {
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'upcoming');

      if (category && category !== 'All') {
        const categoryMap: Record<string, CategoryType> = {
          'Music': 'music',
          'Food & Drink': 'food_drink',
          'Arts & Culture': 'arts_culture',
          'Sports': 'sports',
          'Business': 'business',
          'Entertainment': 'entertainment',
          'Education': 'education'
        };
        const mappedCategory = categoryMap[category];
        if (mappedCategory) {
          query = query.eq('category', mappedCategory);
        }
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,venue.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.order('event_date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
};

export const useEventRegistration = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in');

      const { error } = await supabase
        .from('event_registrations')
        .insert({ user_id: user.id, event_id: eventId });
      
      if (error) throw error;

      // Update current attendees count
      const { error: updateError } = await supabase.rpc('increment_event_attendees', {
        event_id: eventId
      });
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      toast({
        title: "Success!",
        description: "You've successfully registered for this event."
      });
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
