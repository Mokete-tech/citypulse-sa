
import React from 'react';
import { Button } from '@/components/ui/button';
import InsightCard from './InsightCard';

const insights = [
  {
    title: "Cape Town's Water Conservation Success Story",
    date: "April 22, 2025",
    description: "How Cape Town turned its water crisis around through innovative conservation techniques and citizen engagement, becoming a model for water management globally.",
    imageUrl: "https://images.unsplash.com/photo-1563306406-e66174fa3787?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Environment"
  },
  {
    title: "Johannesburg's New Public Transport Initiative",
    date: "April 15, 2025",
    description: "The city unveils an ambitious plan to revamp public transportation, aiming to reduce traffic congestion and carbon emissions by 30% within five years.",
    imageUrl: "https://images.unsplash.com/photo-1494583882007-1d6266320474?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Transport"
  },
  {
    title: "Durban Leads in Renewable Energy Adoption",
    date: "April 10, 2025",
    description: "A comprehensive look at how Durban has successfully integrated renewable energy solutions across public infrastructure, becoming the country's green energy leader.",
    imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Energy"
  }
];

const NewsSection = () => {
  return (
    <section className="py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Latest Insights</h2>
        <Button variant="outline">View All</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            date={insight.date}
            description={insight.description}
            imageUrl={insight.imageUrl}
            category={insight.category}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
