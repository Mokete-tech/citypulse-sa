import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../lib/firebase";
import { apiRequest, queryClient } from "../lib/queryClient";
import { Deal, insertDealSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Extended schema for the form with validation
const addDealFormSchema = insertDealSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  discount: z.string().min(1, "Discount is required"),
  category: z.string().min(1, "Please select a category"),
  expirationDate: z.string().refine(val => {
    const date = new Date(val);
    const today = new Date();
    return date > today;
  }, "Expiration date must be in the future")
});

type AddDealFormValues = z.infer<typeof addDealFormSchema>;

export default function MerchantDashboard() {
  const { currentUser, loading: authLoading, signOut } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate("/merchant-login");
    }
  }, [currentUser, authLoading, navigate]);
  
  // Fetch merchant's deals
  const { data: merchantDeals, isLoading: dealsLoading } = useQuery<Deal[]>({
    queryKey: [`/api/deals?merchantId=${currentUser?.merchantId}`],
    enabled: !!currentUser?.merchantId,
  });
  
  // Setup form
  const form = useForm<AddDealFormValues>({
    resolver: zodResolver(addDealFormSchema),
    defaultValues: {
      title: "",
      description: "",
      discount: "",
      category: "",
      merchantId: currentUser?.merchantId || "",
      merchantName: currentUser?.merchantName || "",
      expirationDate: "",
      featured: false,
      imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93" // Default image
    },
  });
  
  // Update form defaults when user data loads
  useEffect(() => {
    if (currentUser) {
      form.setValue("merchantId", currentUser.merchantId);
      form.setValue("merchantName", currentUser.merchantName);
    }
  }, [currentUser, form]);
  
  // Add deal mutation
  const addDealMutation = useMutation({
    mutationFn: async (dealData: AddDealFormValues) => {
      const response = await apiRequest("POST", "/api/deals", dealData);
      return response.json();
    },
    onSuccess: () => {
      // Reset form and show success message
      form.reset({
        title: "",
        description: "",
        discount: "",
        category: "",
        merchantId: currentUser?.merchantId || "",
        merchantName: currentUser?.merchantName || "",
        expirationDate: "",
        featured: false,
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
      });
      
      setSuccessMessage("Deal successfully added!");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
      // Invalidate and refetch deals
      queryClient.invalidateQueries({ queryKey: [`/api/deals?merchantId=${currentUser?.merchantId}`] });
      
      toast({
        title: "Success!",
        description: "Your deal has been added successfully",
      });
    },
    onError: (error) => {
      console.error("Error adding deal:", error);
      toast({
        title: "Error",
        description: "Failed to add deal. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete deal mutation
  const deleteDealMutation = useMutation({
    mutationFn: async (dealId: number) => {
      await apiRequest("DELETE", `/api/deals/${dealId}`);
      return dealId;
    },
    onSuccess: (dealId) => {
      // Invalidate and refetch deals
      queryClient.invalidateQueries({ queryKey: [`/api/deals?merchantId=${currentUser?.merchantId}`] });
      
      toast({
        title: "Success!",
        description: "Deal has been deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting deal:", error);
      toast({
        title: "Error",
        description: "Failed to delete deal. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: AddDealFormValues) => {
    addDealMutation.mutate(data);
  };
  
  const handleDeleteDeal = (id: number) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      deleteDealMutation.mutate(id);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!currentUser) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="font-bold text-xl mb-1">Merchant Portal</div>
              <div className="text-neutral-dark/70 text-sm">{currentUser.merchantName}</div>
            </div>
            
            <nav className="space-y-1">
              <a href="#" className="block py-2 px-3 bg-primary/10 text-primary rounded font-medium">Dashboard</a>
              <a href="#" className="block py-2 px-3 text-neutral-dark hover:bg-gray-100 rounded">My Deals</a>
              <a href="#" className="block py-2 px-3 text-neutral-dark hover:bg-gray-100 rounded">Account Settings</a>
              <a href="#" className="block py-2 px-3 text-neutral-dark hover:bg-gray-100 rounded">Billing</a>
              <a href="#" className="block py-2 px-3 text-neutral-dark hover:bg-gray-100 rounded">Support</a>
              <button 
                onClick={handleSignOut}
                className="block w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded mt-8"
              >
                Logout
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-white rounded-lg shadow-md mb-6">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-6">Merchant Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-medium text-neutral-dark mb-1">Active Deals</h3>
                    <div className="text-2xl font-bold text-primary">
                      {dealsLoading ? "..." : merchantDeals?.length || 0}
                    </div>
                  </div>
                  
                  <div className="bg-secondary/10 rounded-lg p-4">
                    <h3 className="font-medium text-neutral-dark mb-1">Total Views</h3>
                    <div className="text-2xl font-bold text-secondary">
                      {dealsLoading ? "..." : 
                        merchantDeals?.reduce((total, deal) => total + deal.views, 0) || 0}
                    </div>
                  </div>
                  
                  <div className="bg-accent/10 rounded-lg p-4">
                    <h3 className="font-medium text-neutral-dark mb-1">Redemptions</h3>
                    <div className="text-2xl font-bold text-accent">-</div>
                  </div>
                </div>
                
                {successMessage && (
                  <div className="bg-success/10 p-4 rounded-lg mb-6">
                    <div className="font-medium text-success">{successMessage}</div>
                  </div>
                )}
                
                <h2 className="text-xl font-bold mb-4">Add New Deal</h2>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-dark font-medium">Deal Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 20% Off All Coffees"
                                {...field}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="discount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-dark font-medium">Discount Amount</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 20% OFF"
                                {...field}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-dark font-medium">Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your deal..."
                              rows={3}
                              {...field}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-dark font-medium">Category</FormLabel>
                            <FormControl>
                              <select
                                {...field}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="">Select a category</option>
                                <option value="Food & Drink">Food & Drink</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Wellness & Spa">Wellness & Spa</option>
                                <option value="Services">Services</option>
                                <option value="Café & Restaurant">Café & Restaurant</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-dark font-medium">Expiration Date</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={addDealMutation.isPending}
                        className="bg-primary text-white py-2 px-6 rounded-md font-semibold hover:bg-opacity-90 transition"
                      >
                        {addDealMutation.isPending ? "Adding..." : "Add Deal"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            <Card className="bg-white rounded-lg shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Your Active Deals</h2>
                
                {dealsLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                    <div className="h-12 bg-gray-200 rounded w-full"></div>
                  </div>
                ) : merchantDeals && merchantDeals.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deal</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {merchantDeals.map(deal => {
                          const expirationDate = new Date(deal.expirationDate);
                          const today = new Date();
                          const daysLeft = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <tr key={deal.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium">{deal.title}</div>
                                <div className="text-sm text-gray-500">{deal.description.substring(0, 50)}...</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary/20 text-primary">{deal.discount}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {deal.views} views
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={daysLeft <= 3 ? "text-warning" : ""}>
                                  {expirationDate.toLocaleDateString()} ({daysLeft} days)
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href="#" className="text-secondary hover:text-secondary/80 mr-3">Edit</a>
                                <button 
                                  onClick={() => handleDeleteDeal(deal.id)}
                                  disabled={deleteDealMutation.isPending}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-neutral-dark/70">You don't have any active deals yet. Create your first deal above!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
