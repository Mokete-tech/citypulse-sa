
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, PenLine, Trash2 } from 'lucide-react';

const MerchantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    description: '',
    category: '',
    expiresAt: ''
  });
  
  // Sample merchant deals - in a real app, this would come from Firebase
  const [merchantDeals, setMerchantDeals] = useState([
    { 
      id: 1, 
      title: "20% Off All Coffee", 
      description: "Get 20% off any coffee drink, every Tuesday", 
      expiresAt: "2025-05-15",
      category: "Food & Drink",
      views: 124 
    },
    { 
      id: 2, 
      title: "Free Pastry with Coffee", 
      description: "Get a free pastry with purchase of any large coffee", 
      expiresAt: "2025-05-30",
      category: "Food & Drink",
      views: 78 
    },
  ]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDeal(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddDeal = () => {
    // In a real app, you'd add the deal to Firebase here
    const newDealWithId = {
      ...newDeal,
      id: Date.now(),
      views: 0
    };
    
    setMerchantDeals(prev => [...prev, newDealWithId]);
    setNewDeal({
      title: '',
      description: '',
      category: '',
      expiresAt: ''
    });
    setIsAddingDeal(false);
  };
  
  const handleDeleteDeal = (id: number) => {
    // In a real app, you'd delete from Firebase here
    setMerchantDeals(prev => prev.filter(deal => deal.id !== id));
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your deals and view analytics.
            </p>
          </div>
          
          <div className="mb-8">
            <Button 
              onClick={() => setIsAddingDeal(true)} 
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add New Deal
            </Button>
          </div>
          
          {isAddingDeal && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Deal</CardTitle>
                <CardDescription>
                  Fill out the form below to create a new deal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Deal Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., 20% Off All Products"
                      value={newDeal.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide details about the deal"
                      value={newDeal.description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="e.g., Food & Drink"
                        value={newDeal.category}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiresAt">Expiration Date</Label>
                      <Input
                        id="expiresAt"
                        name="expiresAt"
                        type="date"
                        value={newDeal.expiresAt}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setIsAddingDeal(false)}>Cancel</Button>
                <Button onClick={handleAddDeal}>Save Deal</Button>
              </CardFooter>
            </Card>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {merchantDeals.map(deal => (
              <Card key={deal.id}>
                <CardHeader>
                  <CardTitle>{deal.title}</CardTitle>
                  <CardDescription>Category: {deal.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{deal.description}</p>
                  <div className="text-sm text-muted-foreground">
                    Expires: {new Date(deal.expiresAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm font-medium mt-2">
                    {deal.views} views
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <PenLine className="h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => handleDeleteDeal(deal.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default MerchantDashboard;
