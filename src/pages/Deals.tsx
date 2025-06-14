
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import DealCard from "@/components/DealCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Deals = () => {
  const allDeals = [
    {
      title: "50% Off Gourmet Burgers",
      category: "Food & Drink",
      business: "The Burger Joint",
      description: "Enjoy our premium beef burgers with artisanal toppings at half price! Made with locally sourced ingredients.",
      discount: "50% OFF",
      rating: 6,
      expires: "2024-12-31",
      featured: true
    },
    {
      title: "Buy 2 Get 1 Free Coffee",
      category: "Food & Drink", 
      business: "Cape Town Coffee Co",
      description: "Perfect morning deal for coffee lovers. Premium roasted beans from local South African farms.",
      discount: "Buy 2 Get 1",
      rating: 7,
      expires: "2024-12-25"
    },
    {
      title: "30% Off Designer Clothing",
      category: "Retail",
      business: "Fashion Forward", 
      description: "Latest fashion trends at unbeatable prices. Limited time offer on all designer collections.",
      discount: "30% OFF",
      rating: 8,
      expires: "2024-12-20",
      featured: true
    },
    {
      title: "Free Spa Treatment",
      category: "Beauty",
      business: "Serenity Spa",
      description: "Complimentary 60-minute massage with any facial treatment. Relax and rejuvenate in luxury.",
      discount: "Free Treatment",
      rating: 9,
      expires: "2024-12-28"
    },
    {
      title: "Movie Night Special",
      category: "Entertainment",
      business: "Cinema City",
      description: "Two tickets for the price of one every Tuesday night. Includes popcorn and drinks.",
      discount: "2 for 1",
      rating: 10,
      expires: "2024-12-31",
      featured: true
    },
    {
      title: "Wine Tasting Experience",
      category: "Food & Drink",
      business: "Stellenbosch Winery",
      description: "Sample premium South African wines with expert sommelier guidance. Includes cheese pairings.",
      discount: "40% OFF",
      rating: 11,
      expires: "2024-12-30"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Local Deals</h1>
          <p className="text-xl text-gray-600 mb-8">Explore all the best deals across South Africa.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search deals by name, location, or category..."
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDeals.map((deal, index) => (
              <DealCard key={index} {...deal} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Deals;
