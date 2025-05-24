import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LoadingState } from '@/components/ui/loading-state';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseError } from '@/lib/error-handler';
import { toast } from '@/components/ui/sonner';
import {
  Users,
  Tag,
  Calendar,
  BarChart,
  SearchIcon,
  UserPlus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  merchant_name?: string;
  business_type?: string;
}

interface Deal {
  id: number;
  title: string;
  merchant_name: string;
  category: string;
  expiration_date: string;
  featured: boolean;
}

interface Event {
  id: number;
  title: string;
  merchant_name: string;
  date: string;
  location: string;
  featured: boolean;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  created_at: string;
  responded: boolean;
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDeals: 0,
    totalEvents: 0,
    totalContacts: 0,
  });

  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin) {
      navigate('/unauthorized');
      return;
    }

    fetchData();
  }, [isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_users_with_roles');

      if (usersError) throw usersError;

      // Fetch deals
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('id, title, merchant_name, category, expiration_date, featured')
        .order('created_at', { ascending: false })
        .limit(10);

      if (dealsError) throw dealsError;

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, merchant_name, date, location, featured')
        .order('created_at', { ascending: false })
        .limit(10);

      if (eventsError) throw eventsError;

      // Fetch contact submissions
      const { data: contactsData, error: contactsError } = await supabase
        .from('contact_submissions')
        .select('id, name, email, subject, created_at, responded')
        .order('created_at', { ascending: false })
        .limit(10);

      if (contactsError) throw contactsError;

      // Set data
      setUsers(usersData || []);
      setDeals(dealsData || []);
      setEvents(eventsData || []);
      setContacts(contactsData || []);

      // Set stats
      setStats({
        totalUsers: usersData?.length || 0,
        totalDeals: dealsData?.length || 0,
        totalEvents: eventsData?.length || 0,
        totalContacts: contactsData?.length || 0,
      });
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error fetching data',
        message: 'Failed to load admin dashboard data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    toast.info(`Searching for "${searchQuery}"...`);
  };

  const handleSetUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase.rpc('set_user_role', {
        user_id: userId,
        role: role
      });

      if (error) throw error;

      toast.success(`User role updated to ${role}`);
      fetchData(); // Refresh data
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error updating user role',
        message: 'Failed to update user role.'
      });
    }
  };

  const handleToggleFeatured = async (id: number, isFeatured: boolean, type: 'deal' | 'event') => {
    try {
      const { error } = await supabase
        .from(type === 'deal' ? 'deals' : 'events')
        .update({ featured: !isFeatured })
        .eq('id', id);

      if (error) throw error;

      toast.success(`${type === 'deal' ? 'Deal' : 'Event'} updated successfully`);
      fetchData(); // Refresh data
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error updating item',
        message: `Failed to update ${type}.`
      });
    }
  };

  const handleMarkResponded = async (id: number, responded: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ responded: !responded })
        .eq('id', id);

      if (error) throw error;

      toast.success('Contact submission updated');
      fetchData(); // Refresh data
    } catch (error) {
      handleSupabaseError(error, {
        title: 'Error updating contact',
        message: 'Failed to update contact submission.'
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-72' : 'ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>

              <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="sm">
                  <SearchIcon className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </div>

            <LoadingState isLoading={loading} type="card" count={4}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Deals</p>
                        <p className="text-2xl font-bold">{stats.totalDeals}</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Tag className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
                        <p className="text-2xl font-bold">{stats.totalEvents}</p>
                      </div>
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Calendar className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Contact Requests</p>
                        <p className="text-2xl font-bold">{stats.totalContacts}</p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <BarChart className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="deals">Deals</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Dashboard Overview</CardTitle>
                      <CardDescription>
                        Welcome to the admin dashboard. Here you can manage users, deals, events, and contact requests.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Select a tab above to manage specific aspects of the platform.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={() => handleTabChange('users')} variant="outline" className="justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </Button>

                        <Button onClick={() => handleTabChange('deals')} variant="outline" className="justify-start">
                          <Tag className="mr-2 h-4 w-4" />
                          Manage Deals
                        </Button>

                        <Button onClick={() => handleTabChange('events')} variant="outline" className="justify-start">
                          <Calendar className="mr-2 h-4 w-4" />
                          Manage Events
                        </Button>

                        <Button onClick={() => handleTabChange('contacts')} variant="outline" className="justify-start">
                          <BarChart className="mr-2 h-4 w-4" />
                          View Contact Requests
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                          Manage user accounts and roles
                        </CardDescription>
                      </div>
                      <Button size="sm">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-6 p-4 font-medium border-b">
                          <div className="col-span-2">Email</div>
                          <div>Role</div>
                          <div>Created</div>
                          <div>Last Login</div>
                          <div>Actions</div>
                        </div>

                        {users.map((user) => (
                          <div key={user.id} className="grid grid-cols-6 p-4 border-b last:border-0 items-center">
                            <div className="col-span-2 font-medium">
                              {user.email}
                              {user.merchant_name && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {user.merchant_name} ({user.business_type})
                                </div>
                              )}
                            </div>
                            <div>
                              <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'merchant' ? 'default' : 'secondary'}>
                                {user.role || 'user'}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.last_sign_in_at
                                ? new Date(user.last_sign_in_at).toLocaleDateString()
                                : 'Never'}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetUserRole(user.id, 'admin')}
                                disabled={user.role === 'admin'}
                              >
                                Make Admin
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSetUserRole(user.id, 'merchant')}
                                disabled={user.role === 'merchant'}
                              >
                                Make Merchant
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="deals" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deals Management</CardTitle>
                      <CardDescription>
                        Manage deals and promotions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-6 p-4 font-medium border-b">
                          <div className="col-span-2">Title</div>
                          <div>Merchant</div>
                          <div>Category</div>
                          <div>Expires</div>
                          <div>Actions</div>
                        </div>

                        {deals.map((deal) => (
                          <div key={deal.id} className="grid grid-cols-6 p-4 border-b last:border-0 items-center">
                            <div className="col-span-2 font-medium">
                              {deal.title}
                              {deal.featured && (
                                <Badge variant="outline" className="ml-2">Featured</Badge>
                              )}
                            </div>
                            <div className="text-sm">{deal.merchant_name}</div>
                            <div className="text-sm">{deal.category}</div>
                            <div className="text-sm text-muted-foreground">
                              {deal.expiration_date}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleFeatured(deal.id, deal.featured, 'deal')}
                              >
                                {deal.featured ? 'Unfeature' : 'Feature'}
                              </Button>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Events Management</CardTitle>
                      <CardDescription>
                        Manage events and activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-6 p-4 font-medium border-b">
                          <div className="col-span-2">Title</div>
                          <div>Merchant</div>
                          <div>Date</div>
                          <div>Location</div>
                          <div>Actions</div>
                        </div>

                        {events.map((event) => (
                          <div key={event.id} className="grid grid-cols-6 p-4 border-b last:border-0 items-center">
                            <div className="col-span-2 font-medium">
                              {event.title}
                              {event.featured && (
                                <Badge variant="outline" className="ml-2">Featured</Badge>
                              )}
                            </div>
                            <div className="text-sm">{event.merchant_name}</div>
                            <div className="text-sm">{event.date}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.location}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleFeatured(event.id, event.featured, 'event')}
                              >
                                {event.featured ? 'Unfeature' : 'Feature'}
                              </Button>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Requests</CardTitle>
                      <CardDescription>
                        Manage contact form submissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-5 p-4 font-medium border-b">
                          <div>Name</div>
                          <div>Email</div>
                          <div>Subject</div>
                          <div>Date</div>
                          <div>Actions</div>
                        </div>

                        {contacts.map((contact) => (
                          <div key={contact.id} className="grid grid-cols-5 p-4 border-b last:border-0 items-center">
                            <div className="font-medium">{contact.name}</div>
                            <div className="text-sm">{contact.email}</div>
                            <div className="text-sm">{contact.subject}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(contact.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant={contact.responded ? "outline" : "default"}
                                size="sm"
                                onClick={() => handleMarkResponded(contact.id, contact.responded)}
                              >
                                {contact.responded ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Mark Unresponded
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark Responded
                                  </>
                                )}
                              </Button>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </LoadingState>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminDashboard;
