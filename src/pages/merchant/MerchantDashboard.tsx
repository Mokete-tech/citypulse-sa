import React from 'react';

export const MerchantDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Merchant Dashboard</h1>
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Welcome to your merchant dashboard. Here you can manage your deals, events, and analytics.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="border rounded-lg p-6 bg-background shadow">
          <h2 className="text-2xl font-semibold mb-2">Active Deals</h2>
          <p className="text-3xl font-bold mb-4">3</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Summer Sale - 20% off</li>
            <li>Weekend Special - Buy 1 Get 1 Free</li>
            <li>New Customer Discount - 15% off</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Manage Deals</button>
        </div>
        <div className="border rounded-lg p-6 bg-background shadow">
          <h2 className="text-2xl font-semibold mb-2">Upcoming Events</h2>
          <p className="text-3xl font-bold mb-4">2</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>Grand Opening - June 15</li>
            <li>Customer Appreciation Day - July 1</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Manage Events</button>
        </div>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/9No-FiEInLA"
          title="Merchant Dashboard Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MerchantDashboard; 