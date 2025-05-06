
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { DealCard } from '@/components/cards/DealCard';
import { supabase } from '@/integrations/supabase/no-error-client';
import { handleSupabaseError } from '@/lib/error-handler';
import { SearchIcon, Tag, X } from 'lucide-react';
import { fallbackDeals } from '@/data/fallback-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Deals = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get category from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get('category');

  // Category display names mapping
  const categoryNames: Record<string, string> = {
    'food-drink': 'Food & Drink',
    'retail': 'Retail',
    'beauty': 'Beauty',
    'entertainment': 'Entertainment',
    'travel': 'Travel'
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Clear category filter
  const clearCategoryFilter = () => {
    navigate('/deals');
  };

  useEffect(() => {
    fetchDeals();
  }, [categoryFilter]);

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('deals')
        .select('*');

      // Apply category filter if present
      if (categoryFilter) {
        // Convert URL parameter format to database format
        const dbCategory = categoryFilter === 'food-drink'
          ? 'Food & Drink'
          : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1);

        query = query.ilike('category', dbCategory);
      }

      // Add ordering
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // If no results and we have a category filter, use filtered fallback data
      if ((!data || data.length === 0) && categoryFilter) {
        const filteredFallbacks = fallbackDeals.filter(deal =>
          deal.category.toLowerCase().includes(categoryFilter.replace('-', ' '))
        );
        setDeals(filteredFallbacks.length > 0 ? filteredFallbacks : fallbackDeals);
      } else {
        setDeals(data || fallbackDeals);
      }
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading deals',
        message: 'Could not load deals. Using fallback data instead.',
        silent: true
      });

      // If we have a category filter, use filtered fallback data
      if (categoryFilter) {
        const filteredFallbacks = fallbackDeals.filter(deal =>
          deal.category.toLowerCase().includes(categoryFilter.replace('-', ' '))
        );
        setDeals(filteredFallbacks.length > 0 ? filteredFallbacks : fallbackDeals);
      } else {
        setDeals(fallbackDeals);
      }

      setError('Failed to load deals. Showing sample data instead.');
    } finally {
      setLoading(false);
    }
  };

  // Filter deals based on search query
  const filteredDeals = deals.filter(deal =>
    deal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.merchant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Local Deals</h1>
            <p className="text-muted-foreground">
              Explore all the best deals across South Africa.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative w-full max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search deals by name, location, or category..."
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Active category filter */}
            {categoryFilter && (
              <div className="mt-4 flex items-center">
                <span className="text-sm text-muted-foreground mr-2">Filtered by:</span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categoryNames[categoryFilter] || categoryFilter}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={clearCategoryFilter}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              </div>
            )}
          </div>

          <LoadingState isLoading={loading} type="card" count={6}>
            {/* Don't show error in production */}
            {error && !import.meta.env.PROD && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDeals.map(deal => (
                <DealCard
                  key={deal.id}
                  id={deal.id}
                  title={deal.title}
                  description={deal.description}
                  merchant_name={deal.merchant_name}
                  category={deal.category}
                  expiration_date={deal.expiration_date}
                  discount={deal.discount}
                  image_url={deal.image_url}
                  featured={deal.featured}
                />
              ))}
            </div>
          </LoadingState>

          {filteredDeals.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-12 text-center">
              <Tag className="h-12 w-12 text-muted-foreground mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-medium mb-2">No deals found</h3>
              <p className="text-muted-foreground">Try adjusting your search query</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Deals;
