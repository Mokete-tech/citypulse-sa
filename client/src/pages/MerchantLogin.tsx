import { useState } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function MerchantLogin() {
  const { signIn } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setLoginError(null);
    
    try {
      await signIn(data.email, data.password);
      toast({
        title: "Login successful",
        description: "Welcome back to CityPulse",
      });
      navigate("/merchant-dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Invalid email or password. Please try again.");
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <Card className="max-w-md mx-auto bg-white rounded-lg shadow-md">
          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Merchant Login</h1>
            
            {loginError && (
              <div className="bg-red-100 text-red-800 p-3 rounded mb-6">
                {loginError}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark font-medium">Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          type="email"
                          {...field}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark font-medium">Password</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="••••••••" 
                          type="password"
                          {...field}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </FormControl>
                      <div className="mt-1 text-sm text-right">
                        <a href="#" className="text-primary hover:text-opacity-80">Forgot password?</a>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-3 px-4 rounded-md font-semibold hover:bg-opacity-90 transition"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center text-neutral-dark/70">
              Don't have an account? <a href="#" className="text-primary hover:text-opacity-80 font-medium">Contact us</a> to get started.
            </div>
            
            {/* Demo account notice */}
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
              <p className="font-medium mb-1">Demo Account</p>
              <p>Email: test@merchant.com</p>
              <p>Password: password123</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}
