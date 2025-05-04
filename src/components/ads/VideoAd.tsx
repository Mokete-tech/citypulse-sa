import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX, Maximize2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface VideoAdProps {
  adId?: string;
  placement?: 'feed' | 'sidebar' | 'detail' | 'popup';
  autoplay?: boolean;
  onClose?: () => void;
  className?: string;
}

const VideoAd = ({ 
  adId, 
  placement = 'feed', 
  autoplay = false, 
  onClose, 
  className = '' 
}: VideoAdProps) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adData, setAdData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Fetch ad data from Supabase
  useEffect(() => {
    const fetchAdData = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase.from('video_ads').select('*');
        
        // If adId is provided, fetch that specific ad
        if (adId) {
          query = query.eq('id', adId);
        } else {
          // Otherwise, fetch a random ad that matches the placement
          query = query
            .eq('placement', placement)
            .eq('active', true)
            .order('last_shown', { ascending: true })
            .limit(1);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setAdData(data[0]);
          
          // Update the last_shown timestamp
          await supabase
            .from('video_ads')
            .update({ last_shown: new Date().toISOString() })
            .eq('id', data[0].id);
            
          // Track impression
          await supabase.from('ad_analytics').insert({
            ad_id: data[0].id,
            event_type: 'impression',
            placement,
            metadata: {
              url: window.location.href,
              timestamp: new Date().toISOString()
            }
          });
        } else {
          // If no ads are found, use a fallback
          setAdData({
            id: 'fallback',
            title: 'Advertise with CityPulse',
            description: 'Reach thousands of local customers with video ads on CityPulse',
            video_url: 'https://storage.googleapis.com/citypulse-assets/ads/citypulse-ad-fallback.mp4',
            thumbnail_url: 'https://storage.googleapis.com/citypulse-assets/ads/citypulse-ad-fallback.jpg',
            cta_text: 'Learn More',
            cta_url: '/merchant/packages',
            advertiser_name: 'CityPulse',
            advertiser_logo: '/logo.svg'
          });
        }
      } catch (err) {
        console.error('Error fetching ad data:', err);
        setError('Failed to load advertisement');
        
        // Use fallback ad
        setAdData({
          id: 'fallback',
          title: 'Advertise with CityPulse',
          description: 'Reach thousands of local customers with video ads on CityPulse',
          video_url: 'https://storage.googleapis.com/citypulse-assets/ads/citypulse-ad-fallback.mp4',
          thumbnail_url: 'https://storage.googleapis.com/citypulse-assets/ads/citypulse-ad-fallback.jpg',
          cta_text: 'Learn More',
          cta_url: '/merchant/packages',
          advertiser_name: 'CityPulse',
          advertiser_logo: '/logo.svg'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdData();
  }, [adId, placement]);
  
  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };
  
  // Track when fullscreen is exited using the Fullscreen API
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Track ad click
  const handleAdClick = async () => {
    if (adData && adData.id !== 'fallback') {
      try {
        await supabase.from('ad_analytics').insert({
          ad_id: adData.id,
          event_type: 'click',
          placement,
          metadata: {
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        });
      } catch (err) {
        console.error('Error tracking ad click:', err);
      }
    }
    
    // Open the CTA URL
    if (adData && adData.cta_url) {
      window.open(adData.cta_url, '_blank');
    }
  };
  
  // Track video completion
  const handleVideoEnded = async () => {
    setIsPlaying(false);
    
    if (adData && adData.id !== 'fallback') {
      try {
        await supabase.from('ad_analytics').insert({
          ad_id: adData.id,
          event_type: 'completion',
          placement,
          metadata: {
            url: window.location.href,
            timestamp: new Date().toISOString()
          }
        });
      } catch (err) {
        console.error('Error tracking ad completion:', err);
      }
    }
  };
  
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <div className="aspect-video bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400">Loading advertisement...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error || !adData) {
    return null; // Don't show anything if there's an error
  }
  
  return (
    <Card className={`overflow-hidden relative ${className}`}>
      <CardContent className="p-0">
        {/* Video Player */}
        <div 
          className="relative aspect-video cursor-pointer" 
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={adData.video_url}
            poster={adData.thumbnail_url}
            className="w-full h-full object-cover"
            muted={isMuted}
            autoPlay={autoplay}
            playsInline
            onEnded={handleVideoEnded}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Play/Pause Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </div>
          )}
          
          {/* Ad Label */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            Ad
          </div>
          
          {/* Controls */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              
              {onClose && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full bg-black bg-opacity-60 text-white hover:bg-opacity-80"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Ad Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{adData.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{adData.description}</p>
            </div>
            
            {adData.advertiser_logo && (
              <img 
                src={adData.advertiser_logo} 
                alt={adData.advertiser_name} 
                className="h-8 w-8 object-contain"
              />
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {adData.advertiser_name ? `Ad by ${adData.advertiser_name}` : 'Sponsored'}
            </span>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-8"
              onClick={handleAdClick}
            >
              {adData.cta_text || 'Learn More'} <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoAd;
