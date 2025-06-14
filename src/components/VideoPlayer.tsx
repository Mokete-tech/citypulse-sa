
import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  title: string;
  description?: string;
}

const VideoPlayer = ({ title, description }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="aspect-video bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 flex items-center justify-center relative">
          {/* Video Background with South African City Scenes */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/80 to-purple-800/80">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580417722280-2b2da3e90c7f?w=1200&h=675&fit=crop')] bg-cover bg-center opacity-30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
          </div>
          
          {/* Demo Content Overlay */}
          <div className="relative z-10 text-center text-white px-8">
            <div className="mb-6">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">CityPulse in Action</h3>
              <p className="text-blue-200 text-lg">See how South Africans discover amazing deals and events</p>
            </div>
            
            {/* Mock App Interface */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">CP</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">Sarah from Cape Town</div>
                    <div className="text-xs text-blue-200">Found 5 deals today</div>
                  </div>
                </div>
                <div className="text-green-400 font-bold">R2,450 saved</div>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white/20 rounded p-2 text-left">
                  <div className="text-sm font-medium">50% Off Waterfront Restaurant</div>
                  <div className="text-xs text-blue-200">V&A Waterfront • Expires in 2 hours</div>
                </div>
                <div className="bg-white/20 rounded p-2 text-left">
                  <div className="text-sm font-medium">Free Wine Tasting Event</div>
                  <div className="text-xs text-blue-200">Stellenbosch • This Weekend</div>
                </div>
              </div>
            </div>
            
            {/* Play Button */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                size="lg"
                onClick={handlePlayPause}
                className="bg-white/20 hover:bg-white/30 border-2 border-white backdrop-blur-sm"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 mr-2" />
                ) : (
                  <Play className="w-8 h-8 mr-2" />
                )}
                {isPlaying ? 'Pause Demo' : 'Watch Demo'}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
            </div>
            
            {/* Demo Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">15k+</div>
                <div className="text-xs text-blue-200">Users in Cape Town</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">25k+</div>
                <div className="text-xs text-blue-200">Users in Johannesburg</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">500+</div>
                <div className="text-xs text-blue-200">Partner Businesses</div>
              </div>
            </div>
          </div>
          
          {/* Animated Elements */}
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div className="absolute top-8 right-8 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          )}
        </div>
        
        {/* Video Controls Bar */}
        <div className="bg-black/80 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="ghost"
              onClick={handlePlayPause}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="text-white text-sm">
              {isPlaying ? '1:24' : '0:00'} / 2:30
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
          <div 
            className={`h-full bg-blue-500 transition-all duration-1000 ${isPlaying ? 'w-1/2' : 'w-0'}`}
          ></div>
        </div>
      </div>
      
      {description && (
        <p className="text-center text-blue-100 mt-4 max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;
