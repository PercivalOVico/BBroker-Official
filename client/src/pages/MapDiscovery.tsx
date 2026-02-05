import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Map as MapIcon, 
  Search, 
  Navigation, 
  Filter, 
  MapPin, 
  Star, 
  ChevronRight, 
  X,
  Compass,
  Target,
  Trophy,
  ArrowLeft,
  ChevronLeft,
  Phone,
  MessageSquare,
  Calendar,
  Share2,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface BusinessPin {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  distance: string;
  x: number; // Percent from left
  y: number; // Percent from top
  type: 'cafe' | 'store' | 'service' | 'event';
}

interface DiscoveryMission {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  total: number;
  reward: string;
}

const MOCK_PINS: BusinessPin[] = [
  { id: "1", name: "Artisan Coffee", category: "Cafe", type: 'cafe', image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200", rating: 4.8, reviews: 124, distance: "0.4 km", x: 45, y: 35 },
  { id: "2", name: "Style Hub", category: "Boutique", type: 'store', image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200", rating: 4.5, reviews: 89, distance: "1.2 km", x: 65, y: 55 },
  { id: "3", name: "Green Yoga", category: "Wellness", type: 'service', image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200", rating: 4.9, reviews: 210, distance: "0.8 km", x: 30, y: 65 },
  { id: "4", name: "Tech Meetup", category: "Event", type: 'event', image: "https://images.unsplash.com/photo-1540575861501-7ce0e22066c0?w=200", rating: 4.7, reviews: 56, distance: "2.5 km", x: 55, y: 75 },
];

const MOCK_MISSIONS: DiscoveryMission[] = [
  { id: "m1", title: "Caffeine Crawler", description: "Visit 3 local cafes this week", category: "Discovery", progress: 2, total: 3, reward: "Free Pastry" },
  { id: "m2", title: "Local Legend", description: "Review 5 neighborhood gems", category: "Community", progress: 3, total: 5, reward: "Gold Badge" },
];

export default function MapDiscovery() {
  const [selectedPin, setSelectedPin] = useState<BusinessPin | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'missions'>('map');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Cafe", "Boutique", "Wellness", "Event", "Restaurant"];

  const filteredPins = MOCK_PINS.filter(pin => {
    const matchesSearch = pin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         pin.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || pin.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Mobile Header - Hidden on Desktop */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/profile">
            <Button size="icon" variant="ghost" className="rounded-full">
              <ChevronLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-xl font-bold font-display tracking-tight">Discovery</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-secondary/50">
            <Search size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative pb-16 md:pb-0">
        {/* Sidebar - Visible on Desktop */}
        <div className="hidden md:flex w-96 border-r border-border/50 flex-col bg-card/50 backdrop-blur-sm p-6 overflow-y-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold font-display">Discovery</h1>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search local gems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-secondary/50 border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          
          {/* Desktop Category Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
            {categories.map(cat => (
              <Button 
                key={cat}
                variant={activeCategory === cat ? "default" : "secondary"} 
                size="sm" 
                className="rounded-full text-xs h-8 whitespace-nowrap"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Desktop Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
              Nearby
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
              Top Rated
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
              Open Now
            </Button>
          </div>

          {/* Business List Result */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Local Results</h2>
              <span className="text-xs text-muted-foreground">{filteredPins.length} found</span>
            </div>
            <div className="space-y-3">
              {filteredPins.map(pin => (
                <Card 
                  key={pin.id} 
                  className={cn(
                    "p-3 border-none bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer group",
                    selectedPin?.id === pin.id && "ring-2 ring-primary bg-secondary/60"
                  )}
                  onClick={() => setSelectedPin(pin)}
                >
                  <div className="flex gap-3">
                    <img src={pin.image} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm">{pin.name}</h4>
                        <Badge variant="outline" className="text-[10px] py-0">{pin.distance}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{pin.category}</p>
                      <div className="flex items-center gap-1 text-[10px]">
                        <Star size={10} className="fill-yellow-500 text-yellow-500" />
                        <span className="font-bold">{pin.rating}</span>
                        <span className="opacity-50">({pin.reviews})</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Main Map View */}
        <div className="flex-1 relative bg-[#f5f5f5] dark:bg-[#1a1a1a] overflow-hidden">
          {/* Location Controls */}
          <div className="absolute right-4 top-4 md:top-4 z-20 flex flex-col gap-2">
            <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur-md hover-elevate">
              <Compass size={18} />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full shadow-lg bg-background/80 backdrop-blur-md hover-elevate">
              <Navigation size={18} />
            </Button>
          </div>

          {/* Mobile Mission Floating Card - Screenshot 2 style */}
          <div className="absolute top-4 left-4 z-20 md:hidden">
            <Card className="p-3 bg-background/80 backdrop-blur-md border-none shadow-xl rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Target size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-tighter">Current Mission</p>
                <p className="text-xs font-bold truncate max-w-[120px]">Discover nearby gems</p>
              </div>
            </Card>
          </div>

          {/* Map Container - Simulated 3D Map */}
          <div className="absolute inset-0 bg-map-pattern opacity-10 pointer-events-none" />
          <div className="relative w-full h-full p-10 flex items-center justify-center">
            <div className="relative w-full h-full max-w-5xl max-h-[800px] rounded-[40px] overflow-hidden shadow-2xl bg-secondary/20">
               {/* 3D-ish Map Background */}
               <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
                  {/* Simulated Roads/Blocks */}
                  <div className="absolute top-1/4 left-0 w-full h-8 bg-background/50 rotate-[-15deg] blur-sm" />
                  <div className="absolute top-0 left-1/3 w-10 h-full bg-background/50 rotate-[10deg] blur-sm" />
               </div>

               {/* Map Pins */}
               {filteredPins.map(pin => (
                 <motion.div
                   key={pin.id}
                   initial={{ scale: 0, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   whileHover={{ scale: 1.1, zIndex: 50 }}
                   className="absolute cursor-pointer group"
                   style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                   onClick={() => setSelectedPin(pin)}
                 >
                   <div className="relative flex flex-col items-center">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl transition-all border-2 border-background overflow-hidden relative",
                        selectedPin?.id === pin.id ? "ring-4 ring-primary scale-110" : "bg-background"
                      )}>
                        <img src={pin.image} className="w-full h-full object-cover" />
                        {/* Distance overlay on pin */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px] text-[8px] text-white font-bold py-0.5 text-center">
                          {pin.distance}
                        </div>
                      </div>
                      {/* Label */}
                      <motion.div 
                        className="mt-2 bg-background/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5"
                      >
                        <span className="text-[10px] font-bold whitespace-nowrap">{pin.name}</span>
                        <div className="flex items-center gap-1">
                          <Star size={8} className="fill-yellow-500 text-yellow-500" />
                          <span className="text-[8px] font-bold">{pin.rating}</span>
                          <span className="text-[8px] text-muted-foreground">({pin.reviews})</span>
                        </div>
                      </motion.div>
                      {/* Pin tail */}
                      <div className="w-1 h-3 bg-background/80 mt-[-2px]" />
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Mobile Info Overlay / Selection Card */}
          <AnimatePresence>
            {selectedPin && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-8"
              >
                <Card className="max-w-2xl mx-auto overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="w-full sm:w-1/2 h-48 sm:h-auto overflow-hidden">
                      <img src={selectedPin.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary border-none">{selectedPin.category}</Badge>
                            <Badge variant="secondary" className="rounded-full bg-secondary text-muted-foreground border-none flex gap-1 items-center">
                              <Navigation size={10} />
                              {selectedPin.distance}
                            </Badge>
                          </div>
                          <h2 className="text-2xl font-bold">{selectedPin.name}</h2>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="fill-yellow-500 text-yellow-500" />
                              <span className="font-bold text-foreground">{selectedPin.rating}</span>
                            </div>
                            <span className="opacity-50">•</span>
                            <span className="font-medium underline">{selectedPin.reviews} reviews</span>
                            <span className="opacity-50">•</span>
                            <span className="text-green-600 font-medium">Open now</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPin(null)} className="rounded-full bg-secondary/50">
                          <X size={20} />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        Experience the best {selectedPin.category.toLowerCase()} in town. Handpicked services just for you.
                      </p>

                      <div className="flex items-center gap-4 mb-6">
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl bg-secondary/50 flex-1 gap-2">
                          <Phone size={14} />
                          <span>Call</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl bg-secondary/50 flex-1 gap-2">
                          <MessageSquare size={14} />
                          <span>Chat</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-10 rounded-xl bg-secondary/50 flex-1 gap-2">
                          <Calendar size={14} />
                          <span>Book</span>
                        </Button>
                      </div>

                      <div className="flex gap-3">
                        <Link href={`/business/${selectedPin.id}`} className="flex-1">
                          <Button className="w-full rounded-xl shadow-lg shadow-primary/20">
                            View Profile
                          </Button>
                        </Link>
                        <Button variant="secondary" className="rounded-xl px-8 flex gap-2">
                          <Navigation size={16} />
                          <span>Directions</span>
                        </Button>
                        <Button variant="secondary" size="icon" className="rounded-xl shrink-0">
                          <Heart size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Missions Toggle - Only on Mobile */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 md:hidden flex gap-2">
            <Button 
              className={cn(
                "rounded-full shadow-xl px-6 transition-all",
                activeTab === 'map' ? "bg-primary" : "bg-background/80 backdrop-blur-md text-foreground"
              )}
              onClick={() => setActiveTab('map')}
            >
              Map
            </Button>
            <Button 
              className={cn(
                "rounded-full shadow-xl px-6 transition-all",
                activeTab === 'missions' ? "bg-primary" : "bg-background/80 backdrop-blur-md text-foreground"
              )}
              onClick={() => setActiveTab('missions')}
            >
              Discover
            </Button>
          </div>

          {/* Mobile Missions Overlay - High Detail Screenshot Style */}
          <AnimatePresence>
            {activeTab === 'missions' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 z-30 bg-background md:hidden p-4 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6 pt-16">
                  <div>
                    <h2 className="text-3xl font-bold font-display tracking-tight">Discover</h2>
                    <p className="text-muted-foreground text-sm">Explore and earn rewards</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setActiveTab('map')} className="rounded-full bg-secondary">
                    <X size={24} />
                  </Button>
                </div>

                {/* Mission Tabs from Screenshot */}
                <div className="flex gap-2 mb-6">
                  <Button size="sm" className="rounded-xl px-4 bg-foreground text-background">Main</Button>
                  <Button size="sm" variant="secondary" className="rounded-xl px-4">Event</Button>
                  <Button size="sm" variant="secondary" className="rounded-xl px-4">Daily</Button>
                </div>

                <div className="space-y-4">
                  {MOCK_MISSIONS.map(mission => (
                    <Card key={mission.id} className="p-4 border-none bg-secondary/30 rounded-[28px] overflow-hidden group">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Compass size={20} />
                          </div>
                          <div>
                            <h3 className="text-base font-bold leading-tight">{mission.title}</h3>
                            <p className="text-xs text-muted-foreground">{mission.category}</p>
                          </div>
                        </div>
                        <Button size="icon" variant="ghost" className="rounded-full bg-background/50">
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-end">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Progress</p>
                          <p className="text-xs font-bold">{mission.progress}/{mission.total}</p>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(mission.progress / mission.total) * 100}%` }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-600">
                             <Trophy size={12} />
                           </div>
                           <span className="text-[10px] font-bold text-yellow-600 uppercase">{mission.reward}</span>
                        </div>
                        <Button size="sm" className="rounded-xl h-8 text-[10px] font-bold uppercase tracking-wider">Continue</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
