
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Award, BarChart, Users, ShieldCheck } from 'lucide-react';

const MerchantLogin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // In a real app, you'd authenticate with Firebase here
    setTimeout(() => {
      // This is a mock login - in a real app, you'd verify credentials with Firebase
      if (email === "merchant@example.com" && password === "password") {
        navigate("/merchant/dashboard");
      } else {
        alert("Invalid credentials. Try again.");
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">Partner With CityPulse South Africa</h1>
            <p className="text-muted-foreground text-center mb-8">
              Join South Africa's fastest growing local deals platform
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <Tabs defaultValue="login">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Merchant Login</CardTitle>
                        <CardDescription>
                          Log in to manage your deals and see analytics.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="your-email@example.com" 
                              required 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <a href="#" className="text-sm text-primary hover:underline">
                                Forgot password?
                              </a>
                            </div>
                            <Input 
                              id="password" 
                              type="password" 
                              required 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Become a Merchant</CardTitle>
                        <CardDescription>
                          Register your business to start posting deals.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form className="space-y-4">
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="businessName">Business name</Label>
                              <Input id="businessName" placeholder="Your Business Name" required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="businessType">Business type</Label>
                              <Input id="businessType" placeholder="e.g. Restaurant, Retail" required />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="registerEmail">Email address</Label>
                            <Input id="registerEmail" type="email" placeholder="your-email@example.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="registerPassword">Password</Label>
                            <Input id="registerPassword" type="password" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone number</Label>
                            <Input id="phone" placeholder="+27 XX XXX XXXX" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Business location</Label>
                            <Input id="location" placeholder="e.g. Cape Town, Johannesburg" required />
                          </div>
                          
                          <Button className="w-full">
                            Create Merchant Account
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="flex flex-col space-y-6">
                <div className="bg-gradient-to-r from-sa-blue to-sa-green p-8 rounded-lg text-white">
                  <h2 className="text-2xl font-bold mb-4">Why Partner With CityPulse?</h2>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Users className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Extensive Reach</span>
                        <p className="text-sm opacity-90">Connect with thousands of local customers actively searching for deals and events in South Africa.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <BarChart className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Detailed Analytics</span>
                        <p className="text-sm opacity-90">Track performance with comprehensive analytics on views, engagement, and conversions.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Award className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Premium Promotion</span>
                        <p className="text-sm opacity-90">Feature your deals with premium advertising options for maximum visibility.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Simple Management</span>
                        <p className="text-sm opacity-90">Easy-to-use dashboard to create, edit and manage your deals and promotions.</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-bold mb-4 text-xl">Advertising Packages</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="border rounded p-4">
                      <h4 className="font-medium">Standard</h4>
                      <p className="text-2xl font-bold">R199<span className="text-sm font-normal">/week</span></p>
                      <p className="text-sm text-gray-500 mt-2">Basic listing with standard visibility</p>
                    </div>
                    <div className="border rounded p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Premium</h4>
                        <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded">Popular</span>
                      </div>
                      <p className="text-2xl font-bold">R499<span className="text-sm font-normal">/week</span></p>
                      <p className="text-sm text-gray-700 mt-2">Featured placement and enhanced visibility</p>
                    </div>
                  </div>
                  
                  <Button className="w-full flex items-center justify-center gap-2">
                    <CreditCard className="h-4 w-4" /> View All Pricing Options
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-8 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Success Stories</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 mb-3"></div>
                      <p className="font-bold">Cape Town Café</p>
                      <p className="text-sm text-muted-foreground">Restaurant Owner</p>
                    </div>
                    <p className="text-sm italic text-center">
                      "Our coffee shop saw a 40% increase in new customers after running a promotion on CityPulse. The targeting and analytics were impressive!"
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 mb-3"></div>
                      <p className="font-bold">Joburg Fashion</p>
                      <p className="text-sm text-muted-foreground">Boutique Owner</p>
                    </div>
                    <p className="text-sm italic text-center">
                      "The video ad feature helped us showcase our new collection and we sold out within days. Worth every rand spent on premium advertising!"
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center mb-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 mb-3"></div>
                      <p className="font-bold">Durban Tours</p>
                      <p className="text-sm text-muted-foreground">Tour Operator</p>
                    </div>
                    <p className="text-sm italic text-center">
                      "We've been able to fill our tour slots consistently since advertising on CityPulse. The platform has connected us with both locals and tourists."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MerchantLogin;
