
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "./error-handler";

/**
 * Creates or checks for the increment_deal_views RPC function in Supabase
 */
export const ensureRpcFunctionsExist = async () => {
  try {
    // Check if the function exists by calling it with an invalid ID
    // This is just to detect if the function exists, it should fail with a constraint error rather than function not found
    await supabase.rpc('increment_deal_views', { deal_id: -1 } as any);
    console.log("RPC functions are available");
    return true;
  } catch (error: any) {
    // If the error is because the function doesn't exist, it will contain a specific message
    if (error?.message?.includes('function "increment_deal_views" does not exist')) {
      console.error("Required RPC function is missing. Please create it in the Supabase SQL editor");
      return false;
    }
    // Other errors (like constraint violations) mean the function exists
    return true;
  }
};

/**
 * Fallback method to increment deal views if the RPC function is unavailable
 * This is less optimal as it requires two database calls
 */
export const incrementDealViewsFallback = async (dealId: number): Promise<void> => {
  try {
    // First get the current view count
    const { data, error: fetchError } = await supabase
      .from('deals')
      .select('views')
      .eq('id', dealId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with the incremented value
    const currentViews = data?.views || 0;
    const newViews = currentViews + 1;
    
    const { error: updateError } = await supabase
      .from('deals')
      .update({ views: newViews })
      .eq('id', dealId);
    
    if (updateError) throw updateError;
  } catch (error) {
    handleError(error, {
      title: "Failed to update view count",
      silent: true
    });
  }
};
