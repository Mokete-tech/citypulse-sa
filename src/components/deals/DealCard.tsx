import React, { useState } from 'react';

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
              <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Save Deal
              </button>
              <button className="text-blue-600 text-sm hover:underline flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealCard;
