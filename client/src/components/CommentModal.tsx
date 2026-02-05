import { X, Heart, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CommentData {
  id: number;
  username: string;
  text: string;
  likes: number;
  timestamp: string;
  parentCommentId?: number;
}

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

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId?: number | null;
  item?: FeedItem | null;
}

export function CommentModal({ isOpen, onClose, itemId, item }: CommentModalProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentLikes, setCommentLikes] = useState<Record<number, number>>({});
  const [savedComments, setSavedComments] = useState<Set<number>>(new Set());

  // Use a more specific key if item type is available
  const feedItemId = itemId ? `item-${itemId}` : (item ? `${item.type}-${item.id}` : "");

  useEffect(() => {
    if (isOpen && feedItemId) {
      const stored = localStorage.getItem(`comments-${feedItemId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setComments(parsed);
        const likes: Record<number, number> = {};
        parsed.forEach((c: CommentData) => {
          likes[c.id] = c.likes || 0;
        });
        setCommentLikes(likes);
      } else {
        const mockComments: CommentData[] = [
          {
            id: 1,
            username: "Sarah Chen",
            text: "Amazing product! Really impressed with the quality.",
            likes: 12,
            timestamp: "2 hours ago"
          },
          {
            id: 2,
            username: "John Designer",
            text: "Love the design. Would definitely recommend!",
            likes: 8,
            timestamp: "1 hour ago"
          }
        ];
        setComments(mockComments);
        mockComments.forEach(c => {
          setCommentLikes(prev => ({ ...prev, [c.id]: c.likes }));
        });
      }
    }
  }, [isOpen, feedItemId]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: CommentData = {
        id: Date.now(),
        username: "You",
        text: newComment,
        likes: 0,
        timestamp: "now"
      };
      const updated = [...comments, comment];
      setComments(updated);
      if (feedItemId) {
        localStorage.setItem(`comments-${feedItemId}`, JSON.stringify(updated));
      }
      setNewComment("");
    }
  };

  const handleAddReply = (parentId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      const reply: CommentData = {
        id: Date.now(),
        username: "You",
        text: replyText,
        likes: 0,
        timestamp: "now",
        parentCommentId: parentId
      };
      const updated = [...comments, reply];
      setComments(updated);
      if (feedItemId) {
        localStorage.setItem(`comments-${feedItemId}`, JSON.stringify(updated));
      }
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const toggleCommentLike = (commentId: number) => {
    setCommentLikes(prev => ({
      ...prev,
      [commentId]: (prev[commentId] || 0) + (prev[commentId] ? -1 : 1)
    }));
  };

  const toggleSaveComment = (commentId: number) => {
    setSavedComments(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const replies = (parentId: number) => comments.filter(c => c.parentCommentId === parentId);
  const topLevelComments = comments.filter(c => !c.parentCommentId);

  if (!isOpen || !item) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm"
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-background rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background z-10">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
            data-testid="button-close-modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Two Column Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Side - Item Media */}
          <div className="flex w-full md:w-80 flex-shrink-0 flex-col bg-secondary/20 md:border-r border-b md:border-b-0 border-border">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full md:h-auto h-64 flex-shrink-0 object-cover"
              style={{ aspectRatio: item.aspectRatio }}
            />
            <div className="p-4 flex-1 overflow-y-auto hidden md:block">
              <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
              
              {/* Item Info */}
              <div className="text-xs text-muted-foreground space-y-2">
                {item.type === "business" && (
                  <>
                    <p>★ {item.rating} ({item.reviews} reviews)</p>
                    {item.category && <p className="text-primary">{item.category}</p>}
                  </>
                )}
                {item.type === "product" && (
                  <>
                    <p className="font-semibold text-primary">{item.price}</p>
                    <p>★ {item.rating}</p>
                  </>
                )}
                {(item.type === "post" || item.type === "video") && (
                  <>
                    <p>❤️ {item.likes || 0} likes</p>
                    {item.type === "video" && <p className="text-primary">VIDEO</p>}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Comments */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {/* Top Level Comments */}
                {topLevelComments.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  topLevelComments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-semibold text-sm">{comment.username}</p>
                              <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
                            </div>
                          </div>
                          <p className="text-sm mt-1 break-words">{comment.text}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => toggleCommentLike(comment.id)}
                              className={cn(
                                "flex items-center gap-1 text-xs transition-colors",
                                commentLikes[comment.id] ? "text-red-500" : "text-muted-foreground hover:text-foreground"
                              )}
                              data-testid={`button-like-comment-${comment.id}`}
                            >
                              <Heart size={14} fill={commentLikes[comment.id] ? "currentColor" : "none"} />
                              {commentLikes[comment.id] || 0}
                            </button>
                            <button
                              onClick={() => toggleSaveComment(comment.id)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              data-testid={`button-save-comment-${comment.id}`}
                            >
                              <Bookmark size={14} fill={savedComments.has(comment.id) ? "currentColor" : "none"} />
                            </button>
                            <button
                              onClick={() => setReplyingTo(comment.id)}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              data-testid={`button-reply-${comment.id}`}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {replies(comment.id).map((reply) => (
                        <div key={reply.id} className="ml-8 flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div>
                              <p className="font-semibold text-sm">{reply.username}</p>
                              <p className="text-xs text-muted-foreground">{reply.timestamp}</p>
                            </div>
                            <p className="text-sm mt-1 break-words">{reply.text}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <button
                                onClick={() => toggleCommentLike(reply.id)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Heart size={12} fill={commentLikes[reply.id] ? "currentColor" : "none"} />
                                {commentLikes[reply.id] || 0}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <form onSubmit={(e) => handleAddReply(comment.id, e)} className="ml-8 mt-2 space-y-2">
                          <input
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full px-3 py-2 bg-secondary rounded border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            data-testid="input-reply"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-colors"
                              data-testid="button-submit-reply"
                            >
                              Reply
                            </button>
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1 bg-secondary rounded text-xs font-semibold hover:bg-secondary/80 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="border-t border-border p-4 bg-background flex-shrink-0">
              <form onSubmit={handleAddComment} className="space-y-2">
                <textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary rounded border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={2}
                  data-testid="input-new-comment"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newComment.trim()}
                  data-testid="button-submit-comment"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
