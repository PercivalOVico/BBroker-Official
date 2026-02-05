import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Heart, MapPin, Star, MessageCircle, Share2, Bookmark } from "lucide-react";
import { type FeedItem, type Business, type Product, type Post } from "@shared/schema";
import { useState } from "react";
import { CommentModal } from "./CommentModal";

interface MasonryFeedProps {
  items: FeedItem[];
}

export function MasonryFeed({ items }: MasonryFeedProps) {
  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 2,
    500: 2 // Two columns on mobile looks more Pinterest-like
  };

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {items.map((item, index) => (
        <FeedCard key={`${item.type}-${item.data.id}`} item={item} index={index} />
      ))}
    </Masonry>
  );
}

function FeedCard({ item, index }: { item: FeedItem; index: number }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState((item.data as Post).likes || 0);
  const [commentCount, setCommentCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");

  const content = (() => {
    switch (item.type) {
      case 'business':
        return <BusinessCardContent data={item.data} />;
      case 'product':
        return <ProductCardContent data={item.data} />;
      case 'post':
        return <PostCardContent data={item.data} />;
    }
  })();

  const href = item.type === 'business' 
    ? `/business/${item.data.id}` 
    : item.type === 'product' 
      ? `/product/${item.data.id}` 
      : '#';

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowCommentModal(true);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const title = item.data.title || (item.data as any).name;
    if (navigator.share) {
      navigator.share({
        title: "BBROKER",
        text: `Check out: ${title}`,
        url: window.location.href,
      });
    } else {
      alert("Shared! (Copy link: " + window.location.href + ")");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="mb-4 break-inside-avoid"
    >
      <Link href={href} className="block group relative">
        <div className="rounded-xl overflow-hidden bg-card shadow-sm border border-border/50 hover:shadow-md transition-shadow duration-300">
          {content}
          
          {/* Overlay Action Buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100">
            {/* Bottom Left: Like, Comment, Share */}
            <div className="flex gap-2">
              <button 
                className="p-2 rounded-full bg-white/90 text-black backdrop-blur-sm hover:bg-white transition-all hover:scale-110 active:scale-95"
                onClick={handleLike}
                data-testid={`button-like-${item.data.id}`}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : ""} />
              </button>

              <button 
                className="p-2 rounded-full bg-white/90 text-black backdrop-blur-sm hover:bg-white transition-all hover:scale-110 active:scale-95"
                onClick={handleComment}
                data-testid={`button-comment-${item.data.id}`}
              >
                <MessageCircle size={16} />
              </button>

              <button 
                className="p-2 rounded-full bg-white/90 text-black backdrop-blur-sm hover:bg-white transition-all hover:scale-110 active:scale-95"
                onClick={handleShare}
                data-testid={`button-share-${item.data.id}`}
              >
                <Share2 size={16} />
              </button>
            </div>

            {/* Bottom Right: Save */}
            <button 
              className="p-2 rounded-full bg-white/90 text-black backdrop-blur-sm hover:bg-white transition-all hover:scale-110 active:scale-95"
              onClick={handleSave}
              data-testid={`button-save-${item.data.id}`}
            >
              <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-primary" : ""} />
            </button>
          </div>
        </div>
      </Link>
      
      {/* Footer Info */}
      <div className="mt-2 px-1">
        <h4 className="font-semibold text-sm leading-tight text-foreground truncate">
          {item.data.title || (item.data as any).name}
        </h4>
        {item.type === 'business' && (
           <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
             <Star size={10} className="fill-yellow-400 text-yellow-400" />
             <span>{(item.data as Business).rating?.toFixed(1)}</span>
             <span>•</span>
             <span>{(item.data as Business).category}</span>
           </div>
        )}
        {item.type === 'product' && (
          <div className="font-bold text-sm text-foreground mt-0.5">
            ${((item.data as Product).price / 100).toFixed(2)}
          </div>
        )}

        {/* Stats Row */}
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className={isLiked ? "text-red-500 font-semibold" : ""}>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>

      {/* Comment Modal */}
      <CommentModal
        item={item}
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
      />
    </motion.div>
  );
}

function BusinessCardContent({ data }: { data: Business }) {
  return (
    <>
      <div className="relative aspect-[4/5] bg-muted">
        <img 
          src={data.imageUrl} 
          alt={data.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-1 text-white/90 text-xs font-medium">
            <MapPin size={12} />
            <span className="truncate">{data.address}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductCardContent({ data }: { data: Product }) {
  return (
    <div className="aspect-square bg-muted">
      <img 
        src={data.imageUrl} 
        alt={data.title} 
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

function PostCardContent({ data }: { data: Post }) {
  return (
    <div className="relative">
       <div className="aspect-[3/4] bg-muted">
        <img 
          src={data.imageUrl} 
          alt={data.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
        {data.type}
      </div>
    </div>
  );
}
