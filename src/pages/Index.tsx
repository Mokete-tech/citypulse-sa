
import React, { useState } from 'react';
import { Line } from 'lucide-react';
import { Card } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import KeyMetricsSection from '@/components/dashboard/KeyMetricsSection';
import CityComparisonChart from '@/components/dashboard/CityComparisonChart';
import NewsSection from '@/components/dashboard/NewsSection';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">South Africa Urban Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into South Africa's urban landscape and development metrics.
            </p>
          </div>
          
          <KeyMetricsSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
            <CityComparisonChart />
            
            <Card className="p-6 lg:col-span-1 animate-fade-in">
              <h3 className="text-lg font-medium mb-4">Population Distribution</h3>
              <div className="space-y-4">
                {[
                  { city: 'Johannesburg', population: '5.9M', percentage: 75 },
                  { city: 'Cape Town', population: '4.8M', percentage: 65 },
                  { city: 'Durban', population: '3.9M', percentage: 55 },
                  { city: 'Pretoria', population: '2.5M', percentage: 40 },
                  { city: 'Port Elizabeth', population: '1.3M', percentage: 25 },
                ].map((item) => (
                  <div key={item.city}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>{item.city}</span>
                      <span className="font-medium">{item.population}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <NewsSection />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
