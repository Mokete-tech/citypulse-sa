
import { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CityShowcaseProps {
  title: string;
  description?: string;
}

const CityShowcase = ({ title, description }: CityShowcaseProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const showcaseImages = [
    {
      url: 'https://images.unsplash.com/photo-1580417722280-2b2da3e90c7f?w=1200&h=675&fit=crop',
      title: 'Cape Town Waterfront',
      location: 'Cape Town',
      users: '15,000+ users',
      deals: '25 active deals'
    },
    {
      url: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1200&h=675&fit=crop',
      title: 'Johannesburg Skyline',
      location: 'Johannesburg',
      users: '25,000+ users',
      deals: '40 active deals'
    },
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=675&fit=crop',
      title: 'Durban Golden Mile',
      location: 'Durban',
      users: '8,000+ users',
      deals: '15 active deals'
    },
    {
      url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&h=675&fit=crop',
      title: 'Pretoria Government Buildings',
      location: 'Pretoria',
      users: '12,000+ users',
      deals: '20 active deals'
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % showcaseImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + showcaseImages.length) % showcaseImages.length);
  };

  const currentImage = showcaseImages[currentImageIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
        <div className="aspect-video relative">
          {/* Main Image */}
          <img
            src={currentImage.url}
            alt={currentImage.title}
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                <span className="text-blue-200 font-medium">{currentImage.location}</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-3">{currentImage.title}</h3>
              <p className="text-blue-100 text-lg mb-4">
                Discover amazing local deals and events in South Africa's most vibrant cities
              </p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  <span className="text-green-200 font-semibold">{currentImage.users}</span>
                </div>
                <div className="text-sm text-blue-200">Active Users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 mr-2 text-yellow-400" />
                  <span className="text-yellow-200 font-semibold">{currentImage.deals}</span>
                </div>
                <div className="text-sm text-blue-200">Available Deals</div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {showcaseImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-blue-400' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={prevImage}
                  className="text-white hover:bg-white/20 border border-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={nextImage}
                  className="text-white hover:bg-white/20 border border-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
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

export default CityShowcase;
