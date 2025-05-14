import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/ui/video-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

/**
 * Component showcasing different video advertisement placement mockups
 */
export function VideoAdMockups() {
  // Sample video URLs (replace with actual videos)
  const sampleVideoUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const samplePosterUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg';
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Video Advertisement Placement Mockups</h2>
      <p className="text-muted-foreground">
        Below are four different mockups for video advertisement placements within the CityPulse platform.
        Each mockup demonstrates a different approach to integrating video content while maintaining a
        seamless user experience.
      </p>
      
      <Tabs defaultValue="featured-banner">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="featured-banner">Featured Banner</TabsTrigger>
          <TabsTrigger value="inline-feed">Inline Feed</TabsTrigger>
          <TabsTrigger value="sidebar-widget">Sidebar Widget</TabsTrigger>
          <TabsTrigger value="modal-overlay">Modal Overlay</TabsTrigger>
        </TabsList>
        
        {/* Mockup 1: Featured Banner Video Ad */}
        <TabsContent value="featured-banner" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Featured Banner Video Ad</CardTitle>
                  <CardDescription>
                    Prominent placement at the top of the homepage or category pages
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  Premium Placement
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="w-full">
                  <VideoPlayer
                    src={sampleVideoUrl}
                    poster={samplePosterUrl}
                    title="Summer Fashion Collection"
                    aspectRatio="21/9"
                    actionButton={{
                      text: "Shop Now",
                      url: "#",
                      className: "bg-blue-600 hover:bg-blue-700"
                    }}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specifications</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Dimensions: 1920×810px (21:9 aspect ratio)</li>
                      <li>Maximum duration: 30 seconds</li>
                      <li>File format: MP4, WebM</li>
                      <li>Maximum file size: 15MB</li>
                      <li>Autoplay: Optional (sound off)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Include clear call-to-action</li>
                      <li>Design for sound-off viewing</li>
                      <li>Front-load key messaging in first 5 seconds</li>
                      <li>Include brand elements throughout</li>
                      <li>Optimize for mobile viewing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Mockup 2: Inline Feed Video Ad */}
        <TabsContent value="inline-feed" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Inline Feed Video Ad</CardTitle>
                  <CardDescription>
                    Seamlessly integrated within content feeds
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                  High Engagement
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      CP
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Featured Deal</p>
                      <p className="text-xs text-muted-foreground">Sponsored</p>
                    </div>
                  </div>
                  
                  <div className="w-full mb-4">
                    <VideoPlayer
                      src={sampleVideoUrl}
                      poster={samplePosterUrl}
                      title="New Restaurant Opening"
                      aspectRatio="16/9"
                      actionButton={{
                        text: "Book Now",
                        url: "#",
                        className: "bg-green-600 hover:bg-green-700"
                      }}
                    />
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Grand Opening: The Urban Kitchen</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Experience the finest dining in town with our special opening week offers.
                    Book now and get 20% off your first meal!
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">Learn More</Button>
                    <div className="text-xs text-muted-foreground">Sponsored</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specifications</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Dimensions: 1280×720px (16:9 aspect ratio)</li>
                      <li>Maximum duration: 60 seconds</li>
                      <li>File format: MP4, WebM</li>
                      <li>Maximum file size: 20MB</li>
                      <li>Autoplay: On scroll (sound off)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Match the look and feel of organic content</li>
                      <li>Include engaging thumbnail image</li>
                      <li>Keep messaging concise and focused</li>
                      <li>Include clear branding</li>
                      <li>Provide valuable information to users</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Mockup 3: Sidebar Widget Video Ad */}
        <TabsContent value="sidebar-widget" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Sidebar Widget Video Ad</CardTitle>
                  <CardDescription>
                    Compact video ad that sits in the sidebar
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                  Always Visible
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-gray-100 rounded-lg p-4">
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      Main Content Area
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="border rounded-lg p-3 bg-white shadow-sm">
                      <p className="text-xs text-muted-foreground mb-2">Sponsored</p>
                      <VideoPlayer
                        src={sampleVideoUrl}
                        poster={samplePosterUrl}
                        aspectRatio="square"
                        controls={false}
                      />
                      <h4 className="text-sm font-medium mt-3 mb-1">Weekend Getaway Deals</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Escape the city this weekend with special hotel packages
                      </p>
                      <Button size="sm" className="w-full">View Offers</Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specifications</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Dimensions: 300×300px (1:1 aspect ratio)</li>
                      <li>Maximum duration: 15 seconds</li>
                      <li>File format: MP4, WebM</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Autoplay: On hover (sound off)</li>
                      <li>Loop: Enabled</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Keep content simple and focused</li>
                      <li>Use bold, eye-catching visuals</li>
                      <li>Design for small viewport</li>
                      <li>Include minimal, impactful text</li>
                      <li>Ensure high contrast for readability</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Mockup 4: Modal Overlay Video Ad */}
        <TabsContent value="modal-overlay" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Modal Overlay Video Ad</CardTitle>
                  <CardDescription>
                    Full-attention video ad that appears at key moments
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                  High Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative border-4 border-gray-200 rounded-lg p-8 bg-gray-100">
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-full max-w-2xl p-4">
                      <div className="bg-white rounded-lg overflow-hidden shadow-xl">
                        <div className="flex justify-between items-center p-3 border-b">
                          <h4 className="font-medium">Featured Promotion</h4>
                          <Button variant="ghost" size="sm">✕</Button>
                        </div>
                        <div className="p-4">
                          <VideoPlayer
                            src={sampleVideoUrl}
                            poster={samplePosterUrl}
                            title="Limited Time Offer"
                            aspectRatio="16/9"
                            autoPlay={true}
                          />
                          <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline">Skip</Button>
                            <Button>Learn More</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    Background Content (Dimmed)
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specifications</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Dimensions: 1280×720px (16:9 aspect ratio)</li>
                      <li>Maximum duration: 30 seconds</li>
                      <li>File format: MP4, WebM</li>
                      <li>Maximum file size: 15MB</li>
                      <li>Autoplay: Yes (sound on optional)</li>
                      <li>Skippable: After 5 seconds</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Best Practices</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Create compelling first 5 seconds</li>
                      <li>Include clear call-to-action</li>
                      <li>Keep messaging concise</li>
                      <li>Respect user attention</li>
                      <li>Limit frequency (max 1 per session)</li>
                      <li>Target based on user behavior</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default VideoAdMockups;
