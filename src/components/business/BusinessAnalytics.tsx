import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

interface AnalyticsData {
  views: number;
  reactions: number;
  shares: number;
  uniqueVisitors: number;
  dailyStats: {
    date: string;
    views: number;
    reactions: number;
    shares: number;
  }[];
}

export function BusinessAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    views: 0,
    reactions: 0,
    shares: 0,
    uniqueVisitors: 0,
    dailyStats: []
  });
  const [timeRange, setTimeRange] = useState('7d');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        // Get date range based on selected time range
        const endDate = new Date();
        const startDate = new Date();
        switch (timeRange) {
          case '7d':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(startDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(startDate.getDate() - 90);
            break;
        }

        // Fetch analytics data
        const { data: analyticsData, error } = await supabase
          .from('analytics')
          .select('*')
          .eq('business_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());

        if (error) throw error;

        // Process analytics data
        const processedData = processAnalyticsData(analyticsData);
        setAnalytics(processedData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [user, timeRange]);

  const processAnalyticsData = (data: any[]): AnalyticsData => {
    const dailyStats: { [key: string]: any } = {};
    let views = 0;
    let reactions = 0;
    let shares = 0;
    const uniqueVisitors = new Set();

    data.forEach(item => {
      const date = format(new Date(item.created_at), 'yyyy-MM-dd');
      
      if (!dailyStats[date]) {
        dailyStats[date] = { date, views: 0, reactions: 0, shares: 0 };
      }

      switch (item.event_type) {
        case 'view':
          views++;
          dailyStats[date].views++;
          uniqueVisitors.add(item.user_id);
          break;
        case 'reaction':
          reactions++;
          dailyStats[date].reactions++;
          break;
        case 'share':
          shares++;
          dailyStats[date].shares++;
          break;
      }
    });

    return {
      views,
      reactions,
      shares,
      uniqueVisitors: uniqueVisitors.size,
      dailyStats: Object.values(dailyStats)
    };
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
        </TabsList>

        <TabsContent value={timeRange}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.views}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.reactions}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.shares}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.uniqueVisitors}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Engagement Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                    <Bar dataKey="reactions" fill="#82ca9d" name="Reactions" />
                    <Bar dataKey="shares" fill="#ffc658" name="Shares" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 