import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Mail, Building2, UserPlus, Calendar, Tag, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { handleSupabaseError } from '@/lib/error-handler';

// Enhanced form validation schema with more specific rules
const formSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(100, { message: "Name must be less than 100 characters." })
    .refine(name => /^[a-zA-Z\s'-]+$/.test(name), {
      message: "Name can only contain letters, spaces, hyphens and apostrophes."
    }),

  email: z.string()
    .email({ message: "Invalid email address." })
    .max(255, { message: "Email must be less than 255 characters." }),

  businessName: z.string()
    .min(2, { message: "Business name must be at least 2 characters." })
    .max(100, { message: "Business name must be less than 100 characters." })
    .optional()
    .or(z.literal("")),

  phone: z.string()
    .min(10, { message: "Phone number must be at least 10 characters." })
    .max(20, { message: "Phone number must be less than 20 characters." })
    .refine(phone => /^[+\d\s()-]+$/.test(phone), {
      message: "Phone number can only contain digits, spaces, and the following characters: + - ( )"
    }),

  message: z.string()
    .min(10, { message: "Message must be at least 10 characters." })
    .max(1000, { message: "Message must be less than 1000 characters." }),

  inquiryType: z.enum(["deals", "events", "partnership", "other"], {
    required_error: "Please select an inquiry type.",
  }),
});

const Contact = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      businessName: "",
      phone: "",
      message: "",
      inquiryType: "deals",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFormError(null);
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      // Here we'll use Supabase to store the contact submission
      const { error } = await supabase.from('contact_submissions').insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        subject: values.inquiryType,
      });

      if (error) {
        handleSupabaseError(error, {
          title: "Submission Failed",
          message: "There was a problem submitting your inquiry."
        });
        setFormError("There was a problem submitting your inquiry. Please try again later.");
        return;
      }

      toast({
        title: "Inquiry Submitted",
        description: "We'll get back to you as soon as possible. Thank you for your interest!",
      });

      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError("An unexpected error occurred. Please try again later.");
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem submitting your inquiry. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-muted-foreground">
              Have questions? Want to advertise your deals or events? Fill out the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                  <CardDescription>
                    Fill out the form below and our team will get back to you shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="your.email@example.com" {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Business Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Your business name" {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Your phone number" {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="inquiryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Inquiry Type</FormLabel>
                            <FormControl>
                              <select
                                className="w-full p-2 border border-gray-300 rounded-md"
                                {...field}
                                disabled={isSubmitting}
                              >
                                <option value="deals">Advertising Deals</option>
                                <option value="events">Advertising Events</option>
                                <option value="partnership">Partnership Opportunities</option>
                                <option value="other">Other</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your requirements or questions..."
                                className="min-h-[120px]"
                                {...field}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-5">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Why Advertise with CityPulse?</CardTitle>
                  <CardDescription>
                    Join hundreds of local businesses promoting their deals and events.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Tag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Deal Packages</h3>
                      <p className="text-sm text-muted-foreground">
                        <strong>Standard:</strong> R199/week - Basic listing with standard visibility until expiry
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Premium:</strong> R499/week - Featured placement, enhanced visibility, and analytics until expiry
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Event Packages</h3>
                      <p className="text-sm text-muted-foreground">
                        <strong>Standard:</strong> R299/event - Basic listing with standard visibility until event date
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        <strong>Premium:</strong> R799/event - Featured placement, homepage highlight, and social media promotion until event date
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Building2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">For Businesses</h3>
                      <p className="text-sm text-muted-foreground">
                        Increase foot traffic and sales by reaching thousands of local customers actively looking for deals and events in South Africa.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Contact Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Email: info@citypulse.co.za<br />
                        Hours: Monday-Friday, 9am-5pm SAST
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
