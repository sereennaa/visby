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
      if (__DEV__) console.error('Error getting location:', error);
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
      if (__DEV__) console.error('Reverse geocoding error:', error);
      return null;
    }
  },

};

export default locationService;
