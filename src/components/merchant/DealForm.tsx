import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CreditCard, Image, MapPin, Video, AlertCircle, Info } from 'lucide-react';
import { MediaUploader } from '@/components/merchant/MediaUploader';
import { toast } from '@/components/ui/sonner';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

// Define the schema for deal validation
const dealSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }).max(500, { message: 'Description must be less than 500 characters' }),
  category: z.string({ required_error: 'Please select a category' }),
  location: z.string().min(3, { message: 'Location is required' }),
  discount: z.string().min(2, { message: 'Discount information is required' }),
  expiresAt: z.date({ required_error: 'Expiration date is required' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  mediaType: z.enum(['image', 'video']),
  mediaUrl: z.string().optional(),
  isPremium: z.boolean().default(false),
  pricingPlan: z.enum(['weekly', 'monthly']).default('weekly'),
  terms: z.boolean().refine(val => val === true, { message: 'You must accept the terms and conditions' }),
  targetAudience: z.array(z.string()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().optional(),
});

// Define the type based on the schema
type DealFormValues = z.infer<typeof dealSchema>;

// Define the props for the component
interface DealFormProps {
  merchantId: string;
  merchantName: string;
  onSubmit: (values: DealFormValues) => void;
  onCancel: () => void;
}

// Available categories
const CATEGORIES = [
  { value: 'Food & Drink', label: 'Food & Drink' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Beauty', label: 'Beauty' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Health', label: 'Health & Fitness' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Services', label: 'Services' },
  { value: 'Education', label: 'Education' },
];

// Audience targeting options
const AUDIENCE_OPTIONS = [
  { id: 'students', label: 'Students' },
  { id: 'families', label: 'Families' },
  { id: 'professionals', label: 'Professionals' },
  { id: 'tourists', label: 'Tourists' },
  { id: 'seniors', label: 'Seniors' },
];

// Pricing plans
const PRICING = {
  standard: {
    weekly: 'R199',
    monthly: 'R699',
    weeklyValue: 199,
    monthlyValue: 699,
  },
  premium: {
    weekly: 'R499',
    monthly: 'R1699',
    weeklyValue: 499,
    monthlyValue: 1699,
  },
};

export function DealForm({ merchantId, merchantName, onSubmit, onCancel }: DealFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [isPremiumAd, setIsPremiumAd] = useState(false);
  const [pricingPlan, setPricingPlan] = useState<'weekly' | 'monthly'>('weekly');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  
  // Initialize the form with default values
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      location: merchantName,
      discount: '',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      startDate: new Date(),
      mediaType: 'image',
      mediaUrl: '',
      isPremium: false,
      pricingPlan: 'weekly',
      terms: false,
      targetAudience: [],
    },
  });

  // Calculate the total price based on the selected options
  const calculatePrice = () => {
    if (isPremiumAd) {
      return pricingPlan === 'weekly' 
        ? PRICING.premium.weeklyValue 
        : PRICING.premium.monthlyValue;
    } else {
      return pricingPlan === 'weekly' 
        ? PRICING.standard.weeklyValue 
        : PRICING.standard.monthlyValue;
    }
  };

  // Handle media selection from the MediaUploader component
  const handleMediaSelected = (url: string, type: 'image' | 'video') => {
    form.setValue('mediaUrl', url);
    form.setValue('mediaType', type);
    setMediaPreview(url);
  };

  // Handle premium toggle
  const handlePremiumToggle = (checked: boolean) => {
    setIsPremiumAd(checked);
    form.setValue('isPremium', checked);
  };

  // Handle pricing plan change
  const handlePricingPlanChange = (value: 'weekly' | 'monthly') => {
    setPricingPlan(value);
    form.setValue('pricingPlan', value);
  };

  // Handle form submission
  const onFormSubmit = (values: DealFormValues) => {
    // Check if media is provided
    if (!values.mediaUrl) {
      toast.error('Please upload an image or video for your deal');
      setActiveTab('media');
      return;
    }

    // Submit the form
    onSubmit(values);
  };

  // Get the price display based on current selections
  const getPriceDisplay = () => {
    const price = isPremiumAd 
      ? (pricingPlan === 'weekly' ? PRICING.premium.weekly : PRICING.premium.monthly)
      : (pricingPlan === 'weekly' ? PRICING.standard.weekly : PRICING.standard.monthly);
    
    return price;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Deal</CardTitle>
        <CardDescription>
          Fill out the details below to create a new deal for your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="promotion">Promotion</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 20% Off All Products" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Create a catchy, clear title that describes your offer
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide details about your deal" 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your deal in detail, including any terms or conditions
                      </FormDescription>
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
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem 
                                key={category.value} 
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 20% Off, Buy 1 Get 1 Free" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal flex justify-between items-center"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiresAt"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiration Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal flex justify-between items-center"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex gap-2">
                        <FormControl>
                          <Input 
                            placeholder="Enter your business location" 
                            {...field} 
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline"
                          className="shrink-0"
                          onClick={() => {
                            // In a real implementation, this would open a map picker
                            toast.info('Location picker would open here');
                          }}
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>
                        Enter the location where this deal is valid
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Target Audience (Optional)</FormLabel>
                        <FormDescription>
                          Select the audience segments this deal is most relevant for
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {AUDIENCE_OPTIONS.map((option) => (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentValue, option.id]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter((value) => value !== option.id)
                                    );
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option.label}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('media')}
                  >
                    Next: Add Media
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-4">
                <FormField
                  control={form.control}
                  name="mediaType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="image" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Image className="h-4 w-4 mr-2" /> Image
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="video" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <Video className="h-4 w-4 mr-2" /> Video
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Choose whether to upload an image or video for your deal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <Label>Upload Media</Label>
                  <MediaUploader
                    merchantId={merchantId}
                    itemType="deal"
                    onMediaSelected={handleMediaSelected}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: High-quality images or videos that clearly show your offer.
                    Max size: 10MB for images, 50MB for videos.
                  </p>
                </div>

                {mediaPreview && (
                  <div className="border rounded-md p-4">
                    <Label className="mb-2 block">Preview</Label>
                    {form.getValues('mediaType') === 'image' ? (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-full max-h-[200px] object-contain rounded-md"
                      />
                    ) : (
                      <video
                        src={mediaPreview}
                        controls
                        className="w-full max-h-[200px] rounded-md"
                      />
                    )}
                  </div>
                )}

                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Media Tips</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <ul className="list-disc pl-4 space-y-1 mt-2 text-sm">
                      <li>Use high-quality, well-lit images that clearly show your product or service</li>
                      <li>Keep videos short (30-60 seconds) and engaging</li>
                      <li>Include your branding and deal details in the media</li>
                      <li>Avoid text-heavy images as they may be difficult to read on mobile devices</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab('basic')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setActiveTab('promotion')}
                  >
                    Next: Promotion Options
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="promotion" className="space-y-4">
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Premium Advertising</h3>
                      <p className="text-sm text-gray-500">
                        Featured placement and more visibility
                      </p>
                    </div>
                    <Switch
                      checked={isPremiumAd}
                      onCheckedChange={handlePremiumToggle}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="bg-white p-4 rounded-md border mb-4">
                      <h4 className="font-medium text-lg mb-2">
                        {isPremiumAd ? 'Premium Benefits' : 'Standard Benefits'}
                      </h4>
                      {isPremiumAd ? (
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Featured placement on homepage and category pages
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Priority in search results
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Highlighted with premium badge
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Inclusion in promotional emails
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Enhanced analytics and reporting
                          </li>
                        </ul>
                      ) : (
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Standard listing in category pages
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Basic analytics
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                            Standard search visibility
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div 
                        className={`border rounded p-3 text-center cursor-pointer ${pricingPlan === 'weekly' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                        onClick={() => handlePricingPlanChange('weekly')}
                      >
                        <p className="font-medium">Weekly</p>
                        <p className="text-lg font-bold">
                          {isPremiumAd ? PRICING.premium.weekly : PRICING.standard.weekly}
                        </p>
                      </div>
                      <div 
                        className={`border rounded p-3 text-center cursor-pointer ${pricingPlan === 'monthly' ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                        onClick={() => handlePricingPlanChange('monthly')}
                      >
                        <p className="font-medium">Monthly</p>
                        <p className="text-lg font-bold">
                          {isPremiumAd ? PRICING.premium.monthly : PRICING.standard.monthly}
                        </p>
                        <p className="text-xs text-green-600">Best value</p>
                      </div>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                          I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a>
                        </FormLabel>
                        <FormDescription>
                          By creating this deal, you agree to our terms of service and content policies.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Alert variant={form.formState.isValid ? "default" : "destructive"} className="mt-4">
                  {form.formState.isValid ? (
                    <>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Ready to publish</AlertTitle>
                      <AlertDescription>
                        Your deal looks good! Review all details before proceeding to payment.
                      </AlertDescription>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Please complete all required fields</AlertTitle>
                      <AlertDescription>
                        There are some issues with your deal information. Please go back and fix them.
                      </AlertDescription>
                    </>
                  )}
                </Alert>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab('media')}
                  >
                    Back
                  </Button>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">
                      Total: {getPriceDisplay()}
                    </p>
                    <Button 
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={!form.formState.isValid}
                    >
                      <CreditCard className="h-4 w-4" /> Continue to Payment
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={() => form.handleSubmit(onFormSubmit)()}
          disabled={!form.formState.isValid}
        >
          Save Deal
        </Button>
      </CardFooter>
    </Card>
  );
}
