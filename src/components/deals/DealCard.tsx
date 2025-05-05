import React, { useState, useEffect } from 'react';
import { toggleReaction, recordShare } from '@/lib/reaction-utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface DealProps {
  id: number;
  title: string;
  category: string;
  merchant: string;
  description: string;
  discount: string;
  expires: string;
  distance: number;
  featured: boolean;
}

const DealCard: React.FC<DealProps> = ({
  id,
  title,
  category,
  merchant,
  description,
  discount,
  expires,
  distance,
  featured
}) => {
  const [expanded, setExpanded] = useState(false);
  const [ticked, setTicked] = useState(false);
  const [tickCount, setTickCount] = useState(Math.floor(Math.random() * 50) + 5); // Initial placeholder count
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Check if the user has already ticked this deal
  useEffect(() => {
    const checkLocalReaction = () => {
      const storageKey = `reaction_deal_${id}`;
      const hasReacted = localStorage.getItem(storageKey) === 'true';
      setTicked(hasReacted);
    };

    checkLocalReaction();
  }, [id]);

  const handleToggleTick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await toggleReaction(id, 'deal', user?.id);
      setTicked(result.ticked);
      setTickCount(result.count);
    } catch (error) {
      console.error('Error toggling reaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    let shareUrl = '';
    const url = `${window.location.origin}/deals/${id}`;
    const text = `Check out this deal: ${title} - ${description}`;

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }

    // Record the share in the database
    await recordShare(id, 'deal', platform, user?.id);

    // Open the share URL in a new window
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden deal-card hover:shadow-lg transition-all duration-300">
      <div className="bg-blue-600 text-white p-2 text-sm">
        {category}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{merchant}</p>
        {featured && (
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
            Featured
          </span>
        )}
        <p className="text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-blue-600">{discount}</span>
          <span className="text-sm text-gray-500">Expires: {expires}</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">{distance} km</span>
          <button
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            onClick={toggleExpand}
          >
            {expanded ? 'Hide Details' : 'View Deal'}
          </button>
        </div>

        {expanded && (
          <div className="deal-details mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-sm mb-2">Deal Details</h4>
            <ul className="text-sm space-y-2">
              <li><span className="font-medium">Valid until:</span> {expires}</li>
              <li><span className="font-medium">Location:</span> 123 Main St, Pretoria</li>
              <li><span className="font-medium">Hours:</span> Mon-Fri: 9am-5pm, Sat-Sun: 10am-4pm</li>
              <li><span className="font-medium">Contact:</span> (012) 345-6789</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-bold text-sm mb-2">Terms & Conditions</h4>
              <p className="text-xs text-gray-600">
                Valid for one-time use only. Cannot be combined with other offers.
                No cash value. Subject to availability. See merchant for details.
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Deal saved!');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Save Deal
              </button>
              <div className="relative">
                <button
                  className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    const shareMenu = e.currentTarget.nextElementSibling;
                    if (shareMenu) {
                      shareMenu.classList.toggle('hidden');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>
                <div className="absolute right-0 bottom-8 bg-white shadow-lg rounded-md p-2 hidden z-10 w-36">
                  <div className="flex flex-col space-y-2">
                    <button
                      className="text-blue-600 text-sm hover:bg-blue-50 p-1 rounded flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('twitter');
                      }}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                      </svg>
                      X (Twitter)
                    </button>
                    <button
                      className="text-green-600 text-sm hover:bg-green-50 p-1 rounded flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('whatsapp');
                      }}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"></path>
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      className="text-blue-800 text-sm hover:bg-blue-50 p-1 rounded flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare('facebook');
                      }}
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tick reaction button */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    ticked ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  } transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                  onClick={handleToggleTick}
                  disabled={isLoading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={ticked ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${ticked ? 'scale-110' : 'scale-100'} transition-transform duration-200`}
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <span className="text-sm text-gray-500">{ticked ? tickCount + 1 : tickCount} ticks</span>
              </div>
              <span className="text-xs text-gray-400">Updated 2 days ago</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;
