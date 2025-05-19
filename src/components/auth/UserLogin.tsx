import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import PhoneLogin from './PhoneLogin';
import { isValidEmail, isValidPassword, checkPasswordStrength } from '@/lib/validation';
import { resetPassword } from '@/lib/auth-helpers';

interface UserLoginProps {
  onClose?: () => void;
}

const UserLogin = ({ onClose }: UserLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  const { signIn, signUp, signInWithGoogle, signInWithFacebook, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!email) {
      setFormError("Please enter your email address");
      return;
    }

    if (!password) {
      setFormError("Please enter your password");
      return;
    }

    // Email format validation
    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      await signIn(email, password);
      toast.success("Signed in successfully");
      if (onClose) onClose();
    } catch (error: any) {
      // Set a user-friendly error message
      if (error?.message?.includes("Invalid login credentials")) {
        setFormError("Invalid email or password. Please try again.");
      } else if (error?.message?.includes("Email not confirmed")) {
        setFormError("Please verify your email address before logging in.");
        toast.info("Email verification required", {
          description: "Check your inbox for a verification email or request a new one."
        });
      } else {
        setFormError("An error occurred during login. Please try again.");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!registerEmail) {
      setFormError("Please enter your email address");
      return;
    }

    if (!registerPassword) {
      setFormError("Please enter a password");
      return;
    }

    // Email format validation
    if (!isValidEmail(registerEmail)) {
      setFormError("Please enter a valid email address");
      return;
    }

    // Password strength validation
    const passwordStrength = checkPasswordStrength(registerPassword);

    if (passwordStrength.score < 3) {
      setFormError(`Password is too weak. ${passwordStrength.feedback}`);
      return;
    }

    try {
      await signUp(registerEmail, registerPassword);

      // Clear form
      setRegisterEmail("");
      setRegisterPassword("");

      // Switch to login tab
      setActiveTab("login");

      toast.success("Registration successful", {
        description: "Please check your email to verify your account before logging in."
      });
    } catch (error: any) {
      // Set a user-friendly error message
      if (error?.message?.includes("already registered")) {
        setFormError("This email is already registered. Please try login instead.");

        // Suggest to switch to login tab
        toast.info("Account exists", {
          description: "Would you like to sign in instead?",
          action: {
            label: "Sign In",
            onClick: () => {
              setEmail(registerEmail);
              setActiveTab("login");
            }
          }
        });
      } else if (error?.message?.includes("weak password")) {
        setFormError("Please use a stronger password with at least 8 characters, including numbers and special characters.");
      } else {
        setFormError("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // No need to close modal here as the page will redirect
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      // No need to close modal here as the page will redirect
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="login">Email Login</TabsTrigger>
          <TabsTrigger value="phone">Phone Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to your account to save your favorite deals and events.
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
                            // Call the resetPassword function from imported auth-helpers
                            resetPassword(email).catch(error => {
                              console.error("Password reset error:", error);
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="phone">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Phone Authentication</CardTitle>
              <CardDescription>
                Use your phone number to sign in or create an account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PhoneLogin onClose={onClose} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create an Account</CardTitle>
              <CardDescription>
                Sign up to save your favorite deals and events.
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
                  {registerPassword && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Password strength:</span>
                        <span className="text-xs">
                          {(() => {
                            const strength = checkPasswordStrength(registerPassword);
                            if (strength.score < 2) return <span className="text-destructive flex items-center"><XCircle className="h-3 w-3 mr-1" /> Weak</span>;
                            if (strength.score < 4) return <span className="text-amber-500 flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Medium</span>;
                            return <span className="text-green-500 flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Strong</span>;
                          })()}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-secondary overflow-hidden rounded-full">
                        <div
                          className={`h-full ${
                            checkPasswordStrength(registerPassword).score < 2
                              ? 'bg-destructive'
                              : checkPasswordStrength(registerPassword).score < 4
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${(checkPasswordStrength(registerPassword).score / 5) * 100}%` }}
                        />
                      </div>
                      {checkPasswordStrength(registerPassword).score < 3 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {checkPasswordStrength(registerPassword).feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* Social login buttons temporarily disabled */}
              {/* <div className="relative my-4">
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
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserLogin;
