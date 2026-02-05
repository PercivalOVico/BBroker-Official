import { useRoute } from "wouter";
import { useBusiness } from "@/hooks/use-businesses";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Star, MessageCircle, Share2, Globe, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function BusinessDetail() {
  const [, params] = useRoute("/business/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: business, isLoading } = useBusiness(id);
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!business) {
    return <div className="pt-24 text-center">Business not found</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Back Button */}
      <button 
        onClick={() => setLocation("/feed")}
        className="fixed top-4 left-4 z-50 p-2 bg-background/50 backdrop-blur-md rounded-full shadow-sm hover:bg-background transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-muted">
        <img 
          src={business.imageUrl} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Content */}
      <div className="px-6 -mt-12 relative z-10 max-w-3xl mx-auto">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-card rounded-3xl shadow-xl p-6 border border-border/50"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold mb-1">{business.name}</h1>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {business.category}
              </span>
            </div>
            <div className="flex flex-col items-center bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-100">
              <div className="flex items-center text-yellow-500 font-bold text-lg">
                <Star className="fill-current w-5 h-5 mr-1" />
                {business.rating?.toFixed(1)}
              </div>
              <span className="text-[10px] text-yellow-700 uppercase font-bold tracking-wide">
                {business.reviewCount} Reviews
              </span>
            </div>
          </div>

          <div className="flex items-center text-muted-foreground mb-6 text-sm">
            <MapPin size={16} className="mr-2 text-primary" />
            {business.address}
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground mb-8">
            {business.description}
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20">
              <MessageCircle className="mr-2" />
              Message
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl text-lg font-semibold">
              <Globe className="mr-2" />
              Website
            </Button>
          </div>
        </motion.div>

        {/* Location Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Location</h3>
          <div className="h-48 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin size={32} className="mx-auto mb-2 opacity-50" />
              <p>Map View Placeholder</p>
              <p className="text-xs">Lat: {business.latitude}, Lng: {business.longitude}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
