import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  Heart, 
  Search, 
  MoreHorizontal, 
  Share2, 
  Bookmark, 
  Star, 
  ChevronLeft,
  ArrowRight,
  Filter,
  ArrowLeft,
  MessageCircle,
  Eye,
  Send,
  Loader2,
  X as XIcon
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WishlistItem {
  id: string;
  name: string;
  price: string;
  rating: number;
  image: string;
  category: string;
  type: 'saved' | 'liked' | 'shared';
  businessName?: string;
  description?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

const INITIAL_WISHLIST_ITEMS: WishlistItem[] = [
  {
    id: "1",
    name: "Ichiraku Ramen",
    price: "$ 15.00",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    category: "Ramen",
    type: 'saved',
    businessName: "Ichiraku Noodle Bar",
    description: "The most authentic ramen in the village. Made with secret broth recipe passed down through generations.",
    likes: 124,
    comments: 45,
    shares: 89
  },
  {
    id: "2",
    name: "Philadelphia roll",
    price: "$ 9.50",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400",
    category: "Sushi",
    type: 'liked',
    businessName: "Sushi Zen",
    description: "Fresh Atlantic salmon paired with creamy Philadelphia cheese and crisp cucumber.",
    likes: 245,
    comments: 89,
    shares: 112
  },
  {
    id: "3",
    name: "Salmon sushi",
    price: "$ 7.00",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400",
    category: "Sushi",
    type: 'shared',
    businessName: "Maki House",
    description: "Pure, melt-in-your-mouth salmon over perfectly seasoned vinegared rice.",
    likes: 312,
    comments: 124,
    shares: 45
  },
  {
    id: "4",
    name: "Miso soup",
    price: "$ 4.50",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
    category: "Rolls",
    type: 'saved',
    businessName: "Zen Garden",
    description: "Warm, comforting miso broth with silky tofu and green onions.",
    likes: 89,
    comments: 23,
    shares: 12
  },
  {
    id: "5",
    name: "Dragon Roll",
    price: "$ 12.00",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400",
    category: "Rolls",
    type: 'liked',
    businessName: "Sushi Master",
    description: "Eel and cucumber inside, topped with avocado and sweet eel sauce.",
    likes: 178,
    comments: 56,
    shares: 34
  },
  {
    id: "6",
    name: "Tempura Shrimp",
    price: "$ 8.50",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1562158074-904321035c8e?w=400",
    category: "Apps",
    type: 'shared',
    businessName: "Crispy Corner",
    description: "Light and airy tempura batter-fried jumbo shrimp.",
    likes: 156,
    comments: 34,
    shares: 78
  }
];

export default function Wishlist() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [items, setItems] = useState<WishlistItem[]>(INITIAL_WISHLIST_ITEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null);
  const [activeAd, setActiveAd] = useState(0);
  const observerTarget = useRef(null);

  // Auto-slide for ads carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAd((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const filteredItems = activeTab === "all" 
    ? items 
    : items.filter(item => {
        if (activeTab === "saved") return item.type === 'saved';
        if (activeTab === "liked") return item.type === 'liked';
        if (activeTab === "shared") return item.type === 'shared';
        return true;
      });

  const loadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const newItems = INITIAL_WISHLIST_ITEMS.map(item => ({
        ...item,
        id: `${item.id}-${Date.now()}`
      }));
      setItems(prev => [...prev, ...newItems]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, isLoading]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - Matching Screenshot Layout */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/feed">
                <Button size="icon" variant="ghost" className="rounded-full bg-secondary/50">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Location</p>
                <h1 className="text-sm font-bold flex items-center gap-1">
                  New York <ArrowRight size={12} className="text-primary" />
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <Button size="icon" variant="ghost" className="rounded-full bg-secondary/50">
                 <Search size={20} />
               </Button>
               <div className="w-10 h-10 rounded-full border-2 border-primary/20 overflow-hidden shadow-lg p-0.5">
                 <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100" className="w-full h-full rounded-full object-cover" />
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold font-display tracking-tight">Wishlist</h2>
              <p className="text-muted-foreground text-sm">Everything you've saved & loved</p>
            </div>
            <Button variant="ghost" className="text-primary font-bold hover:bg-transparent">view all</Button>
          </div>

          {/* Categories / Filter from Screenshot */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            <Button 
              variant={activeTab === 'all' ? 'default' : 'secondary'} 
              className={cn("rounded-2xl h-12 px-6 gap-2 shrink-0", activeTab === 'all' ? "shadow-lg shadow-primary/20" : "")}
              onClick={() => setActiveTab('all')}
            >
              <Filter size={18} />
              <span className="font-bold">All Items</span>
            </Button>
            <Button 
              variant={activeTab === 'saved' ? 'default' : 'secondary'} 
              className={cn("rounded-2xl h-12 px-6 gap-2 shrink-0", activeTab === 'saved' ? "shadow-lg shadow-primary/20" : "")}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark size={18} />
              <span className="font-bold">Saved</span>
            </Button>
            <Button 
              variant={activeTab === 'liked' ? 'default' : 'secondary'} 
              className={cn("rounded-2xl h-12 px-6 gap-2 shrink-0", activeTab === 'liked' ? "shadow-lg shadow-primary/20" : "")}
              onClick={() => setActiveTab('liked')}
            >
              <Heart size={18} />
              <span className="font-bold">Liked</span>
            </Button>
            <Button 
              variant={activeTab === 'shared' ? 'default' : 'secondary'} 
              className={cn("rounded-2xl h-12 px-6 gap-2 shrink-0", activeTab === 'shared' ? "shadow-lg shadow-primary/20" : "")}
              onClick={() => setActiveTab('shared')}
            >
              <Share2 size={18} />
              <span className="font-bold">Shared</span>
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-6">

        {/* Ads Carousel */}
        <div className="mb-8 relative overflow-hidden rounded-[32px] h-44 sm:h-56">
          <Tabs defaultValue="ad-0" className="w-full h-full">
            <div className="relative w-full h-full">
              {[
                {
                  title: "Discount 50%",
                  desc: "Special offer for you",
                  image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800",
                  color: "from-black/80"
                },
                {
                  title: "New Arrival",
                  desc: "Check our latest collection",
                  image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
                  color: "from-blue-900/80"
                },
                {
                  title: "Weekend Deal",
                  desc: "Only available this week",
                  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
                  color: "from-emerald-900/80"
                }
              ].map((ad, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-1000",
                    activeAd === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                  )}
                >
                  <img 
                    src={ad.image} 
                    className="absolute inset-0 w-full h-full object-cover opacity-60" 
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-r to-transparent flex flex-col justify-center p-8", ad.color)}>
                    <h3 className="text-3xl font-bold text-white mb-2">{ad.title}</h3>
                    <p className="text-white/60 text-sm font-medium mb-4">{ad.desc}</p>
                    <Button className="w-fit rounded-xl px-6 font-bold" size="sm">Get Deal</Button>
                  </div>
                </div>
              ))}
              
              {/* Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      activeAd === i ? "bg-white w-4" : "bg-white/30"
                    )}
                  />
                ))}
              </div>
            </div>
          </Tabs>
        </div>

        {/* Wishlist Grid - Matching Screenshot style */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedItem(item)}
              >
                <Card className="border-none bg-secondary/20 rounded-[32px] overflow-hidden group hover-elevate transition-all duration-300 cursor-pointer">
                  <div className="relative aspect-square">
                    <img 
                      src={item.image} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={item.name}
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="absolute top-4 left-4 rounded-full bg-background/40 backdrop-blur-md text-foreground h-9 w-9 no-default-hover-elevate"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Heart size={18} className={item.type === 'liked' ? "fill-red-500 text-red-500" : ""} />
                    </Button>
                    {item.type === 'saved' && (
                      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary">
                        <Bookmark size={16} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h4 className="font-bold text-base sm:text-lg mb-1 truncate">{item.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-primary font-black text-sm sm:text-base">{item.price}</span>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold">{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="py-12 flex justify-center w-full">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-2"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Loading magic...</p>
            </motion.div>
          )}
        </div>

        {filteredItems.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Heart size={32} className="text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground max-w-xs">Items you like, save or share will appear here for easy reference.</p>
            <Link href="/feed">
              <Button className="mt-6 rounded-2xl px-8 font-bold">Explore Items</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Post Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[32px] border-none bg-background/95 backdrop-blur-xl">
          {selectedItem && (
            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Media Section */}
              <div className="relative w-full md:w-[60%] bg-black flex items-center justify-center group h-[400px] md:h-auto">
                <img 
                  src={selectedItem.image} 
                  className="w-full h-full object-cover" 
                  alt={selectedItem.name}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="rounded-full bg-black/50 backdrop-blur-md border-none px-3 py-1 text-white flex items-center gap-1">
                    <Star size={12} className="fill-yellow-500 text-yellow-500" />
                    {selectedItem.rating.toFixed(1)}
                  </Badge>
                  <Badge className="rounded-full bg-primary text-white border-none px-3 py-1">
                    {selectedItem.category}
                  </Badge>
                </div>
              </div>

              {/* Interaction Section */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="p-6 border-b border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                        {selectedItem.businessName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{selectedItem.businessName}</h3>
                        <p className="text-xs text-muted-foreground">Premium Partner</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)} className="rounded-full">
                      <XIcon size={20} />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{selectedItem.name}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {selectedItem.description}
                  </p>
                  <div className="text-2xl font-black text-primary mb-4">{selectedItem.price}</div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-around p-4 border-b border-border/50 bg-secondary/20">
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-red-500/10 transition-colors">
                      <Heart size={20} className={selectedItem.type === 'liked' ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{selectedItem.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                      <MessageCircle size={20} className="text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{selectedItem.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-colors">
                      <Share2 size={20} className="text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{selectedItem.shares}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
                      <Bookmark size={20} className={selectedItem.type === 'saved' ? "fill-primary text-primary" : "text-muted-foreground"} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">SAVE</span>
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="p-6 mt-auto">
                  <div className="flex gap-2">
                    <Button className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">Order Now</Button>
                    <Button variant="secondary" size="icon" className="rounded-2xl h-12 w-12">
                      <Send size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
