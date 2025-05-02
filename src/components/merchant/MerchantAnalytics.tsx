import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data - in a real app, this would come from the API
const viewsData = [
  { name: "Mon", views: 120 },
  { name: "Tue", views: 150 },
  { name: "Wed", views: 180 },
  { name: "Thu", views: 140 },
  { name: "Fri", views: 200 },
  { name: "Sat", views: 250 },
  { name: "Sun", views: 220 },
];

const engagementData = [
  { name: "Mon", clicks: 40, shares: 5 },
  { name: "Tue", clicks: 55, shares: 8 },
  { name: "Wed", clicks: 70, shares: 12 },
  { name: "Thu", clicks: 45, shares: 7 },
  { name: "Fri", clicks: 80, shares: 15 },
  { name: "Sat", clicks: 95, shares: 20 },
  { name: "Sun", clicks: 85, shares: 18 },
];

const sourceData = [
  { name: "Direct", value: 40 },
  { name: "Search", value: 25 },
  { name: "Social", value: 20 },
  { name: "Referral", value: 15 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface MerchantAnalyticsProps {
  merchantId: string;
}

/**
 * Analytics dashboard for merchants to track engagement
 */
const MerchantAnalytics = ({ merchantId }: MerchantAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Views</CardTitle>
            <CardDescription>Number of times your deals were viewed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,260</div>
            <div className="text-sm text-green-500">↑ 12% from last period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Engagement</CardTitle>
            <CardDescription>Clicks and interactions with your deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">470</div>
            <div className="text-sm text-green-500">↑ 8% from last period</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
            <CardDescription>Percentage of views that led to engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">37.3%</div>
            <div className="text-sm text-red-500">↓ 2% from last period</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="views">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="views" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>
                Number of times your deals and events were viewed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="engagement" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Clicks and shares of your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#0EA5E9"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="shares" stroke="#8B5CF6" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sources" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>
                Where your visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
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
};

export default MerchantAnalytics;
