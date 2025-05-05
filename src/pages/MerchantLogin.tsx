
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(100, { message: "Password is too long." })
})

const registerSchema = z.object({
  merchant_name: z.string()
    .min(2, { message: "Business name must be at least 2 characters." })
    .max(100, { message: "Business name is too long." }),
  business_type: z.string()
    .min(2, { message: "Business type must be at least 2 characters." })
    .max(50, { message: "Business type is too long." }),
  email: z.string()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email is too long." }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .max(100, { message: "Password is too long." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." }),
  phone: z.string()
    .min(10, { message: "Please enter a valid phone number." })
    .max(15, { message: "Phone number is too long." })
    .regex(/^\+?[0-9]+$/, { message: "Phone number can only contain digits and an optional + prefix." }),
  location: z.string()
    .min(2, { message: "Please enter a valid location." })
    .max(100, { message: "Location is too long." }),
})

const MerchantLogin = () => {
  const { signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Login Form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginSubmit = async (values: z.infer<typeof loginSchema>) => {
    // Check if account is locked
    if (isLocked) {
      const remainingTime = lockoutEndTime ? Math.ceil((lockoutEndTime.getTime() - Date.now()) / 1000 / 60) : 0;
      toast({
        variant: "destructive",
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
      });
      return;
    }

    try {
      await signIn(values.email, values.password);
      toast({
        title: "Login successful!",
        description: "Redirecting to your dashboard...",
      });
      // Reset login attempts on successful login
      setLoginAttempts(0);
      navigate('/merchant/dashboard');
    } catch (error: any) {
      // Increment login attempts on failure
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockoutEnd = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        setIsLocked(true);
        setLockoutEndTime(lockoutEnd);

        // Set a timer to unlock
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          setLockoutEndTime(null);
        }, 15 * 60 * 1000);

        toast({
          variant: "destructive",
          title: "Account temporarily locked",
          description: "Too many failed attempts. Please try again in 15 minutes.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Invalid credentials. Please try again.",
        });
      }
    }
  }

  // Register Form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      merchant_name: "",
      business_type: "",
      email: "",
      password: "",
      phone: "",
      location: "",
    },
  })

  const registerSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await signUp(
        values.email,
        values.password,
        {
          merchant_name: values.merchant_name,
          business_type: values.business_type,
          phone: phone,
          location: values.location
        }
      );
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed.",
        description: error.message || "Something went wrong. Please try again.",
      })
    }
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md space-y-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Merchant Portal</CardTitle>
          </CardHeader>
          <CardContent>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(loginSubmit)} className="space-y-4">
                  {isLocked && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Account temporarily locked</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>Too many failed login attempts. Please try again in {lockoutEndTime ? Math.ceil((lockoutEndTime.getTime() - Date.now()) / 1000 / 60) : 15} minutes.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            {...field}
                            disabled={isLocked || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLocked || loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button disabled={loading || isLocked} type="submit" className="w-full">
                    {isLocked ? "Account Locked" : loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </Form>
              <div className="text-center text-sm text-gray-500">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot password?
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="register">
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Become a Merchant</h2>
                  <p className="text-muted-foreground">Create your merchant account to start listing deals and events.</p>
                </div>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(registerSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="merchant_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="business_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business type</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your business type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                              onFocus={() => setShowPasswordRequirements(true)}
                            />
                          </FormControl>
                          <FormMessage />
                          {showPasswordRequirements && (
                            <div className="text-xs text-muted-foreground mt-2 space-y-1">
                              <p>Password must:</p>
                              <ul className="list-disc pl-4 space-y-1">
                                <li>Be at least 8 characters long</li>
                                <li>Contain at least one uppercase letter</li>
                                <li>Contain at least one lowercase letter</li>
                                <li>Contain at least one number</li>
                                <li>Contain at least one special character</li>
                              </ul>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <FormLabel>Phone number</FormLabel>
                      <Input
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <FormField
                      control={registerForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your business location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button disabled={loading} type="submit" className="w-full">
                      Create Merchant Account
                    </Button>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>

      <Footer />
    </div>
  );
};

export default MerchantLogin;
