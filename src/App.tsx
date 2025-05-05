
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// Minimal Home component
const Home = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to CityPulse South Africa</h1>
      <p className="mb-4">Discover the best local deals and events across South Africa.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Nearby Deals</h2>
          <p>Discover deals close to your current location</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
          <p>Find events happening near you</p>
        </div>
      </div>
    </div>
  </MainLayout>
);

// Minimal Deals component
const Deals = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Deals</h1>
      <p>Browse all deals in your area.</p>
    </div>
  </MainLayout>
);

// Minimal Events component
const Events = () => (
  <MainLayout>
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Events</h1>
      <p>Browse all events in your area.</p>
    </div>
  </MainLayout>
);

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
