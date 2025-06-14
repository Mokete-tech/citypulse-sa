
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";
import DealCard from "@/components/DealCard";
import { useDeals } from "@/hooks/useDeals";

const FeaturedDeals = () => {
  const { data: deals = [] } = useDeals();
  const featuredDeals = deals.filter(deal => deal.featured).slice(0, 3);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Tag className="w-8 h-8 mr-3 text-blue-600" />
            Featured Deals
          </h2>
          <Link to="/deals">
            <Button variant="outline" className="hover:scale-105 transition-transform">
              View All Deals
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDeals.map((deal) => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
