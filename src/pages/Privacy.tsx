import React from 'react';

export const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Your privacy is important to us. This page explains how we collect, use, and protect your data.
      </p>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">What We Collect</h2>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>Basic account information (name, email, etc.)</li>
          <li>Usage analytics (for improving the app)</li>
          <li>Location data (only with your permission)</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">How We Use Your Data</h2>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>To provide personalized deals and events</li>
          <li>To improve our AI recommendations</li>
          <li>To process payments securely</li>
        </ul>
        <h2 className="text-2xl font-semibold mt-6">Your Rights</h2>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>You can request your data at any time</li>
          <li>You can delete your account and data</li>
          <li>We never sell your data to third parties</li>
        </ul>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/9No-FiEInLA"
          title="Privacy Policy Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Privacy; 