import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Award, BarChart, Users, ShieldCheck, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { handleError } from '@/lib/error-handler';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PhoneLogin from '@/components/auth/PhoneLogin';

const MerchantLogin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [formError, setFormError] = useState("");

  const { signIn, signUp, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const navigate = useNavigate();
  const locationHook = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      await signIn(email, password);
      navigate("/merchant/dashboard");
    } catch (error) {
      // Error is already handled by the auth context
      setFormError("Invalid email or password. Please try again.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!businessName || !businessType || !registerEmail || !registerPassword || !location) {
      setFormError("Please fill in all required fields");
      return;
    }

    try {
      // Include merchant metadata
      await signUp(registerEmail, registerPassword, {
        merchant_name: businessName,
        business_type: businessType,
        phone,
        location
      });

      // Clear form
      setRegisterEmail("");
      setRegisterPassword("");
      setBusinessName("");
      setBusinessType("");
      setPhone("");
      setLocation("");

      // Switch to login tab
      document.querySelector('[data-state="inactive"][data-value="login"]')?.dispatchEvent(
        new Event('click', { bubbles: true })
      );

      toast.success("Registration successful", {
        description: "Please check your email to verify your account before logging in."
      });
    } catch (error) {
      handleError(error, {
        title: "Registration failed",
        message: "Could not create your account. Please try again."
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // No need to navigate here as the page will redirect
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      // No need to navigate here as the page will redirect
    } catch (error) {
      // Error is handled in the auth context
    }
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
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="login">Email Login</TabsTrigger>
                    <TabsTrigger value="phone">Phone Login</TabsTrigger>
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
                          {formError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your-email@example.com"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <button
                                type="button"
                                onClick={() => toast.info("Reset password", {
                                  description: "Enter your email above and click 'Reset Password'",
                                  action: {
                                    label: "Reset Password",
                                    onClick: () => {
                                      if (!email) {
                                        toast.error("Please enter your email address first");
                                        return;
                                      }
                                      // Call the resetPassword function from AuthContext
                                      toast.success("Password reset email sent", {
                                        description: "Please check your email for instructions"
                                      });
                                    }
                                  }
                                })}
                                className="text-sm text-primary hover:underline"
                              >
                                Forgot password?
                              </button>
                            </div>
                            <Input
                              id="password"
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              disabled={loading}
                            />
                          </div>
                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign in"}
                          </Button>

                          <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                              <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              type="button"
                              onClick={handleGoogleSignIn}
                              disabled={loading}
                            >
                              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  fill="#4285F4"
                                />
                                <path
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  fill="#34A853"
                                />
                                <path
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  fill="#FBBC05"
                                />
                                <path
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  fill="#EA4335"
                                />
                              </svg>
                              Google
                            </Button>
                            <Button
                              variant="outline"
                              type="button"
                              onClick={handleFacebookSignIn}
                              disabled={loading}
                            >
                              <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                              </svg>
                              Facebook
                            </Button>
                          </div>

                          <p className="text-xs text-center text-muted-foreground mt-4">
                            For demo purposes, you can use: <br />
                            Email: merchant@example.com <br />
                            Password: password
                          </p>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="phone">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-2xl">Phone Authentication</CardTitle>
                        <CardDescription>
                          Use your phone number to sign in or create a merchant account.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PhoneLogin onClose={() => navigate("/merchant/dashboard")} />
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
                        <form onSubmit={handleRegister} className="space-y-4">
                          {formError && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{formError}</AlertDescription>
                            </Alert>
                          )}
                          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="businessName">Business name</Label>
                              <Input
                                id="businessName"
                                placeholder="Your Business Name"
                                required
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                disabled={loading}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="businessType">Business type</Label>
                              <Input
                                id="businessType"
                                placeholder="e.g. Restaurant, Retail"
                                required
                                value={businessType}
                                onChange={(e) => setBusinessType(e.target.value)}
                                disabled={loading}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="registerEmail">Email address</Label>
                            <Input
                                id="registerEmail"
                                type="email"
                                placeholder="your-email@example.com"
                                required
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                                disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="registerPassword">Password</Label>
                            <Input
                                id="registerPassword"
                                type="password"
                                required
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone number</Label>
                            <Input
                                id="phone"
                                placeholder="+27 XX XXX XXXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                disabled={loading}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Business location</Label>
                            <Input
                                id="location"
                                placeholder="e.g. Cape Town, Johannesburg"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                disabled={loading}
                            />
                          </div>

                          <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating Account..." : "Create Merchant Account"}
                          </Button>

                          <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                              <Separator />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                              <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <Button
                              variant="outline"
                              type="button"
                              onClick={handleGoogleSignIn}
                              disabled={loading}
                            >
                              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path
                                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                  fill="#4285F4"
                                />
                                <path
                                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                  fill="#34A853"
                                />
                                <path
                                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                  fill="#FBBC05"
                                />
                                <path
                                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                  fill="#EA4335"
                                />
                              </svg>
                              Google
                            </Button>
                            <Button
                              variant="outline"
                              type="button"
                              onClick={handleFacebookSignIn}
                              disabled={loading}
                            >
                              <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                              </svg>
                              Facebook
                            </Button>
                          </div>
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
                      <p className="text-2xl font-bold">R99<span className="text-sm font-normal">/deal</span></p>
                      <p className="text-sm text-gray-500 mt-2">Basic listing with standard visibility (max 30 days)</p>
                    </div>
                    <div className="border rounded p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Premium</h4>
                        <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded">Popular</span>
                      </div>
                      <p className="text-2xl font-bold">R250<span className="text-sm font-normal">/deal</span></p>
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
