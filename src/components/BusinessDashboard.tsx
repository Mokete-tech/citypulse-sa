
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Eye, Star, DollarSign, Package, Calendar, LogOut } from "lucide-react";
import VideoUpload from "./VideoUpload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BusinessDashboardProps {
  user: any;
  onSignOut: () => void;
}

const BusinessDashboard = ({ user, onSignOut }: BusinessDashboardProps) => {
  const [activePackage, setActivePackage] = useState<string | null>(null);
  const [businessStats, setBusinessStats] = useState({
    views: 1240,
    clicks: 89,
    revenue: 2450
  });
  const { toast } = useToast();

  const handlePackageSelection = (packageType: string, price: number) => {
    toast({
      title: "Package Selected",
      description: `${packageType} package (R${price}) - Payment integration would be implemented here`,
    });
    setActivePackage(packageType);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
    toast({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const handleVideoUploaded = (videoUrl: string) => {
    console.log('Video uploaded for business:', videoUrl);
    toast({
      title: "Video uploaded",
      description: "Your business video is now ready for promotion!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessStats.views}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Clicks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessStats.clicks}</div>
              <p className="text-xs text-muted-foreground">+15.3% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Impact</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R{businessStats.revenue}</div>
              <p className="text-xs text-muted-foreground">+32.4% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Video Upload Section */}
        <VideoUpload 
          businessId={user?.id}
          onVideoUploaded={handleVideoUploaded}
        />

        {/* Package Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Deal Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Deal Promotion Packages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Standard Deal</h3>
                  <Badge variant="outline">R99/week</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Basic listing with standard visibility
                </p>
                <Button 
                  variant={activePackage === 'standard-deal' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handlePackageSelection('Standard Deal', 99)}
                >
                  {activePackage === 'standard-deal' ? 'Active' : 'Select Package'}
                </Button>
              </div>
              
              <div className="border-2 border-blue-500 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-blue-600">Premium Deal</h3>
                  <Badge className="bg-blue-500">R250/week</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Featured placement with enhanced visibility
                </p>
                <Button 
                  variant={activePackage === 'premium-deal' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handlePackageSelection('Premium Deal', 250)}
                >
                  {activePackage === 'premium-deal' ? 'Active' : 'Select Package'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Event Packages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Event Promotion Packages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Standard Event</h3>
                  <Badge variant="outline">R299/event</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Basic event listing until event date
                </p>
                <Button 
                  variant={activePackage === 'standard-event' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handlePackageSelection('Standard Event', 299)}
                >
                  {activePackage === 'standard-event' ? 'Active' : 'Select Package'}
                </Button>
              </div>
              
              <div className="border-2 border-purple-500 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-purple-600">Premium Event</h3>
                  <Badge className="bg-purple-500">R460/event</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Featured placement with social media promotion
                </p>
                <Button 
                  variant={activePackage === 'premium-event' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => handlePackageSelection('Premium Event', 460)}
                >
                  {activePackage === 'premium-event' ? 'Active' : 'Select Package'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
