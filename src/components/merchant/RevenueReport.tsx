import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Sample data - in a real app, this would come from the API
const sampleRevenueData = [
  { date: "2023-10-01", revenue: 1250 },
  { date: "2023-10-02", revenue: 1400 },
  { date: "2023-10-03", revenue: 1800 },
  { date: "2023-10-04", revenue: 1600 },
  { date: "2023-10-05", revenue: 2100 },
  { date: "2023-10-06", revenue: 2400 },
  { date: "2023-10-07", revenue: 2200 },
];

const sampleCategoryData = [
  { name: "Food & Drink", value: 45 },
  { name: "Entertainment", value: 20 },
  { name: "Retail", value: 25 },
  { name: "Services", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface RevenueReportProps {
  merchantId: string;
  className?: string;
}

/**
 * Revenue reporting dashboard for merchants
 */
const RevenueReport = ({ merchantId, className = "" }: RevenueReportProps) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [revenueData, setRevenueData] = useState(sampleRevenueData);
  const [categoryData, setCategoryData] = useState(sampleCategoryData);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Fetch revenue data
  useEffect(() => {
    const fetchRevenueData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would be an API call to get actual data
        // For now, we'll simulate a delay and use sample data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Calculate total revenue
        const total = revenueData.reduce((sum, item) => sum + item.revenue, 0);
        setTotalRevenue(total);
        
        // Set average order value and total orders
        setAverageOrderValue(Math.round(total / 35)); // Simulated
        setTotalOrders(35); // Simulated
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRevenueData();
  }, [timeRange, dateRange]);

  // Handle time range change
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
    // Reset custom date range when selecting a preset
    setDateRange({ from: undefined, to: undefined });
  };

  // Handle export to CSV
  const exportToCSV = () => {
    // Convert data to CSV format
    const headers = ["Date", "Revenue"];
    const csvData = [
      headers.join(","),
      ...revenueData.map((item) => `${item.date},${item.revenue}`),
    ].join("\n");
    
    // Create a blob and download link
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `revenue-report-${timeRange}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Revenue Report</h2>
        
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          
          {timeRange === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
          
          <Button variant="outline" size="icon" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
                <CardDescription>Total earnings in selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(totalRevenue)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Order Value</CardTitle>
                <CardDescription>Average amount per transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                  }).format(averageOrderValue)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Orders</CardTitle>
                <CardDescription>Number of completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalOrders}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="revenue">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="revenue">Revenue Over Time</TabsTrigger>
              <TabsTrigger value="categories">Revenue by Category</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Your revenue over the selected time period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), "MMM dd")}
                        />
                        <YAxis 
                          tickFormatter={(value) => 
                            new Intl.NumberFormat("en-ZA", {
                              style: "currency",
                              currency: "ZAR",
                              maximumFractionDigits: 0,
                            }).format(value)
                          }
                        />
                        <Tooltip 
                          formatter={(value) => 
                            new Intl.NumberFormat("en-ZA", {
                              style: "currency",
                              currency: "ZAR",
                            }).format(Number(value))
                          }
                          labelFormatter={(date) => format(new Date(date), "MMMM d, yyyy")}
                        />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#0EA5E9"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Revenue is calculated based on completed transactions only.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="categories" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>
                    Breakdown of revenue by product/service category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex flex-col md:flex-row items-center justify-center">
                    <div className="w-full md:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Percentage"]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="w-full md:w-1/2 mt-4 md:mt-0">
                      <div className="space-y-2">
                        {categoryData.map((category, index) => (
                          <div key={category.name} className="flex items-center">
                            <div
                              className="w-4 h-4 mr-2 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <div className="flex-1">{category.name}</div>
                            <div className="font-medium">{category.value}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Categories are based on the primary classification of your products and services.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default RevenueReport;
