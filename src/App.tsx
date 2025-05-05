
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import DealCard from './components/deals/DealCard';
import EventCard from './components/events/EventCard';

// Minimal Home component
const Home = () => {
  // Sample featured deals
  const featuredDeals = [
    {
      id: 1,
      title: '50% Off Coffee',
      category: 'Food & Drink',
      merchant: 'Test Merchant',
      description: 'Get 50% off any coffee at Java Junction',
      discount: '50% Off',
      expires: '2023-12-31',
      distance: 0.4,
      featured: true
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free Pizza',
      category: 'Food & Drink',
      merchant: 'Test Merchant',
      description: 'Buy any large pizza and get a second one free',
      discount: 'Buy 1 Get 1 Free',
      expires: '2023-12-31',
      distance: 2.4,
      featured: true
    },
    {
      id: 3,
      title: '20% Off All Electronics',
      category: 'Shopping',
      merchant: 'Test Merchant',
      description: 'Save 20% on all electronics this weekend',
      discount: '20% Off',
      expires: '2023-12-31',
      distance: 3.0,
      featured: true
    }
  ];

  // Sample featured events
  const featuredEvents = [
    {
      id: 1,
      title: 'Jazz Night',
      category: 'Entertainment',
      merchant: 'Test Merchant',
      description: 'Enjoy a night of smooth jazz with local artists',
      venue: 'Cape Town Jazz Club',
      date: '2023-12-15',
      time: '19:00',
      distance: 3.5,
      featured: true
    },
    {
      id: 2,
      title: 'Food Festival',
      category: 'Food & Drink',
      merchant: 'Test Merchant',
      description: 'Sample the best local cuisine from top chefs',
      venue: 'Johannesburg Convention Center',
      date: '2023-12-20',
      time: '12:00',
      distance: 2.1,
      featured: true
    },
    {
      id: 3,
      title: 'Tech Conference',
      category: 'Business',
      merchant: 'Test Merchant',
      description: 'Learn about the latest technology trends',
      venue: 'Durban Tech Hub',
      date: '2023-12-25',
      time: '09:00',
      distance: 5.0,
      featured: true
    }
  ];

  return (
    <MainLayout>
      <div className="p-4 md:p-8">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to CityPulse South Africa</h1>
          <p className="text-lg md:text-xl mb-6">Discover the best local deals and events across South Africa.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#deals" className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 text-center">
              Browse Deals
            </a>
            <a href="#events" className="bg-transparent border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white/10 text-center">
              Find Events
            </a>
          </div>
        </div>

        {/* Nearby Deals section */}
        <section id="deals" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Nearby Deals</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Distance: 5 km</span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">Discover deals close to your current location</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredDeals.map(deal => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href="/deals" className="inline-block text-blue-600 font-medium hover:underline">
              Show More Deals
            </a>
          </div>
        </section>

        {/* Upcoming Events section */}
        <section id="events" className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Distance: 5 km</span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">Discover events happening close to you</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredEvents.map(event => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href="/events" className="inline-block text-purple-600 font-medium hover:underline">
              Show More Events
            </a>
          </div>
        </section>

        {/* Map section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Deals Near You</h2>
          <p className="text-gray-600 mb-4">View deals on the map around your location</p>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-600 mb-4">Map would display here with 4 nearby deals</p>
            <p className="text-sm text-gray-500 mb-4">Your location: -28.209513, 28.325728</p>
            <div className="flex justify-center gap-4">
              <div className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Your location
              </div>
              <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                4 deals found nearby
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="/deals" className="inline-block text-blue-600 font-medium hover:underline">
              View All Deals
            </a>
          </div>
        </section>

        {/* Premium Deals section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold">Premium Deals</h2>
            <span className="text-yellow-500 text-xl">★</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredDeals.slice(0, 3).map(deal => (
              <DealCard key={deal.id} {...deal} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

// Minimal Deals component
const Deals = () => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [distance, setDistance] = React.useState(10);

  // Sample deals data
  const deals = [
    {
      id: 1,
      title: '50% Off Coffee',
      category: 'Food & Drink',
      merchant: 'Test Merchant',
      description: 'Get 50% off any coffee at Java Junction',
      discount: '50% Off',
      expires: '2023-12-31',
      distance: 0.4,
      featured: true
    },
    {
      id: 2,
      title: 'Buy 1 Get 1 Free Pizza',
      category: 'Food & Drink',
      merchant: 'Test Merchant',
      description: 'Buy any large pizza and get a second one free',
      discount: 'Buy 1 Get 1 Free',
      expires: '2023-12-31',
      distance: 2.4,
      featured: true
    },
    {
      id: 3,
      title: '20% Off All Electronics',
      category: 'Shopping',
      merchant: 'Test Merchant',
      description: 'Save 20% on all electronics this weekend',
      discount: '20% Off',
      expires: '2023-12-31',
      distance: 3.0,
      featured: true
    }
  ];

  // Filter deals based on selected categories and distance
  const filteredDeals = deals.filter(deal => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(deal.category);
    const distanceMatch = deal.distance <= distance;
    return categoryMatch && distanceMatch;
  });

  return (
    <MainLayout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Deals</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Distance: {distance} km</span>
            <input
              type="range"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories sidebar */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-3">Categories</h2>
            <div className="space-y-2">
              {['Food & Drink', 'Shopping', 'Services', 'Entertainment'].map(category => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      } else {
                        setSelectedCategories([...selectedCategories, category]);
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={category}>{category}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Deals grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDeals.map(deal => (
                <DealCard key={deal.id} {...deal} />
              ))}

              {filteredDeals.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No deals found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setDistance(50);
                    }}
                    className="mt-2 text-blue-600 underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Minimal Events component
const Events = () => {
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [distance, setDistance] = React.useState(10);

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Art Exhibition',
      category: 'Arts',
      merchant: 'Test Merchant',
      description: 'View stunning artwork from local artists',
      venue: 'Pretoria Art Gallery',
      date: '2023-12-15',
      time: '19:00',
      distance: 0.5,
      featured: true
    },
    {
      id: 2,
      title: 'Food Festival',
      category: 'Food & Drink',
      merchant: 'Test Merchant',
      description: 'Sample the best local cuisine from top chefs',
      venue: 'Johannesburg Convention Center',
      date: '2023-12-20',
      time: '12:00',
      distance: 2.1,
      featured: true
    },
    {
      id: 3,
      title: 'Jazz Night',
      category: 'Entertainment',
      merchant: 'Test Merchant',
      description: 'Enjoy a night of smooth jazz with local artists',
      venue: 'Cape Town Jazz Club',
      date: '2023-12-25',
      time: '20:00',
      distance: 3.5,
      featured: true
    }
  ];

  // Filter events based on selected categories and distance
  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const distanceMatch = event.distance <= distance;
    return categoryMatch && distanceMatch;
  });

  return (
    <MainLayout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Distance: {distance} km</span>
            <input
              type="range"
              min="1"
              max="50"
              value={distance}
              onChange={(e) => setDistance(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Categories sidebar */}
          <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-md">
            <h2 className="font-bold text-lg mb-3">Categories</h2>
            <div className="space-y-2">
              {['Arts', 'Food & Drink', 'Entertainment', 'Business', 'Sports'].map(category => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`event-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      } else {
                        setSelectedCategories([...selectedCategories, category]);
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`event-${category}`}>{category}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Events grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}

              {filteredEvents.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No events found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategories([]);
                      setDistance(50);
                    }}
                    className="mt-2 text-purple-600 underline"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Minimal App component
const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/events" element={<Events />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
