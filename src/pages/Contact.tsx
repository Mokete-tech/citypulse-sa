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
import { Mail, Building2, UserPlus, Calendar, Tag } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters." }).optional(),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  inquiryType: z.enum(["deals", "events", "partnership", "other"], {
    required_error: "Please select an inquiry type.",
  }),
});

const Contact = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // In a real app, you would send this data to your backend
    toast({
      title: "Inquiry Submitted",
      description: "We'll get back to you as soon as possible. Thank you for your interest!",
    });
    form.reset();
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
                                <Input placeholder="Your name" {...field} />
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
                                <Input placeholder="your.email@example.com" {...field} />
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
                                <Input placeholder="Your business name" {...field} />
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
                                <Input placeholder="Your phone number" {...field} />
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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Submit Inquiry
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
                        Phone: +27 10 123 4567<br />
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
