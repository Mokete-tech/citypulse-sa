import { supabase } from '@/integrations/supabase/client';
import { handleError } from './error-handler';
import { toast } from '@/components/ui/sonner';

/**
 * Toggle a reaction (tick) for an item
 * @param itemId The ID of the item (deal or event)
 * @param itemType The type of item ('deal' or 'event')
 * @param userId The user ID (optional, for authenticated users)
 * @returns Promise with the new reaction state and count
 */
export const toggleReaction = async (
  itemId: number,
  itemType: 'deal' | 'event',
  userId?: string | null
): Promise<{ ticked: boolean; count: number }> => {
  try {
    // For anonymous users, we'll use localStorage to track reactions
    if (!userId) {
      return handleAnonymousReaction(itemId, itemType);
    }

    // Check if the user has already reacted
    const { data: existingReaction, error: checkError } = await supabase
      .from('reactions')
      .select('*')
      .eq('item_id', itemId)
      .eq('item_type', itemType)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw checkError;
    }

    // If reaction exists, delete it (untick)
    if (existingReaction) {
      const { error: deleteError } = await supabase
        .from('reactions')
        .delete()
        .eq('id', existingReaction.id);

      if (deleteError) throw deleteError;

      // Get updated count
      const { count, error: countError } = await getReactionCount(itemId, itemType);
      if (countError) throw countError;

      return { ticked: false, count };
    }

    // Otherwise, create a new reaction (tick)
    const { error: insertError } = await supabase
      .from('reactions')
      .insert({
        item_id: itemId,
        item_type: itemType,
        user_id: userId,
        reaction_type: 'tick'
      });

    if (insertError) throw insertError;

    // Get updated count
    const { count, error: countError } = await getReactionCount(itemId, itemType);
    if (countError) throw countError;

    return { ticked: true, count };
  } catch (error) {
    handleError(error, {
      title: 'Failed to update reaction',
      silent: true
    });
    
    // Return current state as fallback
    return { 
      ticked: false, 
      count: await getReactionCount(itemId, itemType).then(r => r.count).catch(() => 0) 
    };
  }
};

/**
 * Handle reactions for anonymous users using localStorage
 */
const handleAnonymousReaction = async (
  itemId: number,
  itemType: 'deal' | 'event'
): Promise<{ ticked: boolean; count: number }> => {
  try {
    const storageKey = `reaction_${itemType}_${itemId}`;
    const currentState = localStorage.getItem(storageKey) === 'true';
    
    // Toggle the state
    const newState = !currentState;
    localStorage.setItem(storageKey, String(newState));
    
    // Get the current count from the database
    const { count, error } = await getReactionCount(itemId, itemType);
    if (error) throw error;
    
    // For anonymous users, we'll increment/decrement the count in the database
    // This isn't perfect as it allows multiple reactions, but it's a simple solution
    if (newState !== currentState) {
      const delta = newState ? 1 : -1;
      
      // Update the count in the database
      // This is a simplified approach - in a real app, you might want to use a more robust solution
      const { error: updateError } = await supabase.rpc(
        'update_anonymous_reaction_count',
        { 
          p_item_id: itemId, 
          p_item_type: itemType, 
          p_delta: delta 
        }
      );
      
      if (updateError) {
        console.error('Failed to update reaction count:', updateError);
        // Fallback: just return the current state without updating the database
        return { ticked: newState, count: count + (newState ? 1 : -1) };
      }
    }
    
    return { ticked: newState, count: count + (newState ? 1 : 0) };
  } catch (error) {
    handleError(error, {
      title: 'Failed to update reaction',
      silent: true
    });
    return { ticked: false, count: 0 };
  }
};

/**
 * Get the reaction count for an item
 */
const getReactionCount = async (
  itemId: number,
  itemType: 'deal' | 'event'
): Promise<{ count: number; error: any }> => {
  try {
    // Try to use the RPC function if available
    const { data, error } = await supabase.rpc(
      'get_reaction_count',
      { p_item_id: itemId, p_item_type: itemType }
    );
    
    if (error) {
      // Fallback: count the reactions directly
      const { count, error: countError } = await supabase
        .from('reactions')
        .select('*', { count: 'exact', head: true })
        .eq('item_id', itemId)
        .eq('item_type', itemType);
      
      if (countError) throw countError;
      return { count: count || 0, error: null };
    }
    
    return { count: data || 0, error: null };
  } catch (error) {
    console.error('Error getting reaction count:', error);
    return { count: 0, error };
  }
};

/**
 * Record a share event in the database
 */
export const recordShare = async (
  itemId: number,
  itemType: 'deal' | 'event',
  platform: 'facebook' | 'twitter' | 'whatsapp',
  userId?: string | null
): Promise<void> => {
  try {
    // Record the share in analytics
    await supabase.from('analytics').insert({
      event_type: 'share',
      event_source: platform,
      source_id: itemId,
      user_id: userId || null,
      metadata: { item_type: itemType }
    });
    
    // Increment the share count on the item
    if (itemType === 'deal') {
      await supabase
        .from('deals')
        .update({ shares: supabase.rpc('increment', { row_id: itemId }) })
        .eq('id', itemId);
    } else if (itemType === 'event') {
      await supabase
        .from('events')
        .update({ shares: supabase.rpc('increment', { row_id: itemId }) })
        .eq('id', itemId);
    }
    
    toast.success('Shared successfully!');
  } catch (error) {
    handleError(error, {
      title: 'Failed to share',
      silent: true
    });
  }
};
