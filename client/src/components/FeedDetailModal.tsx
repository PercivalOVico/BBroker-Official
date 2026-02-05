import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageCircle, Share2, Bookmark, UserPlus, Play, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import { CommentModal } from "./CommentModal";

interface FeedItem {
  id: number;
  type: "business" | "post" | "product" | "video";
  title: string;
  image: string;
  aspectRatio: number;
  likes?: number;
  rating?: number;
  reviews?: number;
  price?: string;
  category?: string;
}

interface FeedDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FeedItem | null;
}

export function FeedDetailModal({ isOpen, onClose, item }: FeedDetailModalProps) {
  const [similarItems, setSimilarItems] = useState<FeedItem[]>([]);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item) {
      // Mocking similar items based on type/category
      const mockSimilar: FeedItem[] = Array.from({ length: 12 }, (_, i) => ({
        id: 1000 + i,
        type: item.type,
        title: `Similar ${item.type} ${i + 1}`,
        image: `https://images.unsplash.com/photo-${1600000000000 + i}?w=400&h=400&fit=crop`,
        aspectRatio: 1,
        category: item.category,
      }));
      setSimilarItems(mockSimilar);
    }
  }, [item]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-[95vw] md:max-w-6xl h-[95vh] md:h-[90vh] p-0 overflow-hidden border-none bg-background rounded-[32px] shadow-2xl flex flex-col"
      >
        {/* Mobile Sticky Close Header */}
        <div className="md:hidden sticky top-0 left-0 right-0 h-0 z-[60] pointer-events-none">
          <div className="p-4 flex justify-between items-center w-full pointer-events-auto">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 shadow-lg"
            >
              <X size={24} />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto no-scrollbar md:overflow-hidden">
          {/* Main Content Area (Image/Video) */}
          <div className="w-full md:flex-1 bg-black relative flex items-center justify-center group min-h-[50vh] md:min-h-0 md:relative z-20">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-contain"
            />
            
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                  <Play size={40} className="fill-white" />
                </div>
              </div>
            )}
          </div>

          {/* Info & Actions Sidebar */}
          <div className="w-full md:w-96 flex flex-col bg-background p-6 border-t md:border-t-0 md:border-l overflow-y-visible md:overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.id}`} />
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-sm">Business Name</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{item.category || item.type}</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-full text-xs font-bold gap-2">
                <UserPlus size={14} />
                Follow
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <h2 className="text-xl font-bold tracking-tight">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Discover the latest trends and local gems. This {item.type} showcases the unique offerings of our neighborhood businesses. Connect, explore, and support local!
              </p>
              
              {item.price && (
                <div className="p-4 bg-secondary/30 rounded-2xl flex items-center justify-between">
                  <span className="text-sm font-medium">Price</span>
                  <span className="text-lg font-bold text-primary">{item.price}</span>
                </div>
              )}
              
              {item.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Heart size={16} className="fill-current" />
                    <span className="font-bold">{item.rating}</span>
                  </div>
                  <span className="text-muted-foreground">({item.reviews} reviews)</span>
                </div>
              )}
            </div>

            {/* Interaction Bar */}
            <div className="mt-8 pt-6 border-t flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="rounded-full hover:text-red-500 hover:bg-red-500/10">
                  <Heart size={22} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:text-primary hover:bg-primary/10"
                  onClick={() => setIsCommentModalOpen(true)}
                >
                  <MessageCircle size={22} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:text-primary hover:bg-primary/10">
                  <Share2 size={22} />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:text-primary hover:bg-primary/10">
                <Bookmark size={22} />
              </Button>
            </div>
            
            <Button className="w-full mt-6 rounded-2xl h-12 font-bold shadow-lg shadow-primary/20">
              Learn More
            </Button>
          </div>
        </div>

        {/* Similar Items Slider */}
        <div className="border-t bg-secondary/10 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">You might also like</h3>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => scroll('left')}
                className="rounded-full h-8 w-8 bg-background shadow-sm border"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => scroll('right')}
                className="rounded-full h-8 w-8 bg-background shadow-sm border"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2"
          >
            {similarItems.map((similar) => (
              <div 
                key={similar.id} 
                className="flex-shrink-0 w-32 md:w-40 snap-start group cursor-pointer"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-2 border bg-card">
                  <img 
                    src={similar.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    alt={similar.title}
                  />
                </div>
                <p className="text-[10px] font-bold truncate px-1">{similar.title}</p>
                <p className="text-[9px] text-muted-foreground px-1 uppercase">{similar.category || similar.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Close Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-4 right-4 hidden md:flex rounded-full bg-secondary/80 hover:bg-secondary z-50"
        >
          <X size={20} />
        </Button>

        {isCommentModalOpen && (
          <CommentModal 
            isOpen={isCommentModalOpen}
            onClose={() => setIsCommentModalOpen(false)}
            itemId={item.id}
            item={item}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
