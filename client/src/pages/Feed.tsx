import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from "lucide-react";
import { CommentModal } from "@/components/CommentModal";
import { FeedDetailModal } from "@/components/FeedDetailModal";

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

export default function Feed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState("For you");
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<number>>(new Set());
  const [followedItems, setFollowedItems] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadCountRef = useRef(0);
  const categories = ["For you", "Marketing", "Design", "Local", "Tech", "Events"];

  // Generate mock feed items with varying aspect ratios
  const generateFeedItems = (startId: number, count: number): FeedItem[] => {
    const baseItems = [
      {
        type: "post" as const,
        title: "Summer Campaign 2024",
        image: "https://images.unsplash.com/photo-1635003913011-95971e5e757f?w=600&h=900&fit=crop",
        aspectRatio: 0.66,
        likes: 234,
      },
      {
        type: "business" as const,
        title: "Premium Cafe",
        image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&h=700&fit=crop",
        aspectRatio: 0.86,
        rating: 4.8,
        reviews: 124,
        category: "Food & Beverage",
      },
      {
        type: "video" as const,
        title: "Product Demo Video",
        image: "https://images.unsplash.com/photo-1611339555312-e607c25352ca?w=500&h=500&fit=crop",
        aspectRatio: 1,
        likes: 456,
      },
      {
        type: "product" as const,
        title: "Premium Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=700&fit=crop",
        aspectRatio: 0.85,
        price: "$199",
        rating: 4.6,
      },
      {
        type: "post" as const,
        title: "Fashion Showcase",
        image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=800&fit=crop",
        aspectRatio: 0.75,
        likes: 612,
      },
      {
        type: "business" as const,
        title: "Modern Gym",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop",
        aspectRatio: 1,
        rating: 4.7,
        reviews: 89,
        category: "Fitness",
      },
      {
        type: "product" as const,
        title: "Wireless Earbuds",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=800&fit=crop",
        aspectRatio: 0.75,
        price: "$89",
        rating: 4.5,
      },
      {
        type: "post" as const,
        title: "New Partnership Announcement",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&h=600&fit=crop",
        aspectRatio: 1.17,
        likes: 456,
      },
      {
        type: "business" as const,
        title: "Luxury Salon",
        image: "https://images.unsplash.com/photo-1521887745882-c8a130266e35?w=600&h=900&fit=crop",
        aspectRatio: 0.67,
        rating: 4.9,
        reviews: 203,
        category: "Beauty",
      },
      {
        type: "product" as const,
        title: "Organic Skincare",
        image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop",
        aspectRatio: 1,
        price: "$79",
        rating: 4.8,
      },
      {
        type: "post" as const,
        title: "Tech Innovation Event",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&h=600&fit=crop",
        aspectRatio: 1.17,
        likes: 789,
      },
      {
        type: "business" as const,
        title: "Coworking Space",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=700&fit=crop",
        aspectRatio: 0.86,
        rating: 4.6,
        reviews: 145,
        category: "Workspace",
      },
    ];

    const items: FeedItem[] = [];
    for (let i = 0; i < count; i++) {
      const baseItem = baseItems[i % baseItems.length];
      const id = startId + i;
      items.push({
        id,
        ...baseItem,
      });
      setLikeCounts(prev => ({
        ...prev,
        [id]: baseItem.likes || 0
      }));
    }
    return items;
  };

  // Initialize with first batch
  useEffect(() => {
    const initialItems = generateFeedItems(0, 12);
    setFeedItems(initialItems);
    loadCountRef.current = 1;

    // Load persisted state
    const liked = localStorage.getItem("likedItems");
    if (liked) {
      try {
        const likedSet = new Set<number>(JSON.parse(liked));
        setLikedItems(likedSet);
      } catch (e) {
        console.error("Failed to parse liked items");
      }
    }

    const saved = localStorage.getItem("savedItems");
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved);
        const savedSet = new Set<number>(parsedSaved.map((item: any) => item.id));
        setSavedItems(savedSet);
      } catch (e) {
        console.error("Failed to parse saved items");
      }
    }

    const followed = localStorage.getItem("followedItems");
    if (followed) {
      try {
        const followedSet = new Set<number>(JSON.parse(followed));
        setFollowedItems(followedSet);
      } catch (e) {
        console.error("Failed to parse followed items");
      }
    }

    const counts = localStorage.getItem("likeCounts");
    if (counts) {
      try {
        setLikeCounts(JSON.parse(counts));
      } catch (e) {
        console.error("Failed to parse like counts");
      }
    }
  }, []);

  // Infinite scroll loader
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore]);

  const loadMoreItems = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      const newItems = generateFeedItems(feedItems.length, 12);
      setFeedItems((prev) => [...prev, ...newItems]);
      loadCountRef.current += 1;
      setIsLoadingMore(false);

      if (loadCountRef.current >= 5) {
        setHasMore(false);
      }
    }, 300);
  }, [feedItems.length]);

  const handleLike = (e: React.MouseEvent, itemId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        setLikeCounts(c => {
          const updated = { ...c, [itemId]: (c[itemId] || 0) - 1 };
          localStorage.setItem("likeCounts", JSON.stringify(updated));
          return updated;
        });
      } else {
        newSet.add(itemId);
        setLikeCounts(c => {
          const updated = { ...c, [itemId]: (c[itemId] || 0) + 1 };
          localStorage.setItem("likeCounts", JSON.stringify(updated));
          return updated;
        });
      }
      localStorage.setItem("likedItems", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const handleSave = (e: React.MouseEvent, itemId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedItems(prev => {
      const newSet = new Set(prev);
      const item = feedItems.find(i => i.id === itemId);
      if (item) {
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        // Persist saved items with full item data
        const savedFromStorage = localStorage.getItem("savedItems");
        let savedArray: any[] = [];
        try {
          if (savedFromStorage) {
            savedArray = JSON.parse(savedFromStorage);
          }
        } catch (e) {
          console.error("Failed to parse saved items");
        }
        
        if (!newSet.has(itemId)) {
          // Remove item
          savedArray = savedArray.filter(si => si.id !== itemId);
        } else {
          // Add item if not already saved
          if (!savedArray.find(si => si.id === itemId)) {
            savedArray.push({ ...item, savedAt: Date.now() });
          }
        }
        localStorage.setItem("savedItems", JSON.stringify(savedArray));
      }
      return newSet;
    });
  };

  const handleFollow = (e: React.MouseEvent, itemId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setFollowedItems(prev => {
      const newSet = new Set(prev);
      newSet.has(itemId) ? newSet.delete(itemId) : newSet.add(itemId);
      return newSet;
    });
  };

  const handleComment = (e: React.MouseEvent, item: FeedItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItemId(item.id);
    setSelectedItem(item);
    setShowCommentModal(true);
  };

  const handleViewDetails = (e: React.MouseEvent, item: FeedItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const breakpointColumnsObj = {
    default: 3,
    1200: 3,
    900: 2,
    640: 2,
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <main className="pt-20 px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
        {/* Category Pills */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-6 no-scrollbar -mx-2 sm:-mx-4 px-2 sm:px-4 md:mx-0 md:px-0 mb-6 sm:mb-8 sticky top-20 z-30 bg-background/95 backdrop-blur-md py-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200
                ${activeCategory === cat 
                  ? "bg-foreground text-background shadow-md transform scale-105" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}
              `}
              data-testid={`button-category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry Grid Feed */}
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {feedItems.map((item, index) => (
            <motion.div
              key={`${item.id}-${item.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 12) * 0.05 }}
              className="break-inside-avoid mb-4"
            >
              <div 
                className="group relative rounded-lg overflow-hidden bg-card border border-border/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
                data-testid={`card-${item.type}-${item.id}`}
                style={{
                  aspectRatio: item.aspectRatio,
                }}
              >
                {/* Image */}
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Video Badge */}
                {item.type === "video" && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                    VIDEO
                  </div>
                )}

                {/* Overlay with Title and Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  <div className="flex justify-end">
                    <button 
                      onClick={(e) => handleFollow(e, item.id)}
                      className={`p-2 rounded-full transition-colors ${followedItems.has(item.id) ? 'bg-blue-500/30 text-blue-400' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                      data-testid={`button-follow-${item.id}`}
                    >
                      <UserPlus size={18} />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white text-sm mb-3 line-clamp-2">{item.title}</h3>
                    
                    {/* Rating/Price Info */}
                    <div className="text-xs text-gray-100 mb-3">
                      {item.type === "business" && (
                        <span>★ {item.rating} ({item.reviews} reviews)</span>
                      )}
                      {item.type === "product" && (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-primary">{item.price}</span>
                          <span>★ {item.rating}</span>
                        </div>
                      )}
                      {(item.type === "post" || item.type === "video") && (
                        <span>❤️ {likeCounts[item.id] || item.likes || 0} likes</span>
                      )}
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleViewDetails(e, item)}
                        className="flex-1 bg-primary/90 hover:bg-primary text-primary-foreground py-2 rounded text-xs font-semibold transition-colors"
                        data-testid={`button-view-${item.type}`}
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => handleLike(e, item.id)}
                        className={`p-2 rounded transition-colors ${likedItems.has(item.id) ? 'bg-red-500/30 text-red-400' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                        data-testid={`button-like-${item.id}`}
                      >
                        <Heart size={16} fill={likedItems.has(item.id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => handleComment(e, item)}
                        className="p-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                        data-testid={`button-comment-${item.id}`}
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                        data-testid={`button-share-${item.id}`}
                      >
                        <Share2 size={16} />
                      </button>
                      <button 
                        onClick={(e) => handleSave(e, item.id)}
                        className={`p-2 rounded transition-colors ${savedItems.has(item.id) ? 'bg-yellow-500/30 text-yellow-400' : 'bg-white/20 hover:bg-white/30 text-white'}`}
                        data-testid={`button-save-${item.id}`}
                      >
                        <Bookmark size={16} fill={savedItems.has(item.id) ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </Masonry>

        {/* Infinite Scroll Loader */}
        <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
          {isLoadingMore && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
          )}
          {!hasMore && feedItems.length > 0 && (
            <p className="text-muted-foreground text-sm">No more items to load</p>
          )}
        </div>
      </main>

      {/* Comment Modal */}
      <CommentModal 
        isOpen={showCommentModal} 
        onClose={() => {
          setShowCommentModal(false);
          setSelectedItemId(null);
          setSelectedItem(null);
        }}
        itemId={selectedItemId}
        item={selectedItem}
      />
      <FeedDetailModal 
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
}
