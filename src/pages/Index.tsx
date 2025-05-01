import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/components/ui/sonner';
import { handleSupabaseError } from '@/lib/error-handler';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchDeals();
    fetchEvents();
  }, []);

  const fetchDeals = async () => {
    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .limit(3);

      if (error) {
        throw error;
      }

      setDeals(data || []);
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading deals',
        message: 'Could not load deals.',
        silent: true
      });
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .limit(3);

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading events',
        message: 'Could not load events.',
        silent: true
      });
    }
  };

  const incrementDealViews = async (dealId: number) => {
  // Check if RPC function is available
  let rpcAvailable = true;
  try {
    // Try to get a list of available functions
    const { data: functions, error } = await supabase.rpc('get_available_functions' as any);
    if (error || !functions || !functions.includes('increment_deal_views')) {
      rpcAvailable = false;
    }
  } catch {
    rpcAvailable = false;
  }

  try {
    // Increment view count using RPC function or fallback
    if (rpcAvailable) {
      const { error } = await supabase.rpc('increment_deal_views' as any, { deal_id: dealId } as any);
      if (error) {
        console.error('Failed to update view count with RPC:', error);
        await incrementDealViewsFallback(dealId);
      }
    } else {
      await incrementDealViewsFallback(dealId);
    }
  } catch (error) {
    console.error('Error incrementing deal views:', error);
    // Silent failure for view counts - don't affect user experience
  }
};

  const incrementDealViewsFallback = async (dealId: number) => {
    try {
      const { data: existingViews, error: selectError } = await supabase
        .from('deals')
        .select('views')
        .eq('id', dealId)
        .single();

      if (selectError) {
        throw selectError;
      }

      const currentViews = existingViews?.views || 0;
      const newViews = currentViews + 1;

      const { error: updateError } = await supabase
        .from('deals')
        .update({ views: newViews })
        .eq('id', dealId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error('Fallback failed to update view count:', error);
      // Still a silent failure - don't disrupt user experience
    }
  };

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <p>Check out these deals:</p>
      <ul>
        {deals.map(deal => (
          <li key={deal.id}>
            <Link to={`/deals/${deal.id}`} onClick={() => incrementDealViews(deal.id)}>
              {deal.title}
            </Link>
          </li>
        ))}
      </ul>
      <p>Upcoming Events:</p>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
      <Button asChild>
        <Link to="/deals">View All Deals</Link>
      </Button>
    </div>
  );
};

export default Index;
