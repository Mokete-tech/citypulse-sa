import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Search, Tag, Calendar, Store, MapPin, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { toast } from 'sonner';

interface SearchResult {
  id: number;
  title: string;
  type: 'deal' | 'event' | 'merchant';
  category?: string;
  location?: string;
  merchant_name?: string;
  date?: string;
  image_url?: string;
}

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Open search dialog with keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    
    try {
      // Search deals
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, title, category, merchant_name, image_url')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,merchant_name.ilike.%${query}%`)
        .limit(5);
        
      if (dealsError) throw dealsError;
      
      // Search events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, title, category, location, date, image_url')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(5);
        
      if (eventsError) throw eventsError;
      
      // Search merchants
      const { data: merchants, error: merchantsError } = await supabase
        .from('merchants')
        .select('id, name, category, location, logo_url')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(5);
        
      if (merchantsError) throw merchantsError;
      
      // Format results
      const formattedDeals = (deals || []).map(deal => ({
        id: deal.id,
        title: deal.title,
        type: 'deal' as const,
        category: deal.category,
        merchant_name: deal.merchant_name,
        image_url: deal.image_url
      }));
      
      const formattedEvents = (events || []).map(event => ({
        id: event.id,
        title: event.title,
        type: 'event' as const,
        category: event.category,
        location: event.location,
        date: event.date,
        image_url: event.image_url
      }));
      
      const formattedMerchants = (merchants || []).map(merchant => ({
        id: merchant.id,
        title: merchant.name,
        type: 'merchant' as const,
        category: merchant.category,
        location: merchant.location,
        image_url: merchant.logo_url
      }));
      
      // Combine results
      setResults([
        ...formattedDeals,
        ...formattedEvents,
        ...formattedMerchants
      ]);
      
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Search failed',
        message: 'Failed to perform search. Please try again.',
        silent: true
      });
      
      // Provide empty results
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    
    // Track search selection in analytics
    try {
      supabase.from('analytics').insert({
        event_type: 'search_select',
        event_source: 'global_search',
        source_id: result.id,
        metadata: {
          query,
          result_type: result.type,
          result_id: result.id,
          result_title: result.title
        }
      });
    } catch (error) {
      console.error('Failed to track search selection:', error);
    }
    
    // Navigate to the appropriate page
    switch (result.type) {
      case 'deal':
        navigate(`/deals/${result.id}`);
        break;
      case 'event':
        navigate(`/events/${result.id}`);
        break;
      case 'merchant':
        navigate(`/merchants/${result.id}`);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deal':
        return <Tag className="h-4 w-4 mr-2" />;
      case 'event':
        return <Calendar className="h-4 w-4 mr-2" />;
      case 'merchant':
        return <Store className="h-4 w-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="inline-flex">
          <Search className="mr-2 h-4 w-4" />
          Search...
        </span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals, events, merchants..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
          {query && (
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 rounded-md"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CommandList>
          {loading && (
            <div className="py-6 text-center text-sm">
              <div className="animate-pulse">Searching...</div>
            </div>
          )}
          
          {!loading && query && results.length === 0 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          
          {!loading && results.length > 0 && (
            <>
              {results.filter(r => r.type === 'deal').length > 0 && (
                <CommandGroup heading="Deals">
                  {results
                    .filter(result => result.type === 'deal')
                    .map(result => (
                      <CommandItem
                        key={`deal-${result.id}`}
                        onSelect={() => handleSelect(result)}
                        className="flex items-center"
                      >
                        {getIcon(result.type)}
                        <div className="flex flex-col">
                          <span>{result.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {result.merchant_name} • {result.category}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
              
              {results.filter(r => r.type === 'event').length > 0 && (
                <>
                  {results.filter(r => r.type === 'deal').length > 0 && (
                    <CommandSeparator />
                  )}
                  <CommandGroup heading="Events">
                    {results
                      .filter(result => result.type === 'event')
                      .map(result => (
                        <CommandItem
                          key={`event-${result.id}`}
                          onSelect={() => handleSelect(result)}
                          className="flex items-center"
                        >
                          {getIcon(result.type)}
                          <div className="flex flex-col">
                            <span>{result.title}</span>
                            <span className="text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {result.location} • {result.date}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
              
              {results.filter(r => r.type === 'merchant').length > 0 && (
                <>
                  {(results.filter(r => r.type === 'deal').length > 0 || 
                    results.filter(r => r.type === 'event').length > 0) && (
                    <CommandSeparator />
                  )}
                  <CommandGroup heading="Merchants">
                    {results
                      .filter(result => result.type === 'merchant')
                      .map(result => (
                        <CommandItem
                          key={`merchant-${result.id}`}
                          onSelect={() => handleSelect(result)}
                          className="flex items-center"
                        >
                          {getIcon(result.type)}
                          <div className="flex flex-col">
                            <span>{result.title}</span>
                            <span className="text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 inline mr-1" />
                              {result.location} • {result.category}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
            </>
          )}
          
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate('/deals');
              }}
            >
              <Tag className="mr-2 h-4 w-4" />
              <span>Browse all deals</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setOpen(false);
                navigate('/events');
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Browse all events</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
