
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import { DealCard } from '@/components/cards/DealCard';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { Search, Tag } from 'lucide-react';
import { fallbackDeals } from '@/data/fallback-data';

const Deals = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setDeals(data || fallbackDeals);
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error loading deals',
        message: 'Could not load deals. Using fallback data instead.',
        silent: true
      });
      setError('Failed to load deals. Showing sample data instead.');
      setDeals(fallbackDeals);
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search deals by name, location, or category..."
                className="pl-10 w-full bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <LoadingState isLoading={loading} type="card" count={6}>
            {error && (
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
