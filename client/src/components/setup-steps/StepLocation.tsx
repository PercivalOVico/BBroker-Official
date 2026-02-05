import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Navigation, Link as LinkIcon } from 'lucide-react';
import type { BusinessSetupData } from '../BusinessSetupWizard';

interface StepLocationProps {
  formData: BusinessSetupData;
  updateFormData: (updates: Partial<BusinessSetupData>) => void;
}

export function StepLocation({ formData, updateFormData }: StepLocationProps) {
  const [manualAddress, setManualAddress] = useState('');
  const [googleMapsLink, setGoogleMapsLink] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Parse Google Maps link to extract coordinates
  const parseGoogleMapsLink = (link: string) => {
    try {
      // Example: https://maps.google.com/?q=37.7749,-122.4194
      // Or: https://www.google.com/maps/@37.7749,-122.4194,15z
      const coordPattern = /@?([-0-9.]+),([-0-9.]+)/;
      const qPattern = /q=([-0-9.]+),([-0-9.]+)/;
      
      let match = link.match(coordPattern) || link.match(qPattern);
      
      if (match && match[1] && match[2]) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          // Use reverse geocoding to get address
          reverseGeocode(lat, lng);
        }
      }
    } catch (error) {
      console.error('Error parsing Google Maps link:', error);
    }
  };

  // Get current location using browser's geolocation API
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please enter manually.');
        setIsGettingLocation(false);
      }
    );
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using a simple reverse geocoding service (you can replace with Google Maps API)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      updateFormData({
        location: {
          latitude: lat,
          longitude: lng,
          address: data.display_name || manualAddress,
          city: data.address?.city || data.address?.town || data.address?.village || '',
          state: data.address?.state || '',
          zip: data.address?.postcode || '',
          country: data.address?.country || '',
        },
      });
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback: just save coordinates
      updateFormData({
        location: {
          latitude: lat,
          longitude: lng,
          address: manualAddress || `${lat}, ${lng}`,
          city: '',
          state: '',
          zip: '',
          country: '',
        },
      });
    }
  };

  // Handle manual address entry
  const handleManualAddress = () => {
    if (!manualAddress.trim()) return;

    // In production, you'd use Google Geocoding API here
    // For now, we'll use a placeholder
    updateFormData({
      location: {
        latitude: 0, // Would come from geocoding
        longitude: 0, // Would come from geocoding
        address: manualAddress,
        city: '', // Would be parsed from geocoding result
        state: '',
        zip: '',
        country: '',
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <MapPin className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Where is your business located?</h3>
        <p className="text-sm text-muted-foreground">
          Help customers find you on the map
        </p>
      </div>

      {/* Location Input Methods */}
      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">
            <Navigation className="w-4 h-4 mr-2" />
            Current
          </TabsTrigger>
          <TabsTrigger value="link">
            <LinkIcon className="w-4 h-4 mr-2" />
            Maps Link
          </TabsTrigger>
          <TabsTrigger value="manual">
            <MapPin className="w-4 h-4 mr-2" />
            Manual
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Current Location */}
        <TabsContent value="current" className="space-y-4">
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Use your device's GPS to automatically detect your location
            </p>
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              size="lg"
              className="w-full max-w-xs"
            >
              {isGettingLocation ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Getting Location...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Use Current Location
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Tab 2: Google Maps Link */}
        <TabsContent value="link" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapsLink">Paste Google Maps Link</Label>
            <Input
              id="mapsLink"
              type="text"
              placeholder="https://maps.google.com/?q=..."
              value={googleMapsLink}
              onChange={(e) => setGoogleMapsLink(e.target.value)}
            />
            <Button
              onClick={() => parseGoogleMapsLink(googleMapsLink)}
              disabled={!googleMapsLink.trim()}
              variant="outline"
              className="w-full"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Import from Link
            </Button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
              💡 How to get a Google Maps link:
            </p>
            <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
              <li>Open Google Maps in your browser</li>
              <li>Search for your business location</li>
              <li>Right-click on the pin and select "Share"</li>
              <li>Copy the link and paste it here</li>
            </ol>
          </div>
        </TabsContent>

        {/* Tab 3: Manual Entry */}
        <TabsContent value="manual" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manualAddress">Full Address</Label>
            <Input
              id="manualAddress"
              type="text"
              placeholder="123 Main St, San Francisco, CA 94102"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
            />
            <Button
              onClick={handleManualAddress}
              disabled={!manualAddress.trim()}
              variant="outline"
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Set Address
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Note: For best results, include street address, city, state, and ZIP code
          </p>
        </TabsContent>
      </Tabs>

      {/* Current Location Display */}
      {formData.location && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-600 dark:text-green-400 mb-1">
                ✓ Location Set
              </p>
              <p className="text-sm text-muted-foreground break-words">
                {formData.location.address}
              </p>
              {formData.location.city && (
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.location.city}
                  {formData.location.state && `, ${formData.location.state}`}
                  {formData.location.zip && ` ${formData.location.zip}`}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {formData.location.latitude.toFixed(6)},{' '}
                {formData.location.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Preview Placeholder */}
      {formData.location && (
        <div className="aspect-video bg-secondary rounded-lg overflow-hidden border border-border">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Map preview would appear here</p>
              <p className="text-xs mt-1">(Google Maps integration in production)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
