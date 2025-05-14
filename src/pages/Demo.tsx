import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EnhancedImage } from '@/components/ui/enhanced-image';
import { VideoPlayer } from '@/components/ui/video-player';
import { ReactionButton } from '@/components/ui/reaction-button';
import { VideoAdMockups } from '@/components/ads/VideoAdMockups';
import { DealCard } from '@/components/cards/DealCard';
import { EventCard } from '@/components/cards/EventCard';

const Demo = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Sample data for demo
  const sampleDeal = {
    id: 1,
    title: "50% Off Weekend Special",
    description: "Enjoy our weekend special with 50% off on all menu items. Valid Saturday and Sunday only.",
    merchant_name: "Urban Cafe",
    category: "Food & Drink",
    expiration_date: "2025-06-30",
    discount: "50% OFF",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    featured: true
  };

  const sampleEvent = {
    id: 1,
    title: "Summer Music Festival",
    description: "Join us for a weekend of amazing music, food, and fun at the annual Summer Music Festival.",
    merchant_name: "City Events",
    category: "Entertainment",
    date: "2025-07-15",
    time: "12:00 PM - 10:00 PM",
    location: "Central Park",
    price: "R250",
    image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3",
    featured: true
  };

  // Sample video URL
  const sampleVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const samplePosterUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">CityPulse Demo Page</h1>
          
          <Tabs defaultValue="images">
            <TabsList className="mb-8">
              <TabsTrigger value="images">Enhanced Images</TabsTrigger>
              <TabsTrigger value="videos">Video Player</TabsTrigger>
              <TabsTrigger value="buttons">Check Button</TabsTrigger>
              <TabsTrigger value="mockups">Video Ad Mockups</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
            
            {/* Enhanced Images Demo */}
            <TabsContent value="images" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Image Component</CardTitle>
                  <CardDescription>
                    Demonstrates the enhanced image component with error handling, fallbacks, and loading states
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Working image */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Working Image</h3>
                      <EnhancedImage
                        src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                        alt="Working image example"
                        aspectRatio="video"
                        className="rounded-md"
                      />
                      <p className="text-sm text-muted-foreground">
                        Valid image URL with proper loading and display
                      </p>
                    </div>
                    
                    {/* Broken image with fallback */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Broken Image (with fallback)</h3>
                      <EnhancedImage
                        src="https://invalid-url-that-will-fail.jpg"
                        alt="Broken image example"
                        aspectRatio="video"
                        fallbackSrc="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                        className="rounded-md"
                      />
                      <p className="text-sm text-muted-foreground">
                        Invalid image URL that falls back to a valid placeholder
                      </p>
                    </div>
                    
                    {/* Different aspect ratios */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Square Aspect Ratio</h3>
                      <EnhancedImage
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                        alt="Square image example"
                        aspectRatio="square"
                        className="rounded-md"
                      />
                      <p className="text-sm text-muted-foreground">
                        Image with square (1:1) aspect ratio
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Video Player Demo */}
            <TabsContent value="videos" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Video Player Component</CardTitle>
                  <CardDescription>
                    Demonstrates the video player component with custom controls and responsive design
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic video player */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Basic Video Player</h3>
                      <VideoPlayer
                        src={sampleVideoUrl}
                        poster={samplePosterUrl}
                        title="Sample Video"
                      />
                      <p className="text-sm text-muted-foreground">
                        Standard video player with default controls
                      </p>
                    </div>
                    
                    {/* Video with action button */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Video with Action Button</h3>
                      <VideoPlayer
                        src={sampleVideoUrl}
                        poster={samplePosterUrl}
                        title="Promotional Video"
                        actionButton={{
                          text: "Learn More",
                          url: "#",
                          className: "bg-purple-600 hover:bg-purple-700"
                        }}
                      />
                      <p className="text-sm text-muted-foreground">
                        Video player with call-to-action button
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Check Button Demo */}
            <TabsContent value="buttons" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Check Button</CardTitle>
                  <CardDescription>
                    Demonstrates the redesigned check/like button with animations and color transitions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Default check button */}
                    <div className="space-y-4 flex flex-col items-center">
                      <h3 className="font-medium">Default Style</h3>
                      <ReactionButton
                        itemId={1}
                        itemType="deal"
                        showCount={true}
                        iconType="check"
                      />
                      <p className="text-sm text-muted-foreground text-center">
                        Standard check button with count
                      </p>
                    </div>
                    
                    {/* Large check button */}
                    <div className="space-y-4 flex flex-col items-center">
                      <h3 className="font-medium">Large Size</h3>
                      <ReactionButton
                        itemId={2}
                        itemType="event"
                        showCount={true}
                        size="lg"
                        buttonSize="lg"
                        iconType="check"
                      />
                      <p className="text-sm text-muted-foreground text-center">
                        Large check button with count
                      </p>
                    </div>
                    
                    {/* Thumbs up variant */}
                    <div className="space-y-4 flex flex-col items-center">
                      <h3 className="font-medium">Thumbs Up Variant</h3>
                      <ReactionButton
                        itemId={3}
                        itemType="deal"
                        showCount={true}
                        iconType="thumbsUp"
                      />
                      <p className="text-sm text-muted-foreground text-center">
                        Thumbs up button variant
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Video Ad Mockups */}
            <TabsContent value="mockups" className="space-y-8">
              <VideoAdMockups />
            </TabsContent>
            
            {/* Cards Demo */}
            <TabsContent value="cards" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Enhanced Cards</CardTitle>
                  <CardDescription>
                    Demonstrates the enhanced deal and event cards with improved image handling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deal card */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Deal Card</h3>
                      <DealCard
                        id={sampleDeal.id}
                        title={sampleDeal.title}
                        description={sampleDeal.description}
                        merchant_name={sampleDeal.merchant_name}
                        category={sampleDeal.category}
                        expiration_date={sampleDeal.expiration_date}
                        discount={sampleDeal.discount}
                        image_url={sampleDeal.image_url}
                        featured={sampleDeal.featured}
                      />
                    </div>
                    
                    {/* Event card */}
                    <div className="space-y-2">
                      <h3 className="font-medium">Event Card</h3>
                      <EventCard
                        id={sampleEvent.id}
                        title={sampleEvent.title}
                        description={sampleEvent.description}
                        merchant_name={sampleEvent.merchant_name}
                        category={sampleEvent.category}
                        date={sampleEvent.date}
                        time={sampleEvent.time}
                        location={sampleEvent.location}
                        price={sampleEvent.price}
                        image_url={sampleEvent.image_url}
                        featured={sampleEvent.featured}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Demo;
