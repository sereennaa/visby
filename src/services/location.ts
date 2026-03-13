// Location Service - GPS and reverse geocoding
// Uses expo-location (FREE) and free Nominatim API for geocoding
import * as Location from 'expo-location';
import { LocationData } from '../types';

// Nominatim is OpenStreetMap's FREE geocoding service
// Rate limit: 1 request per second (be nice!)
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

export const locationService = {
  // Request location permissions
  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  },

  // Get current location
  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Get city/country from coordinates using free Nominatim
      const geoData = await this.reverseGeocode(latitude, longitude);

      return {
        latitude,
        longitude,
        city: geoData?.city,
        country: geoData?.country,
        countryCode: geoData?.countryCode,
        accuracy: location.coords.accuracy || undefined,
      };
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  // Reverse geocode using FREE Nominatim (OpenStreetMap)
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{ city?: string; country?: string; countryCode?: string } | null> {
    try {
      const response = await fetch(
        `${NOMINATIM_URL}?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'Visby-App/1.0', // Be polite to Nominatim
          },
        }
      );

      if (!response.ok) return null;

      const data = await response.json();
      const address = data.address;

      return {
        city:
          address?.city ||
          address?.town ||
          address?.village ||
          address?.municipality ||
          address?.county,
        country: address?.country,
        countryCode: address?.country_code?.toUpperCase(),
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  },

  // Watch location updates
  async watchLocation(
    callback: (location: LocationData) => void,
    options?: { distanceInterval?: number }
  ): Promise<Location.LocationSubscription | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      return await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: options?.distanceInterval || 100, // meters
        },
        async (location) => {
          const { latitude, longitude } = location.coords;
          const geoData = await this.reverseGeocode(latitude, longitude);

          callback({
            latitude,
            longitude,
            city: geoData?.city,
            country: geoData?.country,
            countryCode: geoData?.countryCode,
            accuracy: location.coords.accuracy || undefined,
          });
        }
      );
    } catch (error) {
      console.error('Watch location error:', error);
      return null;
    }
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },

  // Check if user is within range of a location
  isWithinRange(
    userLat: number,
    userLon: number,
    targetLat: number,
    targetLon: number,
    rangeMeters: number
  ): boolean {
    const distance = this.calculateDistance(userLat, userLon, targetLat, targetLon);
    return distance <= rangeMeters;
  },

  // Format distance for display
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  },
};

export default locationService;
