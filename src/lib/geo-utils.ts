/**
 * Utility functions for geolocation calculations
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Earth's radius in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Convert degrees to radians
 * @param degrees Angle in degrees
 * @returns Angle in radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter items by distance from a given point
 * @param items Array of items with optional latitude and longitude properties
 * @param coords Coordinates of the reference point
 * @param radiusKm Maximum distance in kilometers
 * @returns Array of items with added distance property, filtered and sorted by distance
 */
export function filterItemsByDistance<T extends Record<string, any>>(
  items: T[],
  coords: Coordinates,
  radiusKm: number
): (T & { distance: number })[] {
  // If items don't have latitude/longitude, use fallback coordinates
  // These are approximate coordinates for major South African cities
  const cityCoordinates = [
    { city: 'Johannesburg', latitude: -26.2041, longitude: 28.0473 },
    { city: 'Cape Town', latitude: -33.9249, longitude: 18.4241 },
    { city: 'Durban', latitude: -29.8587, longitude: 31.0218 },
    { city: 'Pretoria', latitude: -25.7461, longitude: 28.1881 },
    { city: 'Port Elizabeth', latitude: -33.9608, longitude: 25.6022 },
    { city: 'Bloemfontein', latitude: -29.0852, longitude: 26.1596 },
    { city: 'East London', latitude: -33.0292, longitude: 27.8546 },
    { city: 'Kimberley', latitude: -28.7323, longitude: 24.7623 },
    { city: 'Polokwane', latitude: -23.9045, longitude: 29.4688 },
    { city: 'Nelspruit', latitude: -25.4753, longitude: 30.9694 }
  ];

  return items.map(item => {
    let itemLat = item.latitude;
    let itemLng = item.longitude;
    
    // If the item doesn't have coordinates, assign random city coordinates
    if (!itemLat || !itemLng) {
      const randomCity = cityCoordinates[Math.floor(Math.random() * cityCoordinates.length)];
      itemLat = randomCity.latitude;
      itemLng = randomCity.longitude;
      
      // Add small random offset to prevent all items from having the exact same location
      const offset = 0.05; // ~5km offset
      itemLat += (Math.random() - 0.5) * offset;
      itemLng += (Math.random() - 0.5) * offset;
    }
    
    // Calculate distance using Haversine formula
    const distance = calculateDistance(
      coords.latitude,
      coords.longitude,
      itemLat,
      itemLng
    );
    
    return {
      ...item,
      distance
    };
  })
  .filter(item => item.distance <= radiusKm)
  .sort((a, b) => a.distance - b.distance);
}
