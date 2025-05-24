import { supabase } from '@/integrations/supabase/client';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Reactions and Analytics', () => {
  let testDealId: number;
  let testEventId: number;
  let testUserId: string;

  beforeAll(async () => {
    // Create a test deal
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .insert({
        title: 'Test Deal',
        description: 'Test Description',
        category: 'Test',
        location: 'Test Location',
        status: 'active'
      })
      .select()
      .single();

    if (dealError) throw dealError;
    testDealId = deal.id;

    // Create a test event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        title: 'Test Event',
        description: 'Test Description',
        category: 'Test',
        location: 'Test Location',
        status: 'active',
        start_date: new Date().toISOString()
      })
      .select()
      .single();

    if (eventError) throw eventError;
    testEventId = event.id;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    testUserId = user.id;
  });

  afterAll(async () => {
    // Clean up test data
    await supabase.from('deals').delete().eq('id', testDealId);
    await supabase.from('events').delete().eq('id', testEventId);
  });

  it('should create a reaction on a deal', async () => {
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        user_id: testUserId,
        item_id: testDealId,
        item_type: 'deal',
        reaction_type: 'like'
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.item_id).toBe(testDealId);
    expect(data.reaction_type).toBe('like');

    // Verify reaction count was updated
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('likes_count')
      .eq('id', testDealId)
      .single();

    expect(dealError).toBeNull();
    expect(deal.likes_count).toBe(1);
  });

  it('should create a reaction on an event', async () => {
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        user_id: testUserId,
        item_id: testEventId,
        item_type: 'event',
        reaction_type: 'heart'
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.item_id).toBe(testEventId);
    expect(data.reaction_type).toBe('heart');

    // Verify reaction count was updated
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('hearts_count')
      .eq('id', testEventId)
      .single();

    expect(eventError).toBeNull();
    expect(event.hearts_count).toBe(1);
  });

  it('should track analytics for a view', async () => {
    const { data, error } = await supabase
      .from('analytics')
      .insert({
        business_id: testUserId,
        user_id: testUserId,
        event_type: 'view',
        event_source: 'deal',
        source_id: testDealId,
        metadata: { source: 'test' }
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.event_type).toBe('view');
    expect(data.source_id).toBe(testDealId);
  });

  it('should prevent duplicate reactions', async () => {
    const { error } = await supabase
      .from('reactions')
      .insert({
        user_id: testUserId,
        item_id: testDealId,
        item_type: 'deal',
        reaction_type: 'like'
      });

    expect(error).not.toBeNull();
    expect(error?.code).toBe('23505'); // Unique violation error code
  });

  it('should allow different reaction types from the same user', async () => {
    const { data, error } = await supabase
      .from('reactions')
      .insert({
        user_id: testUserId,
        item_id: testDealId,
        item_type: 'deal',
        reaction_type: 'heart'
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toBeDefined();
    expect(data.reaction_type).toBe('heart');

    // Verify both reaction counts were updated
    const { data: deal, error: dealError } = await supabase
      .from('deals')
      .select('likes_count, hearts_count')
      .eq('id', testDealId)
      .single();

    expect(dealError).toBeNull();
    expect(deal.likes_count).toBe(1);
    expect(deal.hearts_count).toBe(1);
  });
}); 