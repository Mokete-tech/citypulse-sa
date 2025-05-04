import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const ForgotPassword = () => {
  const { resetPassword, loading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await resetPassword(values.email);
      setEmail(values.email);
      setIsSubmitted(true);
    } catch (error: any) {
      toast.error("Failed to send reset email", {
        description: error.message || "Please try again later.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
          <CardDescription>
            {!isSubmitted ? "Enter your email to receive a password reset link" : "Check your email for reset instructions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Email sent!</AlertTitle>
                <AlertDescription className="text-green-700">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
                </AlertDescription>
              </Alert>
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Didn't receive the email? Check your spam folder or <button onClick={() => setIsSubmitted(false)} className="text-primary hover:underline">try again</button>.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <div className="text-center text-sm">
            <Link to={isSubmitted ? "/" : "/merchant/login"} className="text-primary hover:underline flex items-center justify-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>{isSubmitted ? "Return to Home" : "Back to Login"}</span>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
