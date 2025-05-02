
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc(
      fn: 'increment_deal_views' | 'add_column_if_not_exists' | 'get_reaction_count' | 
         'get_users_with_roles' | 'has_user_reacted' | 'is_admin' | 
         'is_merchant' | 'set_user_role' | 'get_available_functions',
      params?: Record<string, unknown>
    ): any;
  }
}
