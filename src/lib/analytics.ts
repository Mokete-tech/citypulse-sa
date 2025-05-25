import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

export interface PageView {
  path: string;
  referrer?: string;
  timestamp: number;
}

export interface UserAction {
  type: string;
  target: string;
  value?: string | number;
  timestamp: number;
}

export interface AnalyticsData {
  events: AnalyticsEvent[];
  pageViews: PageView[];
  userActions: UserAction[];
}

export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
  endpoint: string;
  batchSize: number;
  flushInterval: number;
}

export interface AnalyticsProvider {
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  trackPageView: (pageView: PageView) => Promise<void>;
  trackUserAction: (action: UserAction) => Promise<void>;
  flush: () => Promise<void>;
}

export interface AnalyticsError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface AnalyticsResponse {
  success: boolean;
  error?: AnalyticsError;
  data?: AnalyticsData;
}

export interface AnalyticsOptions {
  config?: Partial<AnalyticsConfig>;
  onError?: (error: AnalyticsError) => void;
  onSuccess?: (data: AnalyticsData) => void;
}

/**
 * Track a page view event
 * @param page The page being viewed
 * @param metadata Additional metadata about the page view
 */
export async function trackPageView(page: string, metadata: any = {}) {
  try {
    // Only track in production
    if (import.meta.env.MODE === 'development') {
      return;
    }

    await supabase.from('analytics').insert({
      event_type: 'page_view',
      event_source: page,
      source_id: 0, // Default source ID
      metadata: { page, ...metadata }
    });
  } catch (error) {
    // Just log the error but don't show to user since analytics errors are non-critical
    handleError(error, { silent: true });
  }
}

/**
 * Track a deal view event
 * @param dealId The ID of the deal being viewed
 * @param metadata Additional metadata about the deal view
 */
export async function trackDealView(dealId: number, metadata: any = {}) {
  try {
    // First get the current views count
    const { data: dealData, error: fetchError } = await supabase
      .from('deals')
      .select('views')
      .eq('id', dealId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch view count:', fetchError);
      return;
    }

    // Update views counter in deals table
    const currentViews = dealData?.views || 0;
    const { error } = await supabase
      .from('deals')
      .update({ views: currentViews + 1 })
      .eq('id', dealId);

    if (error) {
      console.error('Failed to update view count:', error);
    }

    // Record the view in analytics
    await supabase.from('analytics').insert({
      event_type: 'deal_view',
      event_source: 'deal_page',
      source_id: dealId,
      metadata: { deal_id: dealId, ...metadata }
    });
  } catch (error) {
    handleError(error, { silent: true });
  }
}

/**
 * Track an event view
 * @param eventId The ID of the event being viewed
 * @param metadata Additional metadata about the event view
 */
export async function trackEventView(eventId: number, metadata: any = {}) {
  try {
    // First get the current views count
    const { data: eventData, error: fetchError } = await supabase
      .from('events')
      .select('views')
      .eq('id', eventId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch view count:', fetchError);
      return;
    }

    // Update views counter in events table
    const currentViews = eventData?.views || 0;
    const { error } = await supabase
      .from('events')
      .update({ views: currentViews + 1 })
      .eq('id', eventId);

    if (error) {
      console.error('Failed to update view count:', error);
    }

    // Record the view in analytics
    await supabase.from('analytics').insert({
      event_type: 'event_view',
      event_source: 'event_page',
      source_id: eventId,
      metadata: { event_id: eventId, ...metadata }
    });
  } catch (error) {
    handleError(error, { silent: true });
  }
}

/**
 * Track a share event
 * @param itemType The type of item being shared (deal or event)
 * @param itemId The ID of the item being shared
 * @param platform The platform the item is being shared to
 * @param metadata Additional metadata about the share
 */
export async function trackShare(
  itemType: 'deal' | 'event', 
  itemId: number, 
  platform: 'facebook' | 'x' | 'linkedin' | 'whatsapp' | 'copy',
  metadata: any = {}
) {
  try {
    // Only track in production
    if (import.meta.env.MODE === 'development') {
      return;
    }

    // Record the share in analytics
    await supabase.from('analytics').insert({
      event_type: 'share',
      event_source: `${itemType}_page`,
      source_id: itemId,
      metadata: { 
        item_type: itemType, 
        item_id: itemId, 
        platform,
        ...metadata 
      }
    });

    // Update shares counter in the appropriate table
    const table = itemType === 'deal' ? 'deals' : 'events';
    
    // First get the current shares count
    const { data: itemData, error: fetchError } = await supabase
      .from(table)
      .select('shares')
      .eq('id', itemId)
      .single();

    if (fetchError) {
      console.error(`Failed to fetch ${itemType} share count:`, fetchError);
      return;
    }

    // Update shares counter
    const currentShares = itemData?.shares || 0;
    const { error } = await supabase
      .from(table)
      .update({ shares: currentShares + 1 })
      .eq('id', itemId);

    if (error) {
      console.error(`Failed to update ${itemType} share count:`, error);
    }
  } catch (error) {
    handleError(error, { silent: true });
  }
}

export default {
  trackPageView,
  trackDealView,
  trackEventView,
  trackShare
};
