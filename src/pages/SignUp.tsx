import React from 'react';
import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Create Account
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join CityPulse to discover local businesses and events
          </p>
        </div>
        <ClerkSignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          redirectUrl="/"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
};

export default SignUp; 