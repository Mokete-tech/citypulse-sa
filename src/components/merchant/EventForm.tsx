import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ImageIcon, MapPinIcon, TagIcon, TicketIcon, ClockIcon } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const eventFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  location: z.string().min(3, { message: "Please enter a valid location" }),
  venue: z.string().min(3, { message: "Please enter a venue name" }),
  event_date: z.date({ required_error: "Please select an event date" }),
  start_time: z.string().min(1, { message: "Please enter a start time" }),
  end_time: z.string().min(1, { message: "Please enter an end time" }),
  ticket_price: z.string().optional(),
  ticket_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  image_url: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_premium: z.boolean().default(false),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultValues: Partial<EventFormValues> = {
  title: "",
  description: "",
  category: "",
  location: "",
  venue: "",
  ticket_price: "",
  ticket_url: "",
  image_url: "",
  is_featured: false,
  is_premium: false,
};

interface EventFormProps {
  onSubmit?: (data: EventFormValues) => void;
  onCancel?: () => void;
}

export function EventForm({ onSubmit: externalSubmit, onCancel }: EventFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues,
  });

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting(true);

    try {
      // Format the data for Supabase
      const eventData = {
        ...data,
        created_at: new Date().toISOString(),
        merchant_id: (await supabase.auth.getUser()).data.user?.id,
        event_date: data.event_date.toISOString().split('T')[0],
      };

      if (externalSubmit) {
        // If an external submit handler was provided, use it
        externalSubmit(data);
      } else {
        // Otherwise, handle submission internally
        // Insert the event into Supabase
        const { error } = await supabase
          .from('events')
          .insert(eventData);

        if (error) throw error;

        toast.success("Event created successfully!");
        form.reset(defaultValues);
        setActiveTab("details");

        // Redirect to the events page
        navigate("/merchant/events");
      }
    } catch (error: any) {
      toast.error("Failed to create event: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Event</CardTitle>
        <CardDescription>
          Fill out the form below to create a new event. Events will be reviewed before being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Basic Details</TabsTrigger>
            <TabsTrigger value="datetime">Date & Time</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="details" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Music Festival" {...field} />
                      </FormControl>
                      <FormDescription>
                        A catchy title will attract more attendees.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Join us for a day of live music, food, and fun..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of your event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="food">Food & Drink</SelectItem>
                          <SelectItem value="arts">Arts & Culture</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="community">Community</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        <TagIcon className="inline-block mr-1 h-4 w-4" />
                        Select the category that best describes your event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Cape Town" {...field} />
                        </FormControl>
                        <FormDescription>
                          <MapPinIcon className="inline-block mr-1 h-4 w-4" />
                          City or area where the event will take place.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="venue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Grand Arena" {...field} />
                        </FormControl>
                        <FormDescription>
                          The specific venue for your event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="button"
                  onClick={() => setActiveTab("datetime")}
                  className="w-full mt-4"
                >
                  Next: Date & Time
                </Button>
              </TabsContent>

              <TabsContent value="datetime" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        <CalendarIcon className="inline-block mr-1 h-4 w-4" />
                        Select the date of your event.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          <ClockIcon className="inline-block mr-1 h-4 w-4" />
                          When does your event start?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          When does your event end?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("tickets")}
                  >
                    Next: Tickets
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tickets" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="ticket_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket Price (R)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="150" {...field} />
                      </FormControl>
                      <FormDescription>
                        <TicketIcon className="inline-block mr-1 h-4 w-4" />
                        Leave empty if the event is free.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ticket_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ticket URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://ticketing-site.com/your-event"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to where attendees can purchase tickets.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("datetime")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("media")}
                  >
                    Next: Media
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        <ImageIcon className="inline-block mr-1 h-4 w-4" />
                        Add an image URL for your event. We recommend 1200x630px.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between mt-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("tickets")}
                    >
                      Back
                    </Button>
                    {onCancel && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating Event..." : "Create Event"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Pro Tip:</span> Events with complete information and high-quality images get more attendees.
        </div>
      </CardFooter>
    </Card>
  );
}
