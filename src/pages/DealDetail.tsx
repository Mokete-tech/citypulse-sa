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
import { ReactionShare } from "@/components/ui/reaction-share";
import { format } from 'date-fns';

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

            <div className="bg-card rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64 md:h-96">
                <img
                  src={deal?.image_url || '/placeholder-deal.jpg'}
                  alt={deal?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{deal?.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Valid until {format(new Date(deal?.end_date || ''), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{deal?.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="text-sm">
                      {deal?.category}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {deal?.status}
                    </Badge>
                    {deal?.discount_percentage && (
                      <Badge variant="destructive" className="text-sm">
                        {deal?.discount_percentage}% OFF
                      </Badge>
                    )}
                  </div>
                  <ReactionShare
                    itemId={deal?.id || 0}
                    itemType="deal"
                    initialReactions={{
                      likes: deal?.likes_count || 0,
                      hearts: deal?.hearts_count || 0,
                      comments: deal?.comments_count || 0
                    }}
                  />
                </div>

                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-6">{deal?.description}</p>
                  
                  {deal?.terms && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Terms & Conditions</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {deal?.terms.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {deal?.highlights && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Highlights</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {deal?.highlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1" size="lg">
                    Get Deal
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    Save for Later
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
