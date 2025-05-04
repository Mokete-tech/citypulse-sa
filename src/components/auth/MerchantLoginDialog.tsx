import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, Mail, Building2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';

import { useAuth } from '@/contexts/AuthContext';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

interface MerchantLoginDialogProps {
  className?: string;
  children?: React.ReactNode;
}

const MerchantLoginDialog = ({ className, children }: MerchantLoginDialogProps) => {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState<Date | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    if (isLocked) {
      const remainingTime = lockoutEndTime ? Math.ceil((lockoutEndTime.getTime() - Date.now()) / 1000 / 60) : 0;
      toast.error("Account temporarily locked", {
        description: `Too many failed attempts. Please try again in ${remainingTime} minutes.`,
      });
      return;
    }

    try {
      await signIn(values.email, values.password);
      setOpen(false);
      navigate('/merchant/dashboard');
      // Reset login attempts on successful login
      setLoginAttempts(0);
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
        
        toast.error("Account temporarily locked", {
          description: "Too many failed attempts. Please try again in 15 minutes.",
        });
      } else {
        toast.error("Login failed", {
          description: error.message || "Invalid credentials. Please try again.",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className={className}>
            <LogIn className="h-4 w-4 mr-2" />
            <span>Merchant Login</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Merchant Login</DialogTitle>
          <DialogDescription>
            Access your merchant dashboard to manage deals, events, and view analytics.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          disabled={isLocked}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          {...field}
                          disabled={isLocked}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || isLocked}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  {isLocked ? "Account Locked" : loading ? "Signing in..." : "Login as Merchant"}
                </Button>

                <div className="flex justify-between text-center text-sm text-muted-foreground mt-4">
                  <Link to="/forgot-password" className="hover:underline">
                    Forgot password?
                  </Link>
                  <Link to="/merchant/login" className="hover:underline" onClick={() => setOpen(false)}>
                    Register as Merchant
                  </Link>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantLoginDialog;
