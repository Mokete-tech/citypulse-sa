import React from 'react';

export const CheckoutSuccess = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-6 text-center">Checkout Successful!</h1>
      <p className="text-lg text-center mb-8 text-muted-foreground">
        Thank you for your purchase. Your order has been confirmed and you will receive a receipt shortly.
      </p>
      <div className="aspect-video rounded-lg overflow-hidden shadow-lg mx-auto max-w-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/9No-FiEInLA"
          title="Checkout Success Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default CheckoutSuccess; 