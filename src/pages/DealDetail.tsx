import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { ArrowLeft, MapPin, Calendar, Tag, Store } from 'lucide-react';
import { fallbackDeals } from '@/data/fallback-data';
import { ShareButton } from '@/components/ui/share-button';
import { ReactionButton } from '@/components/ui/reaction-button';
import { toast } from 'sonner';

const DealDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const fetchDeal = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!id) {
          throw new Error('Deal ID is required');
        }

        const { data, error } = await supabase
          .from('deals')
          .select('*')
          .eq('id', parseInt(id || '0', 10))
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setDeal(data);

          // Track view
          await trackDealView(data.id);
        } else {
          // If no deal found, use fallback
          const fallbackDeal = fallbackDeals.find(d => d.id.toString() === id);
          if (fallbackDeal) {
            setDeal(fallbackDeal);
          } else {
            throw new Error('Deal not found');
          }
        }
      } catch (error) {
        handleSupabaseError(error, {
          title: 'Error loading deal',
          message: 'Could not load deal details. Using fallback data if available.',
          silent: true
        });

        // Try to use fallback data
        const fallbackDeal = fallbackDeals.find(d => d.id.toString() === id);
        if (fallbackDeal) {
          setDeal(fallbackDeal);
        } else {
          setError('Deal not found');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDeal();
  }, [id]);

  const trackDealView = async (dealId: number) => {
    try {
      // Track analytics
      await supabase.from('analytics').insert({
        event_type: 'deal_view',
        event_source: 'deal_page',
        source_id: dealId,
        metadata: { deal_id: dealId }
      });

      // Update view count
      const { data: dealData, error: fetchError } = await supabase
        .from('deals')
        .select('views')
        .eq('id', dealId)
        .single();

      if (fetchError) {
        console.error('Failed to fetch view count:', fetchError);
        return;
      }

      const currentViews = dealData?.views || 0;
      await supabase
        .from('deals')
        .update({ views: currentViews + 1 })
        .eq('id', dealId);
    } catch (error) {
      console.error('Failed to track deal view:', error);
    }
  };

  const handleRedeemDeal = async () => {
    try {
      toast.success('Deal redeemed!', {
        description: 'Show this screen to the merchant to claim your deal.'
      });

      // Track redemption
      if (deal?.id) {
        await supabase.from('analytics').insert({
          event_type: 'deal_redemption',
          event_source: 'deal_page',
          source_id: deal.id,
          metadata: { deal_id: deal.id }
        });
      }
    } catch (error) {
      console.error('Failed to track redemption:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 md:p-6">
            <LoadingState isLoading={true} type="card" count={1} />
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={() => navigate('/deals')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Deals
              </Button>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <h2 className="text-xl font-semibold text-red-800 mb-2">
                    {error || 'Deal not found'}
                  </h2>
                  <p className="text-red-600 mb-4">
                    We couldn't find the deal you're looking for.
                  </p>
                  <Button onClick={() => navigate('/deals')}>
                    Browse All Deals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate('/deals')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Deals
            </Button>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {deal.image_url && (
                <div className="w-full h-64 md:h-80 overflow-hidden">
                  <img
                    src={deal.image_url}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    {deal.category && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Tag className="h-3 w-3" />
                        {deal.category}
                      </div>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold">{deal.title}</h1>

                    {deal.merchant_name && (
                      <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                        <Store className="h-4 w-4" />
                        {deal.merchant_name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {deal.featured && (
                      <Badge variant="outline" className="mb-2">Featured</Badge>
                    )}

                    {deal.discount && (
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {deal.discount}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700">{deal.description}</p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t border-b py-4 mb-6">
                  {deal.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{deal.location}</span>
                    </div>
                  )}

                  {deal.expiration_date && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Expires: {deal.expiration_date}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <ReactionButton itemId={typeof deal.id === 'string' ? parseInt(deal.id, 10) : deal.id} itemType="deal" />

                    {/* Share Button Component */}
                    <ShareButton
                      itemId={typeof deal.id === 'string' ? parseInt(deal.id, 10) : deal.id}
                      itemType="deal"
                      title={deal.title}
                    />
                  </div>

                  <Button onClick={handleRedeemDeal} size="lg">
                    Redeem Deal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DealDetail;
