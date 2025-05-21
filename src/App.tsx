
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "./integrations/stripe/client";
import { DealsCrud } from "./components/DealsCrud";
import { PaymentsList } from "./components/PaymentsList";
import { PaymentForm } from "./components/PaymentForm";
import { PulsePal } from "./components/ai/PulsePal";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "sonner";
import { ResponsiveLayout } from "./components/layout/ResponsiveLayout";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { EnvWarning } from "./components/ui/env-warning";
import { ResponsiveImage } from "./components/ui/responsive-image";
import { 
  Package, 
  Building, 
  Search, 
  Calendar, 
  MapPin, 
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Play,
  Zap,
  Star,
  Users,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./components/ui/card";

export default function App() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = React.useState("signin");

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // User is not authenticated, show landing page with exploration options
  if (!user) {
    return (
      <ResponsiveLayout showFooter={false} className="bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <EnvWarning />
          
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row gap-8 items-center mb-12 py-8 sm:py-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-sa-blue to-sa-green p-3 rounded-lg mb-4">
                <HeartHandshake className="h-6 sm:h-8 w-6 sm:w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Discover South Africa's <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Hidden Gems</span></h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">Your ultimate guide to exclusive deals, vibrant local events, and authentic South African experiences from Cape Town to Johannesburg.</p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/deals">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:shadow-xl transition-all">
                    <Package className="mr-2 h-5 w-5" />
                    Explore Deals
                  </Button>
                </Link>
                <Link to="/events">
                  <Button size="lg" variant="outline" className="shadow hover:shadow-md transition-all">
                    <Calendar className="mr-2 h-5 w-5" />
                    Browse Events
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <ResponsiveImage 
                  src="https://images.unsplash.com/photo-1576485375217-d6a95e34d041" 
                  alt="Table Mountain, Cape Town" 
                  aspectRatio="16/9"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-start p-6">
                  <div className="text-white">
                    <p className="text-sm font-medium">Featured Destination</p>
                    <h3 className="text-xl font-bold">Table Mountain, Cape Town</h3>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    size="icon" 
                    className="h-16 w-16 rounded-full bg-white/80 hover:bg-white shadow-lg"
                    aria-label="Play video"
                  >
                    <Play className="h-8 w-8 text-blue-600 fill-blue-600" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Value Proposition Section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Choose CityPulse</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Discover what makes CityPulse the ultimate guide to South African experiences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Exclusive Local Deals</h3>
                  <p className="text-gray-600">Access special discounts and promotions from verified local businesses across South Africa.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Curated Events</h3>
                  <p className="text-gray-600">Discover the best cultural festivals, concerts, markets, and experiences happening near you.</p>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-6">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">AI Recommendations</h3>
                  <p className="text-gray-600">Get personalized suggestions tailored to your interests and preferences.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <Package className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-bold text-3xl mb-1">1,000+</h3>
              <p className="text-sm text-gray-600">Local Deals</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <Calendar className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="font-bold text-3xl mb-1">500+</h3>
              <p className="text-sm text-gray-600">Events</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-amber-100 p-3 rounded-full mb-3">
                <Building className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="font-bold text-3xl mb-1">300+</h3>
              <p className="text-sm text-gray-600">Merchants</p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <MapPin className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="font-bold text-3xl mb-1">25+</h3>
              <p className="text-sm text-gray-600">Cities</p>
            </div>
          </div>
          
          {/* Featured Deals Preview */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Featured Deals</h2>
                <p className="text-gray-600">Handpicked offers you don't want to miss</p>
              </div>
              <Link to="/deals" className="text-blue-600 hover:text-blue-800 flex items-center font-medium">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  title: "Wine Tasting Experience",
                  location: "Stellenbosch",
                  discount: "30% OFF",
                  price: "R350",
                  originalPrice: "R500",
                  image: "https://images.unsplash.com/photo-1516594798947-e65505dbb29d"
                },
                {
                  id: 2,
                  title: "Safari Adventure Package",
                  location: "Kruger National Park",
                  discount: "20% OFF",
                  price: "R1,200",
                  originalPrice: "R1,500",
                  image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53"
                },
                {
                  id: 3,
                  title: "Robben Island Tour",
                  location: "Cape Town",
                  discount: "25% OFF",
                  price: "R375",
                  originalPrice: "R500",
                  image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99"
                }
              ].map((deal) => (
                <Card key={deal.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all group">
                  <div className="h-44 relative">
                    <ResponsiveImage
                      src={deal.image} 
                      alt={deal.title}
                      aspectRatio="16/9"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {deal.discount}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">{deal.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {deal.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-blue-600">{deal.price}</span>
                      <span className="text-gray-500 text-sm line-through">{deal.originalPrice}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Destinations */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Popular Destinations</h2>
                <p className="text-gray-600">Explore South Africa's most beloved cities</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Cape Town",
                  image: "https://images.unsplash.com/photo-1564661586429-60e7757b701e",
                  count: "250+ Deals"
                },
                {
                  name: "Johannesburg",
                  image: "https://images.unsplash.com/photo-1577948000111-9c970dfe3743",
                  count: "180+ Deals"
                },
                {
                  name: "Durban",
                  image: "https://images.unsplash.com/photo-1603501616202-45326a2e7c42",
                  count: "120+ Deals"
                },
                {
                  name: "Pretoria",
                  image: "https://images.unsplash.com/photo-1529528070131-eda9f3e90919",
                  count: "90+ Deals"
                }
              ].map((city) => (
                <Link to="/deals" key={city.name} className="group">
                  <div className="relative rounded-lg overflow-hidden h-44 shadow-lg">
                    <ResponsiveImage
                      src={city.image}
                      alt={city.name}
                      aspectRatio="1/1"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white">
                      <h3 className="font-bold text-lg">{city.name}</h3>
                      <p className="text-xs opacity-90">{city.count}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* AI Assistant Preview */}
          <div className="mb-16 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 rounded-xl overflow-hidden shadow-xl">
            <div className="md:flex">
              <div className="md:w-1/2 p-6 md:p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">CityPulse AI Assistant</h2>
                </div>
                <p className="mb-6 text-lg">Get personalized recommendations and discover South Africa's hidden gems with our AI-powered assistant.</p>
                <div className="bg-white/20 p-4 rounded-lg mb-6">
                  <p className="italic text-white/90">"I'm looking for family-friendly weekend activities in Johannesburg under R500"</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/auth">
                    <Button className="w-full sm:w-auto bg-white text-purple-700 hover:bg-white/90">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Try the AI Assistant
                    </Button>
                  </Link>
                  <Link to="/merchant/login">
                    <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                      <Building className="mr-2 h-4 w-4" />
                      Business Portal
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 p-4 hidden md:block">
                <div className="relative rounded-lg overflow-hidden h-full min-h-[320px]">
                  <ResponsiveImage
                    src="https://images.unsplash.com/photo-1501769752-a59efa2298ce"
                    alt="AI Assistant"
                    aspectRatio="1/1"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">What Our Users Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Join thousands of satisfied users discovering the best of South Africa</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Thabo Mbeki",
                  location: "Johannesburg",
                  text: "CityPulse helped me discover amazing restaurants in my own city that I never knew existed. The deals are fantastic!",
                  rating: 5
                },
                {
                  name: "Amahle Zulu",
                  location: "Cape Town",
                  text: "I use the AI assistant every weekend to plan activities with my kids. It's saved me so much time and money!",
                  rating: 5
                },
                {
                  name: "David Pretorius",
                  location: "Durban",
                  text: "As a business owner, CityPulse has brought in new customers who never would have found us otherwise.",
                  rating: 4
                }
              ].map((testimonial, i) => (
                <Card key={i} className="border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex text-yellow-500 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-xs text-gray-500">{testimonial.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Download App Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 md:p-8 mb-16 shadow-xl">
            <div className="md:flex items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Download the CityPulse App</h2>
                <p className="text-white/90 mb-6">Get real-time notifications for deals and events near you. Available for iOS and Android.</p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-black hover:bg-black/80 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.868 2.884c-.321-.772-.743-1.551-1.339-2.197a.5.5 0 00-.787.464c.053.413.263.776.562 1.115.37.413.796.753 1.255 1.035.582.337 1.165.62 1.787.802a.5.5 0 00.364-.937 8.828 8.828 0 01-1.842-.822z" />
                      <path fillRule="evenodd" d="M8.5 14.5a.5.5 0 01-.5-.5v-1a.5.5 0 011 0v1a.5.5 0 01-.5.5zm-3 0a.5.5 0 01-.5-.5v-3a.5.5 0 011 0v3a.5.5 0 01-.5.5zm6 0a.5.5 0 01-.5-.5v-5a.5.5 0 011 0v5a.5.5 0 01-.5.5z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M5.5 5a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v11a.5.5 0 01-1 0v-11a.5.5 0 01.5-.5zm3 0a.5.5 0 01.5.5v7a.5.5 0 01-1 0v-7a.5.5 0 01.5-.5z" clipRule="evenodd" />
                    </svg>
                    App Store
                  </Button>
                  <Button className="bg-black hover:bg-black/80 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <div className="relative w-[200px] h-[300px]">
                  <img 
                    src="https://placehold.co/400x600/667eea/ffffff?text=CityPulse+App" 
                    alt="CityPulse Mobile App" 
                    className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Join Community Section */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Connect with fellow explorers and stay updated on the latest South African experiences</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Users className="mr-2 h-4 w-4" />
                Sign Up Now
              </Button>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  // User is authenticated, show the main app
  const handleSignOut = () => {
    signOut();
    toast.success("Signed out successfully");
  };

  return (
    <ResponsiveLayout>
      <div className="p-6">
        <EnvWarning />
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">CityPulse Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="px-4 py-2"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DealsCrud />
          </div>
          
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-500" />
                Payment Demo
              </h2>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={150}
                  itemId="demo-deal-1"
                  itemType="deal"
                  itemName="Jazz Night"
                  onSuccess={() => toast.success("Payment successful!")}
                  onCancel={() => toast.info("Payment cancelled")}
                />
              </Elements>
            </div>
            
            <PaymentsList />
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="mt-8">
          <div className="border rounded-lg bg-white shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 p-4">
              <h2 className="text-white text-xl font-bold">CityPulse AI Assistant</h2>
              <p className="text-white text-opacity-90">Ask our AI about local deals, events or get personalized recommendations</p>
            </div>
            <div className="p-6">
              <PulsePal apiKey={import.meta.env.VITE_GEMINI_API_KEY || ""} />
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
}
