import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [deals, setDeals] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select('*')
          .limit(3);

        if (dealsError) {
          console.error("Error fetching deals:", dealsError);
        } else {
          setDeals(dealsData || []);
        }

        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .limit(3);

        if (eventsError) {
          console.error("Error fetching events:", eventsError);
        } else {
          setEvents(eventsData || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from('analytics').insert({
          event_type: 'page_view',
          event_source: 'home_page',
          source_id: 0, // Adding a default source_id of 0 for page views
          metadata: { page: 'home' }
        });
        console.log('Page view tracked');
      } catch (error) {
        console.error('Failed to track page view:', error);
      }
    };

    trackPageView();
  }, []);

  if (loading) {
    return <div>Loading deals and events...</div>;
  }

  const handleDealClick = async (dealId: number) => {
    try {
      await supabase.from('analytics').insert({
        event_type: 'deal_click',
        event_source: 'home_page',
        source_id: dealId, // Using the deal ID as the source_id
        metadata: { deal_id: dealId }
      });

      // Update views counter in deals table - fix the type issue by using a raw SQL update
      const { error } = await supabase
        .from('deals')
        .update({ views: views + 1 }) // Use a numeric value instead of a callback
        .eq('id', dealId);
        
      if (error) {
        console.error('Failed to update view count:', error);
      }
    } catch (error) {
      console.error('Failed to track deal click:', error);
    }
  };

  const handleEventClick = async (eventId: number) => {
    try {
      await supabase.from('analytics').insert({
        event_type: 'event_click',
        event_source: 'home_page',
        source_id: eventId, // Using the event ID as the source_id
        metadata: { event_id: eventId }
      });
    } catch (error) {
      console.error('Failed to track event click:', error);
    }
  };

  return (
    <div>
      <h1>Welcome to CityPulse South Africa</h1>
      <section>
        <h2>Deals</h2>
        {deals.length > 0 ? (
          <ul>
            {deals.map(deal => (
              <li key={deal.id}>
                <Link to={`/deals/${deal.id}`} onClick={() => handleDealClick(deal.id)}>
                  {deal.title} - {deal.description}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No deals available.</p>
        )}
        <Link to="/deals">View All Deals</Link>
      </section>

      <section>
        <h2>Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map(event => (
              <li key={event.id}>
                <Link to={`/events/${event.id}`} onClick={() => handleEventClick(event.id)}>
                  {event.title} - {event.description}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events available.</p>
        )}
        <Link to="/events">View All Events</Link>
      </section>
    </div>
  );
};

export default Index;
