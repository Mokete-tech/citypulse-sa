import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface UserLoginDialogProps {
  triggerClassName?: string;
  className?: string;
}

export const UserLoginDialog: React.FC<UserLoginDialogProps> = ({ triggerClassName, className }) => {
  const [open, setOpen] = useState(false);
  const { signIn, signUp, user, signInWithGoogle, signInWithFacebook } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Close dialog if user is logged in
  React.useEffect(() => {
    if (user) {
      setOpen(false);
    }
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      toast.success('Signed in successfully');
      setOpen(false);
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
    if (!email || !password || !name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password, { 
        name
      });
      toast.success('Account created successfully', {
        description: 'Welcome to CityPulse!'
      });
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={triggerClassName}>
          Member Login
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] p-0 overflow-hidden ${className || ''}`}>
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-center">Sign in to CityPulse</CardTitle>
            <CardDescription className="text-center">
              Welcome back! Please sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="register">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSignIn}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
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
                    onClick={() => signInWithGoogle()}
                    disabled={isLoading}
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
                    onClick={() => signInWithFacebook()}
                    disabled={isLoading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        fill="#1877F2"
                      />
                    </svg>
                    Facebook
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSignUp}>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="registerEmail">Email address</Label>
                      <Input
                        id="registerEmail"
                        type="email"
                        placeholder="Enter your email address"
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
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
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
                          Sign Up
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex-col space-y-4 border-t pt-4">
            <div className="text-center text-xs text-muted-foreground">
              <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            </div>
            <div className="text-center">
              <span className="text-xs">Secured by</span>
              <img 
                src="https://supabase.com/dashboard/img/supabase-logo.svg" 
                alt="Supabase" 
                className="h-6 w-auto inline-block ml-2" 
              />
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default UserLoginDialog;
