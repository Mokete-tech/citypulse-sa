import React from 'react';

export const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Please read these terms carefully before using our services.
      </p>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
        <p className="text-muted-foreground">
          By accessing or using CityPulse, you agree to be bound by these Terms of Service.
        </p>
        <h2 className="text-2xl font-semibold mt-6">2. Use of Services</h2>
        <p className="text-muted-foreground">
          You agree to use our services only for lawful purposes and in accordance with these Terms.
        </p>
        <h2 className="text-2xl font-semibold mt-6">3. User Accounts</h2>
        <p className="text-muted-foreground">
          You are responsible for maintaining the confidentiality of your account and password.
        </p>
      </div>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/9No-FiEInLA"
          title="Terms of Service Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Terms;
