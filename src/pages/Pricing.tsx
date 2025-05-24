import React from 'react';

export const Pricing = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Our Pricing</h1>
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Choose the plan that fits your business. All plans include access to our AI assistant, analytics, and more!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border rounded-lg p-6 bg-background shadow">
          <h2 className="text-2xl font-semibold mb-2">Starter</h2>
          <p className="text-3xl font-bold mb-4">R0</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>✔️ List up to 3 deals</li>
            <li>✔️ Basic analytics</li>
            <li>✔️ AI recommendations</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Get Started</button>
        </div>
        <div className="border-2 border-primary rounded-lg p-6 bg-background shadow-lg scale-105">
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-3xl font-bold mb-4">R199<span className="text-base font-normal">/mo</span></p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>✔️ Unlimited deals & events</li>
            <li>✔️ Advanced analytics</li>
            <li>✔️ Priority AI support</li>
            <li>✔️ Featured placement</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Upgrade</button>
        </div>
        <div className="border rounded-lg p-6 bg-background shadow">
          <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
          <p className="text-3xl font-bold mb-4">Custom</p>
          <ul className="mb-4 space-y-2 text-muted-foreground">
            <li>✔️ All Pro features</li>
            <li>✔️ Custom integrations</li>
            <li>✔️ Dedicated account manager</li>
          </ul>
          <button className="w-full bg-primary text-primary-foreground py-2 rounded">Contact Us</button>
        </div>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="CityPulse Demo Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Pricing; 