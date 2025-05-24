
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, Mail, UserPlus, Building, ShieldCheck, Check } from 'lucide-react';
import ResponsiveImage from '@/components/ui/responsive-image';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { EnvWarning } from '@/components/ui/env-warning';

const MerchantLogin = () => {
  const navigate = useNavigate();
  const { signInWithEmail, signUp, user, isMerchant } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');

  // If user is already logged in and is a merchant, redirect to dashboard
  React.useEffect(() => {
    if (user && isMerchant) {
      navigate('/merchant/dashboard');
    }
  }, [user, isMerchant, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
      toast.success('Signed in successfully');
      navigate('/merchant/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: error.message || 'Please check your credentials and try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !businessName || !contactName) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password, { 
        role: 'merchant',
        businessName,
        contactName
      });
      toast.success('Account created successfully', {
        description: 'Welcome to CityPulse Business Platform!'
      });
      navigate('/merchant/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error('Registration failed', {
        description: error.message || 'Please try again or contact support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResponsiveLayout
      title="Business Portal"
      description="Login or register your business on CityPulse"
      className="min-h-screen"
    >
      <EnvWarning />
      
      <div className="grid gap-6 lg:grid-cols-2 items-start mb-10">
        <Card className="lg:order-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Business Access</CardTitle>
            <CardDescription>Login to your business account or register your business</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleSignIn}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button variant="link" className="px-0 h-auto font-normal" type="button">
                          Forgot password?
                        </Button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <LogIn className="mr-2 h-4 w-4" />
                          Sign In
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        type="text"
                        placeholder="Your Business Name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contactName">Contact Person</Label>
                      <Input
                        id="contactName"
                        type="text"
                        placeholder="Your Name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="registerEmail">Email</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="registerPassword">Password</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Register Business
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-4 pt-4 border-t text-center text-sm text-muted-foreground">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-8 lg:order-1">
          <div>
            <h2 className="text-2xl font-bold mb-4">Grow Your Business with CityPulse</h2>
            <p className="text-gray-600 mb-6">Join thousands of businesses across South Africa who are growing through the CityPulse platform.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Building className="h-5 w-5 text-blue-700" />
                  </div>
                  <h3 className="font-medium">3,200+</h3>
                </div>
                <p className="text-sm text-gray-600">Businesses already on the platform</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-green-700" />
                  </div>
                  <h3 className="font-medium">Secure</h3>
                </div>
                <p className="text-sm text-gray-600">Platform with advanced security</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
            <h3 className="font-medium text-blue-800 text-lg mb-3">Business Benefits</h3>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>Reach over 45,000 monthly active users</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>List your deals and events in just minutes</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>Access detailed analytics on performance</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>Get featured in our weekly promotions</span>
              </li>
            </ul>
          </div>
          
          <div>
            <ResponsiveImage 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2400"
              alt="Business analytics"
              className="rounded-lg shadow-md"
              aspectRatio="16/9"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-10 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-lg mb-2">How do I get started?</h3>
            <p className="text-gray-600">Register your business, choose a subscription package, and start listing your deals and events immediately.</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-lg mb-2">What are the fees?</h3>
            <p className="text-gray-600">We offer flexible packages with no hidden costs. View our <a href="/merchant/packages" className="text-blue-600 hover:underline">pricing page</a> for details.</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-lg mb-2">How do payments work?</h3>
            <p className="text-gray-600">We process payments securely through Stripe. You'll receive payouts directly to your bank account.</p>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel or upgrade your subscription at any time from your merchant dashboard.</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default MerchantLogin;
