import React, { useState } from 'react';

interface EventProps {
  id: number;
  title: string;
  category: string;
  merchant: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  distance: number;
  featured: boolean;
}

const EventCard: React.FC<EventProps> = ({
  id,
  title,
  category,
  merchant,
  description,
  venue,
  date,
  time,
  distance,
  featured
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden event-card hover:shadow-lg transition-all duration-300">
      <div className="bg-purple-600 text-white p-2 text-sm">
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
        <div className="text-sm text-gray-700 mb-2">
          <div>{venue}</div>
          <div>{date} at {time}</div>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm text-gray-500">{distance} km</span>
          <button 
            className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            onClick={toggleExpand}
          >
            {expanded ? 'Hide Details' : 'View Event'}
          </button>
        </div>
        
        {expanded && (
          <div className="event-details mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-bold text-sm mb-2">Event Details</h4>
            <ul className="text-sm space-y-2">
              <li><span className="font-medium">Date:</span> {date}</li>
              <li><span className="font-medium">Time:</span> {time}</li>
              <li><span className="font-medium">Venue:</span> {venue}</li>
              <li><span className="font-medium">Organizer:</span> {merchant}</li>
              <li><span className="font-medium">Contact:</span> (012) 345-6789</li>
            </ul>
            <div className="mt-4">
              <h4 className="font-bold text-sm mb-2">Additional Information</h4>
              <p className="text-xs text-gray-600">
                Tickets available at the door. Seating is on a first-come, first-served basis.
                Please arrive 15 minutes early. No refunds or exchanges.
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <button className="text-purple-600 text-sm hover:underline flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Add to Calendar
              </button>
              <button className="text-purple-600 text-sm hover:underline flex items-center gap-1">
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

export default EventCard;
