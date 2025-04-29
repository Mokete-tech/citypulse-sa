
import React from 'react';
import { Users, TrendingUp, Building2, Droplet } from 'lucide-react';
import StatCard from './StatCard';

const KeyMetricsSection = () => {
  return (
    <section className="py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Key Metrics</h2>
        <p className="text-muted-foreground">National urban indicators at a glance</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Urban Population"
          value="42.4M"
          change={2.3}
          icon={<Users className="h-4 w-4" />}
          description="vs last year"
        />
        
        <StatCard
          title="Economic Growth"
          value="3.8%"
          change={0.7}
          icon={<TrendingUp className="h-4 w-4" />}
          description="vs last quarter"
        />
        
        <StatCard
          title="Housing Development"
          value="14,265"
          change={-2.1}
          icon={<Building2 className="h-4 w-4" />}
          description="new units this quarter"
        />
        
        <StatCard
          title="Water Consumption"
          value="215L"
          change={-5.2}
          icon={<Droplet className="h-4 w-4" />}
          description="daily per capita"
        />
      </div>
    </section>
  );
};

export default KeyMetricsSection;
