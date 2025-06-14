
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tag, Star, Clock, MapPin } from "lucide-react";

const FeaturedDeals = () => {
  const mockDeals = [
    {
      id: 1,
      title: "50% Off Gourmet Burgers",
      business: "The Burger Co.",
      location: "Cape Town",
      originalPrice: 120,
      discountedPrice: 60,
      discount: 50,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      timeLeft: "2 days left",
      category: "Food & Drink"
    },
    {
      id: 2,
      title: "30% Off Spa Treatment",
      business: "Zen Wellness Spa",
      location: "Johannesburg",
      originalPrice: 800,
      discountedPrice: 560,
      discount: 30,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
      timeLeft: "5 days left",
      category: "Beauty & Wellness"
    },
    {
      id: 3,
      title: "Buy 2 Get 1 Free Coffee",
      business: "Bean There Coffee",
      location: "Durban",
      originalPrice: 90,
      discountedPrice: 60,
      discount: 33,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      timeLeft: "1 week left",
      category: "Food & Drink"
    },
    {
      id: 4,
      title: "40% Off Fitness Classes",
      business: "FitLife Gym",
      location: "Pretoria",
      originalPrice: 500,
      discountedPrice: 300,
      discount: 40,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      timeLeft: "3 days left",
      category: "Health & Fitness"
    },
    {
      id: 5,
      title: "25% Off Electronics",
      business: "TechHub Store",
      location: "Cape Town",
      originalPrice: 2000,
      discountedPrice: 1500,
      discount: 25,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      timeLeft: "1 day left",
      category: "Electronics"
    },
    {
      id: 6,
      title: "Free Dessert with Main",
      business: "Italiana Restaurant",
      location: "Johannesburg",
      originalPrice: 180,
      discountedPrice: 180,
      discount: 0,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      timeLeft: "4 days left",
      category: "Food & Drink"
    }
  ];

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
          {mockDeals.slice(0, 6).map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {deal.discount > 0 ? `-${deal.discount}%` : 'FREE'}
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {deal.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{deal.title}</h3>
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600">{deal.business} • {deal.location}</span>
                </div>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{deal.rating}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {deal.discount > 0 && (
                      <span className="text-gray-500 line-through">R{deal.originalPrice}</span>
                    )}
                    <span className="text-xl font-bold text-green-600">
                      {deal.discount > 0 ? `R${deal.discountedPrice}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{deal.timeLeft}</span>
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Claim Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeals;
