import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download, TrendingUp, Users, Eye, MousePointerClick, Share2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsDashboardProps {
  merchantId: string;
  className?: string;
}

export function AnalyticsDashboard({ merchantId, className }: AnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({
    views: [],
    clicks: [],
    shares: [],
    demographics: [],
    sources: []
  });

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, merchantId]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would fetch from Supabase
      // For demo purposes, we'll generate mock data
      
      // Calculate date range
      const endDate = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }
      
      // Generate view data
      const viewData = generateTimeSeriesData(startDate, endDate, 50, 500);
      
      // Generate click data
      const clickData = generateTimeSeriesData(startDate, endDate, 10, 100);
      
      // Generate share data
      const shareData = generateTimeSeriesData(startDate, endDate, 5, 50);
      
      // Generate demographic data
      const demographicData = [
        { name: '18-24', value: Math.floor(Math.random() * 30) + 10 },
        { name: '25-34', value: Math.floor(Math.random() * 40) + 20 },
        { name: '35-44', value: Math.floor(Math.random() * 30) + 15 },
        { name: '45-54', value: Math.floor(Math.random() * 20) + 10 },
        { name: '55+', value: Math.floor(Math.random() * 15) + 5 }
      ];
      
      // Generate source data
      const sourceData = [
        { name: 'Direct', value: Math.floor(Math.random() * 40) + 20 },
        { name: 'Search', value: Math.floor(Math.random() * 30) + 15 },
        { name: 'Social', value: Math.floor(Math.random() * 25) + 10 },
        { name: 'Email', value: Math.floor(Math.random() * 15) + 5 },
        { name: 'Referral', value: Math.floor(Math.random() * 10) + 5 }
      ];
      
      setAnalyticsData({
        views: viewData,
        clicks: clickData,
        shares: shareData,
        demographics: demographicData,
        sources: sourceData
      });
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate time series data
  const generateTimeSeriesData = (startDate: Date, endDate: Date, min: number, max: number) => {
    const data = [];
    const dayDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    
    // Determine interval based on time range
    let interval = 1; // days
    if (dayDiff > 60) {
      interval = 7; // weekly for longer periods
    }
    
    for (let i = 0; i <= dayDiff; i += interval) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      data.push({
        date: currentDate.toISOString().split('T')[0],
        value: Math.floor(Math.random() * (max - min)) + min
      });
    }
    
    return data;
  };

  // Calculate summary metrics
  const calculateMetrics = () => {
    const viewsTotal = analyticsData.views.reduce((sum: number, item: any) => sum + item.value, 0);
    const clicksTotal = analyticsData.clicks.reduce((sum: number, item: any) => sum + item.value, 0);
    const sharesTotal = analyticsData.shares.reduce((sum: number, item: any) => sum + item.value, 0);
    
    const conversionRate = viewsTotal > 0 ? ((clicksTotal / viewsTotal) * 100).toFixed(1) : '0';
    
    return {
      viewsTotal,
      clicksTotal,
      sharesTotal,
      conversionRate
    };
  };

  const metrics = calculateMetrics();

  const exportAnalytics = () => {
    // In a real app, this would generate a CSV or PDF report
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `merchant-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Track performance metrics for your deals and events
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <h3 className="text-2xl font-bold">{metrics.viewsTotal.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <h3 className="text-2xl font-bold">{metrics.clicksTotal.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <MousePointerClick className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <h3 className="text-2xl font-bold">{metrics.conversionRate}%</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                <h3 className="text-2xl font-bold">{metrics.sharesTotal.toLocaleString()}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Share2 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
              <CardDescription>
                Views, clicks, and shares for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.views}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      angle={-45} 
                      textAnchor="end"
                      tick={{ fontSize: 12 }}
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Views" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>
                Age distribution of your audience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.demographics}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.demographics.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.sources}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.sources.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} visits`, 'Count']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
