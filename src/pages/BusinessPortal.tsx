import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import BusinessAuth from "@/components/BusinessAuth";
import BusinessDashboard from "@/components/BusinessDashboard";
import VideoUpload from "@/components/VideoUpload";
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, TrendingUp, Users, Star, Eye, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type SupabaseUser = User | null;

const BusinessPortal = () => {
  const [user, setUser] = useState<SupabaseUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = (user: SupabaseUser) => {
    setUser(user);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  const handleVideoUploaded = (videoUrl: string) => {
    console.log('Video uploaded:', videoUrl);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {user ? (
        <BusinessDashboard user={user} onSignOut={handleSignOut} />
      ) : (
        <>
          {/* Header Section */}
          <section className="bg-white py-12 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Business Portal</h1>
                <p className="text-xl text-gray-600">
                  Manage your business presence and boost revenue with CityPulse
                </p>
              </div>
              
              <BusinessAuth onAuthSuccess={handleAuthSuccess} />
            </div>
          </section>

          {/* Video Upload Section */}
          <section className="py-12 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <Video className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Your Business Videos</h2>
                <p className="text-xl text-gray-600">Showcase your products, services, and business story with video content</p>
              </div>
              
              <div className="max-w-2xl mx-auto">
                <VideoUpload 
                  businessId="demo-business"
                  onVideoUploaded={handleVideoUploaded}
                />
              </div>
            </div>
          </section>

          {/* Why Advertise Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Advertise with CityPulse?</h2>
                <p className="text-xl text-gray-600">Join hundreds of local businesses promoting their deals and events.</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">250%</h3>
                  <p className="text-gray-600">Average increase in foot traffic</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">50K+</h3>
                  <p className="text-gray-600">Active users monthly</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9</h3>
                  <p className="text-gray-600">Average business rating</p>
                </div>
              </div>

              {/* Pricing Packages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Deal Packages */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Deal Packages</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Standard: R99/week
                          <Badge variant="outline">Popular</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Basic listing with standard visibility until expiry</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Standard placement in search results
                          </li>
                          <li className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Basic analytics dashboard
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-500">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-blue-600">
                          Premium: R250/week
                          <Badge className="bg-blue-500">Recommended</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Featured placement, enhanced visibility, and analytics until expiry</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Featured placement on homepage
                          </li>
                          <li className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Enhanced analytics & insights
                          </li>
                          <li className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Priority customer support
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Event Packages */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Event Packages</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Standard: R299/event</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Basic listing with standard visibility until event date</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Standard event listing
                          </li>
                          <li className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Basic event analytics
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-500">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between text-purple-600">
                          Premium: R460/event
                          <Badge className="bg-purple-500">Best Value</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">Featured placement, homepage highlight, and social media promotion until event date</p>
                        <ul className="mt-4 space-y-2 text-sm text-gray-600">
                          <li className="flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Homepage featured section
                          </li>
                          <li className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Social media promotion
                          </li>
                          <li className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Detailed analytics & attendee insights
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Benefits Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="w-6 h-6 mr-2" />
                      For Businesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Increase foot traffic and sales by reaching thousands of local customers actively 
                      looking for deals and events in South Africa.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-6 h-6 mr-2" />
                      User Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Create an account to save your favorite deals and events, receive personalized 
                      recommendations, and get notified about new offers in your area.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
      
      <Toaster />
    </div>
  );
};

export default BusinessPortal;
