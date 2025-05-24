import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Target, ArrowUpRight, ArrowDownRight, Sparkles, Zap, TrendingDown, Megaphone, Star, Award, Gift, BarChart2, Settings, HelpCircle, TestTube, Beaker, ChartBar, Lightbulb, Rocket, Target as TargetIcon, ChevronRight, Info, ShoppingBag, Store, Package, Truck, CreditCard, Heart, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

interface OptimizationMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  trend: 'up' | 'down';
  change: number;
}

interface CommissionOptimization {
  strategy: string;
  potentialSavings: number;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  description: string;
  nextStep: string;
}

interface BusinessInsight {
  type: 'opportunity' | 'warning' | 'info';
  title: string;
  description: string;
  action: string;
}

interface AdvertisingBenefit {
  type: string;
  title: string;
  description: string;
  commissionReduction: number;
  requirements: string;
  icon: React.ReactNode;
}

interface SetupGuide {
  title: string;
  steps: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AdPerformance {
  metric: string;
  current: number;
  target: number;
  trend: 'up' | 'down';
  change: number;
}

interface ABTest {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'scheduled';
  variantA: {
    name: string;
    performance: number;
    sampleSize: number;
  };
  variantB: {
    name: string;
    performance: number;
    sampleSize: number;
  };
  startDate: string;
  endDate: string;
  metric: string;
}

interface EnhancedMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  breakdown: {
    label: string;
    value: number;
  }[];
}

interface TestTemplate {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  duration: string;
  sampleSize: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'advertising' | 'pricing' | 'content' | 'layout';
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  category: string;
  metrics: string[];
  confidence: number;
}

interface StoreMockup {
  id: string;
  title: string;
  image: string;
  description: string;
  features: string[];
  rating: number;
  reviews: number;
  category: 'grocery' | 'convenience' | 'specialty' | 'organic';
  size: 'small' | 'medium' | 'large';
  layout: string;
  bestFor: string[];
  estimatedSetup: string;
  monthlyRevenue: string;
}

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const BusinessOptimizer = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  const metrics: OptimizationMetric[] = [
    {
      name: 'Average Booking Value',
      current: 85,
      target: 120,
      unit: '$',
      trend: 'up',
      change: 12
    },
    {
      name: 'Monthly Bookings',
      current: 45,
      target: 75,
      unit: '',
      trend: 'up',
      change: 8
    },
    {
      name: 'Customer Retention',
      current: 65,
      target: 80,
      unit: '%',
      trend: 'up',
      change: 5
    },
    {
      name: 'Commission Rate',
      current: 1.8,
      target: 1.0,
      unit: '%',
      trend: 'down',
      change: 0.3
    }
  ];

  const commissionOptimizations: CommissionOptimization[] = [
    {
      strategy: 'Advertise & Save',
      potentialSavings: 350,
      effort: 'low',
      impact: 'high',
      description: 'Advertise your services to reduce commission rate by 0.5%',
      nextStep: 'Set up your first ad campaign'
    },
    {
      strategy: 'Volume Bonus',
      potentialSavings: 280,
      effort: 'medium',
      impact: 'high',
      description: 'Reach 40+ bookings to unlock 0.3% commission reduction',
      nextStep: 'Add 3 more bookings this month'
    },
    {
      strategy: 'Bundle & Save',
      potentialSavings: 220,
      effort: 'low',
      impact: 'medium',
      description: 'Create service packages to reduce commission by 0.2%',
      nextStep: 'Create 2 new service bundles'
    },
    {
      strategy: 'Loyalty Program',
      potentialSavings: 180,
      effort: 'medium',
      impact: 'medium',
      description: 'Implement customer loyalty program for 0.2% commission reduction',
      nextStep: 'Launch loyalty program next week'
    }
  ];

  const businessInsights: BusinessInsight[] = [
    {
      type: 'opportunity',
      title: 'Advertising Opportunity',
      description: 'Advertise now to reduce your commission rate by 0.5%',
      action: 'Start Advertising Campaign'
    },
    {
      type: 'info',
      title: 'Commission Optimization',
      description: 'You\'re 3 bookings away from the next commission tier',
      action: 'Focus on quick wins to reach the next tier'
    },
    {
      type: 'opportunity',
      title: 'Bundle Services',
      description: 'Create service bundles to reduce commission and increase revenue',
      action: 'Create Service Bundles'
    }
  ];

  const advertisingBenefits: AdvertisingBenefit[] = [
    {
      type: 'Featured Listing',
      title: 'Featured Merchant',
      description: 'Get premium placement in search results and category pages',
      commissionReduction: 0.5,
      requirements: 'Minimum 4.5 star rating',
      icon: <Star className="h-6 w-6 text-yellow-500" />
    },
    {
      type: 'Promotion',
      title: 'Special Offers',
      description: 'Run limited-time promotions to attract more customers',
      commissionReduction: 0.3,
      requirements: 'Active for 30+ days',
      icon: <Gift className="h-6 w-6 text-red-500" />
    },
    {
      type: 'Premium',
      title: 'Premium Profile',
      description: 'Enhanced profile with video, gallery, and custom branding',
      commissionReduction: 0.4,
      requirements: 'Complete profile setup',
      icon: <Award className="h-6 w-6 text-blue-500" />
    },
    {
      type: 'Campaign',
      title: 'Ad Campaign',
      description: 'Run targeted ad campaigns to reach specific audiences',
      commissionReduction: 0.6,
      requirements: 'Minimum $100 ad spend',
      icon: <Megaphone className="h-6 w-6 text-green-500" />
    }
  ];

  const performanceData = [
    { month: 'Jan', revenue: 4000, commission: 100, bookings: 35 },
    { month: 'Feb', revenue: 4500, commission: 112, bookings: 40 },
    { month: 'Mar', revenue: 5000, commission: 125, bookings: 45 },
    { month: 'Apr', revenue: 4800, commission: 120, bookings: 42 },
    { month: 'May', revenue: 5200, commission: 130, bookings: 48 },
    { month: 'Jun', revenue: 5500, commission: 137, bookings: 50 }
  ];

  const setupGuides: Record<string, SetupGuide> = {
    'Featured Merchant': {
      title: 'Featured Merchant Setup Guide',
      steps: [
        'Complete your business profile with high-quality photos',
        'Add detailed service descriptions and pricing',
        'Collect and showcase customer reviews',
        'Set up your availability calendar',
        'Enable instant booking for quick conversions'
      ],
      estimatedTime: '2-3 hours',
      difficulty: 'medium'
    },
    'Ad Campaign': {
      title: 'Ad Campaign Setup Guide',
      steps: [
        'Define your target audience and goals',
        'Set your daily budget and campaign duration',
        'Create compelling ad copy and visuals',
        'Choose relevant keywords and locations',
        'Launch and monitor performance'
      ],
      estimatedTime: '1-2 hours',
      difficulty: 'easy'
    },
    'Premium Profile': {
      title: 'Premium Profile Setup Guide',
      steps: [
        'Upload professional business photos',
        'Create a compelling business video',
        'Design your custom branding elements',
        'Add detailed service packages',
        'Set up your business hours and policies'
      ],
      estimatedTime: '3-4 hours',
      difficulty: 'medium'
    }
  };

  const adPerformance: AdPerformance[] = [
    {
      metric: 'Click-Through Rate',
      current: 3.2,
      target: 5.0,
      trend: 'up',
      change: 0.5
    },
    {
      metric: 'Conversion Rate',
      current: 2.8,
      target: 4.0,
      trend: 'up',
      change: 0.3
    },
    {
      metric: 'Cost per Click',
      current: 1.5,
      target: 1.0,
      trend: 'down',
      change: 0.2
    },
    {
      metric: 'Return on Ad Spend',
      current: 320,
      target: 400,
      trend: 'up',
      change: 45
    }
  ];

  const adPerformanceData = [
    { day: 'Mon', impressions: 1200, clicks: 45, conversions: 12 },
    { day: 'Tue', impressions: 1500, clicks: 52, conversions: 15 },
    { day: 'Wed', impressions: 1800, clicks: 68, conversions: 20 },
    { day: 'Thu', impressions: 1600, clicks: 58, conversions: 17 },
    { day: 'Fri', impressions: 2000, clicks: 75, conversions: 22 },
    { day: 'Sat', impressions: 2200, clicks: 82, conversions: 25 },
    { day: 'Sun', impressions: 1900, clicks: 65, conversions: 19 }
  ];

  const abTests: ABTest[] = [
    {
      id: '1',
      name: 'Ad Copy Test',
      status: 'running',
      variantA: {
        name: 'Original',
        performance: 3.2,
        sampleSize: 1000
      },
      variantB: {
        name: 'New Version',
        performance: 3.8,
        sampleSize: 1000
      },
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      metric: 'Click-Through Rate'
    },
    {
      id: '2',
      name: 'Landing Page Test',
      status: 'completed',
      variantA: {
        name: 'Standard',
        performance: 2.5,
        sampleSize: 800
      },
      variantB: {
        name: 'Enhanced',
        performance: 3.1,
        sampleSize: 800
      },
      startDate: '2024-02-15',
      endDate: '2024-03-01',
      metric: 'Conversion Rate'
    }
  ];

  const enhancedMetrics: EnhancedMetric[] = [
    {
      name: 'Customer Acquisition',
      value: 450,
      change: 12,
      trend: 'up',
      breakdown: [
        { label: 'Organic', value: 250 },
        { label: 'Paid', value: 150 },
        { label: 'Referral', value: 50 }
      ]
    },
    {
      name: 'Revenue Sources',
      value: 8500,
      change: 8,
      trend: 'up',
      breakdown: [
        { label: 'Direct Bookings', value: 5000 },
        { label: 'Packages', value: 2500 },
        { label: 'Add-ons', value: 1000 }
      ]
    }
  ];

  const testTemplates: TestTemplate[] = [
    {
      id: '1',
      name: 'Pricing Strategy Test',
      description: 'Test different pricing models to optimize revenue',
      metrics: ['Conversion Rate', 'Revenue per Customer', 'Booking Volume'],
      duration: '2 weeks',
      sampleSize: 1000,
      difficulty: 'medium',
      category: 'pricing'
    },
    {
      id: '2',
      name: 'Service Bundle Test',
      description: 'Test different service package combinations',
      metrics: ['Average Order Value', 'Bundle Adoption Rate', 'Customer Satisfaction'],
      duration: '3 weeks',
      sampleSize: 800,
      difficulty: 'easy',
      category: 'content'
    },
    {
      id: '3',
      name: 'Ad Creative Test',
      description: 'Test different ad creatives and messaging',
      metrics: ['Click-Through Rate', 'Cost per Click', 'Conversion Rate'],
      duration: '1 week',
      sampleSize: 2000,
      difficulty: 'easy',
      category: 'advertising'
    }
  ];

  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Optimize Peak Hours Pricing',
      description: 'Increase prices during high-demand hours to maximize revenue',
      impact: 'high',
      effort: 'easy',
      category: 'pricing',
      metrics: ['Revenue', 'Profit Margin'],
      confidence: 85
    },
    {
      id: '2',
      title: 'Create Weekend Special',
      description: 'Launch a weekend promotion to increase bookings',
      impact: 'medium',
      effort: 'medium',
      category: 'marketing',
      metrics: ['Booking Volume', 'Revenue'],
      confidence: 75
    },
    {
      id: '3',
      title: 'Enhance Service Descriptions',
      description: 'Improve service descriptions to increase conversion rates',
      impact: 'medium',
      effort: 'easy',
      category: 'content',
      metrics: ['Conversion Rate', 'Time on Page'],
      confidence: 80
    }
  ];

  const storeMockups: StoreMockup[] = [
    {
      id: '1',
      title: 'Fresh Market',
      image: '/mockups/fresh-market.jpg',
      description: 'A modern grocery store with fresh produce and local products',
      features: ['Fresh Produce', 'Local Products', 'Organic Options', 'Fast Delivery'],
      rating: 4.8,
      reviews: 124,
      category: 'grocery',
      size: 'large',
      layout: 'Open Floor Plan',
      bestFor: ['Urban Areas', 'Health-Conscious Customers', 'Local Communities'],
      estimatedSetup: '$150,000 - $200,000',
      monthlyRevenue: '$50,000 - $75,000'
    },
    {
      id: '2',
      title: 'Urban Pantry',
      image: '/mockups/urban-pantry.jpg',
      description: 'Urban convenience store with premium groceries and ready meals',
      features: ['Premium Products', 'Ready Meals', '24/7 Service', 'Express Delivery'],
      rating: 4.6,
      reviews: 89,
      category: 'convenience',
      size: 'medium',
      layout: 'Compact Design',
      bestFor: ['City Centers', 'Office Districts', 'High-Traffic Areas'],
      estimatedSetup: '$80,000 - $120,000',
      monthlyRevenue: '$30,000 - $45,000'
    },
    {
      id: '3',
      title: 'Green Grocer',
      image: '/mockups/green-grocer.jpg',
      description: 'Eco-friendly grocery store focusing on sustainable products',
      features: ['Eco-Friendly', 'Zero Waste', 'Sustainable', 'Local Delivery'],
      rating: 4.9,
      reviews: 156,
      category: 'organic',
      size: 'medium',
      layout: 'Natural Flow',
      bestFor: ['Eco-Conscious Areas', 'Suburban Locations', 'Health-Focused Communities'],
      estimatedSetup: '$100,000 - $150,000',
      monthlyRevenue: '$40,000 - $60,000'
    },
    {
      id: '4',
      title: 'Gourmet Corner',
      image: '/mockups/gourmet-corner.jpg',
      description: 'Specialty food store with premium international products',
      features: ['International Products', 'Gourmet Selection', 'Wine & Cheese', 'Cooking Classes'],
      rating: 4.7,
      reviews: 92,
      category: 'specialty',
      size: 'small',
      layout: 'Boutique Style',
      bestFor: ['Upscale Neighborhoods', 'Food Enthusiasts', 'Tourist Areas'],
      estimatedSetup: '$120,000 - $180,000',
      monthlyRevenue: '$45,000 - $70,000'
    },
    {
      id: '5',
      title: 'Quick Mart',
      image: '/mockups/quick-mart.jpg',
      description: 'Efficient convenience store with essential groceries and services',
      features: ['Essential Items', 'Quick Service', 'ATM Services', 'Bill Payments'],
      rating: 4.5,
      reviews: 78,
      category: 'convenience',
      size: 'small',
      layout: 'Efficient Grid',
      bestFor: ['Residential Areas', 'Gas Stations', 'High-Traffic Corners'],
      estimatedSetup: '$50,000 - $80,000',
      monthlyRevenue: '$20,000 - $35,000'
    },
    {
      id: '6',
      title: 'Farm Fresh',
      image: '/mockups/farm-fresh.jpg',
      description: 'Farm-to-table grocery store with seasonal produce and local goods',
      features: ['Seasonal Produce', 'Local Farmers', 'Artisanal Products', 'Farm Tours'],
      rating: 4.9,
      reviews: 143,
      category: 'grocery',
      size: 'medium',
      layout: 'Market Style',
      bestFor: ['Suburban Areas', 'Farm Communities', 'Tourist Destinations'],
      estimatedSetup: '$130,000 - $180,000',
      monthlyRevenue: '$55,000 - $80,000'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-background to-muted/20 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((metric) => (
          <MotionCard
            key={metric.name}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "transition-all duration-200",
              hoveredMetric === metric.name && "ring-2 ring-primary"
            )}
            onHoverStart={() => setHoveredMetric(metric.name)}
            onHoverEnd={() => setHoveredMetric(null)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
              {metric.trend === 'up' ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.unit}{metric.current}
              </div>
              <div className="flex items-center pt-1">
                <span className="text-xs text-muted-foreground">
                  Target: {metric.unit}{metric.target}
                </span>
                <Progress 
                  value={(metric.current / metric.target) * 100} 
                  className="ml-2 h-2 w-20"
                />
              </div>
            </CardContent>
          </MotionCard>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        {businessInsights.map((insight) => (
          <MotionCard
            key={insight.title}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "transition-all duration-200",
              insight.type === 'opportunity' ? 'border-green-500' :
              insight.type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
            )}
          >
            <CardHeader>
              <div className="flex items-center space-x-2">
                {insight.type === 'opportunity' ? (
                  <Sparkles className="h-4 w-4 text-green-500" />
                ) : insight.type === 'warning' ? (
                  <TrendingDown className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Zap className="h-4 w-4 text-blue-500" />
                )}
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </div>
              <CardDescription>{insight.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <MotionButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="outline"
                className="w-full"
              >
                {insight.action}
              </MotionButton>
            </CardContent>
          </MotionCard>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Inspiring Store Designs</h2>
          <p className="text-muted-foreground">Get inspired by successful store layouts and designs</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {storeMockups.map((mockup) => (
            <MotionCard
              key={mockup.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={mockup.image}
                  alt={mockup.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{mockup.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{mockup.rating}</span>
                    <span className="text-sm">({mockup.reviews} reviews)</span>
                  </div>
                </div>
                <Badge className="absolute top-4 right-4">
                  {mockup.category}
                </Badge>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">{mockup.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium">Size</div>
                    <div className="text-sm text-muted-foreground">{mockup.size}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Layout</div>
                    <div className="text-sm text-muted-foreground">{mockup.layout}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Setup Cost</div>
                    <div className="text-sm text-muted-foreground">{mockup.estimatedSetup}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Monthly Revenue</div>
                    <div className="text-sm text-muted-foreground">{mockup.monthlyRevenue}</div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium">Best For</div>
                  <div className="flex flex-wrap gap-2">
                    {mockup.bestFor.map((item) => (
                      <Badge key={item} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockup.features.map((feature) => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    View Details
                  </MotionButton>
                  <MotionButton
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="outline"
                    className="flex-1"
                  >
                    Apply Design
                  </MotionButton>
                </div>
              </CardContent>
            </MotionCard>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MotionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-32 -mt-32" />
            <CardHeader>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <CardTitle>Store Optimization Tips</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span>Optimize store layout for better customer flow</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>Highlight featured products and promotions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Streamline delivery and pickup processes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Implement seamless payment solutions</span>
                </div>
              </div>
            </CardContent>
          </MotionCard>

          <MotionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-32 -mt-32" />
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <CardTitle>Customer Experience</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Optimize store hours and peak times</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Improve store location and accessibility</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Enhance staff training and customer service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-muted-foreground" />
                  <span>Implement loyalty programs and rewards</span>
                </div>
              </div>
            </CardContent>
          </MotionCard>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="advertising">Advertising</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="recommendations">Smart Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Health</CardTitle>
                <CardDescription>
                  Key performance indicators and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.map((metric) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'}>
                          {metric.trend === 'up' ? '+' : '-'}{metric.change}%
                        </Badge>
                      </div>
                      <Progress 
                        value={(metric.current / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Optimize your business performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Growth Opportunities
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Optimize Pricing Strategy
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Customer Retention Plan
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Seasonal Planning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="grid gap-6 md:grid-cols-2">
            {commissionOptimizations.map((opt) => (
              <Card key={opt.strategy}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{opt.strategy}</CardTitle>
                    <Badge variant={
                      opt.effort === 'low' ? 'default' :
                      opt.effort === 'medium' ? 'secondary' :
                      'destructive'
                    }>
                      {opt.effort} effort
                    </Badge>
                  </div>
                  <CardDescription>
                    {opt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Potential Monthly Savings</span>
                      <span className="text-lg font-bold">${opt.potentialSavings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Impact Level</span>
                      <Badge variant={
                        opt.impact === 'high' ? 'default' :
                        opt.impact === 'medium' ? 'secondary' :
                        'outline'
                      }>
                        {opt.impact} impact
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Next Step: {opt.nextStep}
                    </div>
                    <Button className="w-full">View Action Plan</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advertising">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {advertisingBenefits.map((benefit) => (
                <Card key={benefit.type}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {benefit.icon}
                        <CardTitle>{benefit.title}</CardTitle>
                      </div>
                      <Badge variant="default" className="text-sm">
                        -{benefit.commissionReduction}% Commission
                      </Badge>
                    </div>
                    <CardDescription>
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Requirements: {benefit.requirements}
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1">Learn More</Button>
                        <Button variant="outline" className="flex-1">Get Started</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Advertising Performance</CardTitle>
                <CardDescription>
                  Track your ad campaign metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {adPerformance.map((metric) => (
                    <div key={metric.metric} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{metric.metric}</span>
                        <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'}>
                          {metric.trend === 'up' ? '+' : '-'}{metric.change}%
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.metric === 'Return on Ad Spend' ? '$' : ''}{metric.current}
                        {metric.metric !== 'Return on Ad Spend' ? '%' : ''}
                      </div>
                      <Progress 
                        value={(metric.current / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
                <div className="h-[300px] mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="impressions" 
                        stroke="#8884d8" 
                        fill="#8884d8" 
                        name="Impressions"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="clicks" 
                        stroke="#82ca9d" 
                        fill="#82ca9d" 
                        name="Clicks"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="conversions" 
                        stroke="#ffc658" 
                        fill="#ffc658" 
                        name="Conversions"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Commission Trends</CardTitle>
                <CardDescription>
                  6-month performance analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => [`$${value}`, '']}
                      />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      <Bar dataKey="commission" fill="#82ca9d" name="Commission" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Trends</CardTitle>
                <CardDescription>
                  Monthly booking volume analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="bookings" 
                        stroke="#8884d8" 
                        name="Bookings"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="guides">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(setupGuides).map(([key, guide]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{guide.title}</CardTitle>
                    <Badge variant={
                      guide.difficulty === 'easy' ? 'default' :
                      guide.difficulty === 'medium' ? 'secondary' :
                      'destructive'
                    }>
                      {guide.difficulty} difficulty
                    </Badge>
                  </div>
                  <CardDescription>
                    Estimated time: {guide.estimatedTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ol className="list-decimal list-inside space-y-2">
                      {guide.steps.map((step, index) => (
                        <li key={index} className="text-sm">
                          {step}
                        </li>
                      ))}
                    </ol>
                    <Button className="w-full">Start Setup</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Templates</CardTitle>
                <CardDescription>
                  Pre-configured test templates for quick setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  {testTemplates.map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <Badge variant={
                            template.difficulty === 'easy' ? 'default' :
                            template.difficulty === 'medium' ? 'secondary' :
                            'destructive'
                          }>
                            {template.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Metrics to Track</div>
                            <div className="flex flex-wrap gap-2">
                              {template.metrics.map((metric) => (
                                <Badge key={metric} variant="outline">
                                  {metric}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Duration: {template.duration} • Sample: {template.sampleSize}
                          </div>
                          <Button className="w-full">Use Template</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              {abTests.map((test) => (
                <Card key={test.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{test.name}</CardTitle>
                      <Badge variant={
                        test.status === 'running' ? 'default' :
                        test.status === 'completed' ? 'secondary' :
                        'outline'
                      }>
                        {test.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Testing {test.metric} from {test.startDate} to {test.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">{test.variantA.name}</div>
                          <div className="text-2xl font-bold">{test.variantA.performance}%</div>
                          <div className="text-xs text-muted-foreground">
                            Sample: {test.variantA.sampleSize}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">{test.variantB.name}</div>
                          <div className="text-2xl font-bold">{test.variantB.performance}%</div>
                          <div className="text-xs text-muted-foreground">
                            Sample: {test.variantB.sampleSize}
                          </div>
                        </div>
                      </div>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: test.variantA.name, value: test.variantA.performance },
                            { name: test.variantB.name, value: test.variantB.performance }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <Button className="w-full">View Detailed Results</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Enhanced Performance Metrics</CardTitle>
                <CardDescription>
                  Detailed breakdown of key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {enhancedMetrics.map((metric) => (
                    <div key={metric.name} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">{metric.name}</div>
                          <div className="text-2xl font-bold">
                            {metric.name.includes('Revenue') ? '$' : ''}{metric.value}
                          </div>
                        </div>
                        <Badge variant={metric.trend === 'up' ? 'default' : 'destructive'}>
                          {metric.trend === 'up' ? '+' : '-'}{metric.change}%
                        </Badge>
                      </div>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={metric.breakdown}
                              dataKey="value"
                              nameKey="label"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {metric.breakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.map((rec) => (
                <MotionCard
                  key={rec.id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        <CardTitle>{rec.title}</CardTitle>
                      </div>
                      <Badge variant={
                        rec.impact === 'high' ? 'default' :
                        rec.impact === 'medium' ? 'secondary' :
                        'outline'
                      }>
                        {rec.impact} impact
                      </Badge>
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Effort Level</div>
                          <div className="flex items-center space-x-2">
                            <Rocket className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{rec.effort}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">Confidence</div>
                          <div className="flex items-center space-x-2">
                            <TargetIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{rec.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Metrics to Improve</div>
                        <div className="flex flex-wrap gap-2">
                          {rec.metrics.map((metric) => (
                            <Badge key={metric} variant="outline">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <MotionButton
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1"
                        >
                          Apply Recommendation
                        </MotionButton>
                        <MotionButton
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          variant="outline"
                          className="flex-1"
                        >
                          Learn More
                        </MotionButton>
                      </div>
                    </div>
                  </CardContent>
                </MotionCard>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessOptimizer; 