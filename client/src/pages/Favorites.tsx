import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CommentModal } from "@/components/CommentModal";

interface SavedItem {
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
  savedAt: number;
}

export default function Favorites() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<SavedItem | null>(null);
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [likeCounts, setLikeCounts] = useState<Record<number, number>>({});

  useEffect(() => {
    // Load saved items from localStorage
    const saved = localStorage.getItem("savedItems");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedItems(parsed.sort((a: SavedItem, b: SavedItem) => b.savedAt - a.savedAt));
      } catch (e) {
        console.error("Failed to parse saved items");
      }
    }

    // Load liked items
    const liked = localStorage.getItem("likedItems");
    if (liked) {
      try {
        const likedSet = new Set<number>(JSON.parse(liked));
        setLikedItems(likedSet);
      } catch (e) {
        console.error("Failed to parse liked items");
      }
    }

    // Load like counts
    const counts = localStorage.getItem("likeCounts");
    if (counts) {
      try {
        setLikeCounts(JSON.parse(counts));
      } catch (e) {
        console.error("Failed to parse like counts");
      }
    }
  }, []);

  const handleRemoveSaved = (id: number) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem("savedItems", JSON.stringify(updated));
  };

  const handleLike = (id: number) => {
    const newLiked = new Set(likedItems);
    const newCount = likeCounts[id] || 0;
    
    if (newLiked.has(id)) {
      newLiked.delete(id);
      likeCounts[id] = newCount - 1;
    } else {
      newLiked.add(id);
      likeCounts[id] = newCount + 1;
    }
    
    setLikedItems(newLiked);
    setLikeCounts({ ...likeCounts });
    localStorage.setItem("likedItems", JSON.stringify(Array.from(newLiked)));
    localStorage.setItem("likeCounts", JSON.stringify(likeCounts));
  };

  const handleComment = (item: SavedItem) => {
    setSelectedItem(item);
    setSelectedItemId(item.id);
    setShowCommentModal(true);
  };

  const breakpoints = {
    default: 1,
    640: 1,
    900: 2,
    1200: 3,
    1600: 3,
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-3 sm:py-4">
          <h1 className="text-xl sm:text-2xl font-bold">Saved Items</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {savedItems.length} item{savedItems.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 sm:py-6">
        {savedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Bookmark size={48} className="text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved items yet</h2>
            <p className="text-muted-foreground">
              Save businesses, posts, and products to view them here
            </p>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpoints}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
          >
            {savedItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer group bg-card hover:shadow-lg transition-all duration-300"
                  data-testid={`card-saved-${item.id}`}
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden bg-muted"
                    style={{ aspectRatio: item.aspectRatio }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.type === "business" && item.rating && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-full text-white text-sm font-medium">
                        ★ {item.rating}
                      </div>
                    )}
                    {item.price && (
                      <div className="absolute bottom-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                        {item.price}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {item.category && (
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        {item.category}
                      </p>
                    )}
                    <h3 className="font-semibold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Stats */}
                    {item.reviews && (
                      <div className="text-xs text-muted-foreground mb-3">
                        {item.reviews} reviews
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLike(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-secondary transition-colors"
                        data-testid={`button-like-${item.id}`}
                      >
                        <Heart
                          size={16}
                          className={likedItems.has(item.id) ? "fill-destructive text-destructive" : ""}
                        />
                        {likeCounts[item.id] || 0}
                      </button>
                      <button
                        onClick={() => handleComment(item)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-secondary transition-colors"
                        data-testid={`button-comment-${item.id}`}
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveSaved(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-sm font-medium p-2 rounded-lg hover:bg-secondary transition-colors text-destructive"
                        data-testid={`button-remove-saved-${item.id}`}
                      >
                        <Bookmark size={16} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Masonry>
        )}
      </main>

      {showCommentModal && selectedItem && (
        <CommentModal
          isOpen={showCommentModal}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          itemId={selectedItemId || 0}
        />
      )}
    </div>
  );
}
