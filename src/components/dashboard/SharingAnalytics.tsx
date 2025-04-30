import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { handleError } from '@/lib/error-handler';
import { LoadingState } from '@/components/ui/loading-state';
import { Share2, TrendingUp, Users } from 'lucide-react';

interface SharingAnalyticsProps {
  merchantId?: string;
}

interface ShareData {
  platform: string;
  count: number;
  color: string;
}

interface TimeSeriesData {
  date: string;
  shares: number;
}

const PLATFORM_COLORS = {
  facebook: '#1877F2',
  x: '#000000',
  linkedin: '#0A66C2',
  whatsapp: '#25D366',
  copy: '#6B7280',
  native: '#3B82F6'
};

const SharingAnalytics: React.FC<SharingAnalyticsProps> = ({ merchantId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformData, setPlatformData] = useState<ShareData[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [totalShares, setTotalShares] = useState(0);
  const [activeTab, setActiveTab] = useState('deals');

  useEffect(() => {
    fetchSharingAnalytics();
  }, [merchantId, activeTab]);

  const fetchSharingAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch platform distribution data
      const { data: platformDistribution, error: platformError } = await supabase
        .from('analytics')
        .select('metadata')
        .eq('event_type', 'share')
        .eq('event_source', `${activeTab}_page`)
        .order('created_at', { ascending: false });

      if (platformError) throw platformError;

      // Process platform data
      const platformCounts: Record<string, number> = {};
      platformDistribution?.forEach(item => {
        const platform = item.metadata?.platform || 'unknown';
        platformCounts[platform] = (platformCounts[platform] || 0) + 1;
      });

      const formattedPlatformData: ShareData[] = Object.entries(platformCounts).map(([platform, count]) => ({
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        count,
        color: PLATFORM_COLORS[platform as keyof typeof PLATFORM_COLORS] || '#CBD5E1'
      }));

      setPlatformData(formattedPlatformData);
      setTotalShares(formattedPlatformData.reduce((sum, item) => sum + item.count, 0));

      // Fetch time series data (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: timeSeriesRaw, error: timeSeriesError } = await supabase
        .from('analytics')
        .select('created_at')
        .eq('event_type', 'share')
        .eq('event_source', `${activeTab}_page`)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (timeSeriesError) throw timeSeriesError;

      // Process time series data
      const dateMap: Record<string, number> = {};
      
      // Initialize all dates in the last 30 days
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dateMap[dateStr] = 0;
      }

      // Count shares by date
      timeSeriesRaw?.forEach(item => {
        const dateStr = new Date(item.created_at).toISOString().split('T')[0];
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
      });

      // Convert to array and sort by date
      const formattedTimeSeriesData: TimeSeriesData[] = Object.entries(dateMap)
        .map(([date, shares]) => ({ date, shares }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setTimeSeriesData(formattedTimeSeriesData);
    } catch (err) {
      handleError(err, {
        title: 'Failed to load sharing analytics',
        message: 'There was a problem fetching the sharing analytics data.'
      });
      setError('Failed to load sharing analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Sharing Analytics</CardTitle>
            <CardDescription>Track how users are sharing your content</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
        </Tabs>

        <LoadingState isLoading={loading} type="card" count={1}>
          {error ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                        <h3 className="text-2xl font-bold">{totalShares}</h3>
                      </div>
                      <Share2 className="h-8 w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Most Popular Platform</p>
                        <h3 className="text-2xl font-bold">
                          {platformData.length > 0 
                            ? platformData.sort((a, b) => b.count - a.count)[0].platform 
                            : 'N/A'}
                        </h3>
                      </div>
                      <TrendingUp className="h-8 w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Potential Reach</p>
                        <h3 className="text-2xl font-bold">{totalShares * 25}+</h3>
                      </div>
                      <Users className="h-8 w-8 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Distribution Chart */}
              <div>
                <h3 className="text-lg font-medium mb-4">Platform Distribution</h3>
                <div className="h-[300px]">
                  {platformData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platformData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {platformData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} shares`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No sharing data available
                    </div>
                  )}
                </div>
              </div>

              {/* Time Series Chart */}
              <div>
                <h3 className="text-lg font-medium mb-4">Sharing Trends (Last 30 Days)</h3>
                <div className="h-[300px]">
                  {timeSeriesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => {
                            const d = new Date(date);
                            return `${d.getDate()}/${d.getMonth() + 1}`;
                          }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip 
                          formatter={(value) => [`${value} shares`, 'Shares']}
                          labelFormatter={(date) => {
                            const d = new Date(date);
                            return d.toLocaleDateString();
                          }}
                        />
                        <Bar dataKey="shares" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No time series data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </LoadingState>
      </CardContent>
    </Card>
  );
};

export default SharingAnalytics;
