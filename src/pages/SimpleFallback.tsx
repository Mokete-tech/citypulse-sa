import React from 'react';

const SimpleFallback = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CityPulse South Africa</h1>
        <p className="text-lg text-gray-600 mb-8">Loading your local deals and events...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default SimpleFallback;
