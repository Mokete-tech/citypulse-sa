import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectionData {
  month: string;
  revenue: number;
  commission: number;
  netRevenue: number;
}

interface AIInsight {
  type: 'opportunity' | 'warning' | 'info';
  title: string;
  description: string;
  action?: string;
}

const CommissionCalculator = () => {
  const [bookingValue, setBookingValue] = useState<string>('100');
  const [monthlyBookings, setMonthlyBookings] = useState<string>('50');
  const [serviceType, setServiceType] = useState<string>('table');
  const [growthRate, setGrowthRate] = useState<string>('10');
  const [showInsights, setShowInsights] = useState(true);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  const calculateCommission = (value: number, bookings: number, type: string) => {
    let baseRate = 0;
    switch (type) {
      case 'table':
        baseRate = 2.5;
        break;
      case 'event':
        baseRate = 3.0;
        break;
      case 'spa':
        baseRate = 2.0;
        break;
      case 'room':
        baseRate = 3.5;
        break;
    }

    // Apply volume discounts
    if (bookings >= 100) {
      baseRate -= 1.0;
    } else if (bookings >= 50) {
      baseRate -= 0.5;
    }

    return (value * bookings * baseRate) / 100;
  };

  const generateProjections = (): ProjectionData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseValue = parseFloat(bookingValue);
    const baseBookings = parseInt(monthlyBookings);
    const growth = parseFloat(growthRate) / 100;

    return months.map((month, index) => {
      const projectedBookings = Math.floor(baseBookings * Math.pow(1 + growth, index));
      const revenue = baseValue * projectedBookings;
      const commission = calculateCommission(baseValue, projectedBookings, serviceType);
      
      return {
        month,
        revenue,
        commission,
        netRevenue: revenue - commission
      };
    });
  };

  const projections = generateProjections();
  const currentCommission = calculateCommission(
    parseFloat(bookingValue),
    parseInt(monthlyBookings),
    serviceType
  );

  useEffect(() => {
    generateInsights();
  }, [bookingValue, monthlyBookings, serviceType, growthRate]);

  const generateInsights = () => {
    const newInsights: AIInsight[] = [];
    const value = parseFloat(bookingValue);
    const bookings = parseInt(monthlyBookings);
    const growth = parseFloat(growthRate);

    // Analyze booking value
    if (value < 50) {
      newInsights.push({
        type: 'warning',
        title: 'Low Booking Value',
        description: 'Your average booking value is below typical market rates. Consider reviewing your pricing strategy.',
        action: 'Review pricing'
      });
    } else if (value > 200) {
      newInsights.push({
        type: 'opportunity',
        title: 'Premium Pricing',
        description: 'Your high booking value suggests a premium service. Consider targeting high-end customers.',
        action: 'View premium marketing tips'
      });
    }

    // Analyze growth rate
    if (growth > 20) {
      newInsights.push({
        type: 'warning',
        title: 'Aggressive Growth',
        description: 'Your projected growth rate is ambitious. Ensure you have the capacity to handle increased demand.',
        action: 'View capacity planning guide'
      });
    } else if (growth < 5) {
      newInsights.push({
        type: 'info',
        title: 'Conservative Growth',
        description: 'Your growth rate is conservative. Consider marketing strategies to increase bookings.',
        action: 'View marketing tips'
      });
    }

    // Analyze seasonal patterns
    const currentMonth = new Date().getMonth();
    const nextMonthFactor = seasonalFactors[serviceType][(currentMonth + 1) % 12].factor;
    const currentMonthFactor = seasonalFactors[serviceType][currentMonth].factor;

    if (nextMonthFactor > currentMonthFactor * 1.2) {
      newInsights.push({
        type: 'opportunity',
        title: 'Seasonal Opportunity',
        description: `Next month shows strong seasonal growth (${(nextMonthFactor * 100).toFixed(0)}% of average). Plan your marketing accordingly.`,
        action: 'View seasonal marketing guide'
      });
    }

    // Analyze volume discounts
    const nextTier = serviceTypes.find(s => s.name.toLowerCase().includes(serviceType))?.volumeDiscount.find(d => d.threshold > bookings);
    
    if (nextTier) {
      const potentialSavings = (currentCommission * nextTier.discount) / 100;
      newInsights.push({
        type: 'opportunity',
        title: 'Volume Discount Available',
        description: `Increase bookings to ${nextTier.threshold} to save $${potentialSavings.toFixed(2)} monthly on commissions.`,
        action: 'View volume discount details'
      });
    }

    setInsights(newInsights);
  };

  return (
    <div className="space-y-6">
      {showInsights && insights.length > 0 && (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <Alert key={index} variant={insight.type === 'warning' ? 'destructive' : 'default'}>
              {insight.type === 'opportunity' ? (
                <Lightbulb className="h-4 w-4" />
              ) : insight.type === 'warning' ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Info className="h-4 w-4" />
              )}
              <AlertTitle>{insight.title}</AlertTitle>
              <AlertDescription className="flex justify-between items-center">
                <span>{insight.description}</span>
                {insight.action && (
                  <Button variant="link" className="h-auto p-0">
                    {insight.action}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <Tabs defaultValue="calculator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="projections">Revenue Projections</TabsTrigger>
          <TabsTrigger value="breakdown">Monthly Breakdown</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table Reservations</SelectItem>
                  <SelectItem value="event">Event Tickets</SelectItem>
                  <SelectItem value="spa">Spa & Wellness</SelectItem>
                  <SelectItem value="room">Room Bookings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-value">Average Booking Value ($)</Label>
              <Input
                id="booking-value"
                type="number"
                value={bookingValue}
                onChange={(e) => setBookingValue(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-bookings">Monthly Bookings</Label>
              <Input
                id="monthly-bookings"
                type="number"
                value={monthlyBookings}
                onChange={(e) => setMonthlyBookings(e.target.value)}
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="growth-rate">Monthly Growth Rate (%)</Label>
              <Input
                id="growth-rate"
                type="number"
                value={growthRate}
                onChange={(e) => setGrowthRate(e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monthly Commission</span>
                <span className="text-lg font-bold">${currentCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm font-medium">Effective Rate</span>
                <span className="text-lg font-bold">
                  {((currentCommission / (parseFloat(bookingValue) * parseInt(monthlyBookings))) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="projections">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  name="Revenue"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="netRevenue"
                  stroke="#82ca9d"
                  name="Net Revenue"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="breakdown">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Bookings</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Commission</th>
                  <th className="text-right py-2">Net Revenue</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((data) => (
                  <tr key={data.month} className="border-b">
                    <td className="py-2">{data.month}</td>
                    <td className="text-right py-2">
                      {Math.floor(parseInt(monthlyBookings) * Math.pow(1 + parseFloat(growthRate) / 100, projections.indexOf(data)))}
                    </td>
                    <td className="text-right py-2">${data.revenue.toFixed(2)}</td>
                    <td className="text-right py-2">${data.commission.toFixed(2)}</td>
                    <td className="text-right py-2">${data.netRevenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => setShowInsights(!showInsights)}
          className="flex items-center gap-2"
        >
          {showInsights ? 'Hide Insights' : 'Show Insights'}
          <Lightbulb className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CommissionCalculator; 