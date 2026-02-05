import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { X, Search, UserPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Follower {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "followers" | "following" | "blocked";
  username: string;
}

export function FollowListModal({ isOpen, onClose, type, username }: FollowListModalProps) {
  const [users, setUsers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const generateMockUsers = useCallback((startId: number, count: number): Follower[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: startId + i,
      name: `${type === 'blocked' ? 'Blocked User' : 'User'} ${startId + i}`,
      username: `user_${startId + i}`,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + startId + i}?w=100&h=100&fit=crop`,
      isFollowing: type === 'following',
    }));
  }, [type]);

  useEffect(() => {
    if (isOpen) {
      setUsers(generateMockUsers(0, 15));
      setHasMore(true);
    }
  }, [isOpen, generateMockUsers]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextBatch = generateMockUsers(users.length, 10);
      setUsers(prev => [...prev, ...nextBatch]);
      if (users.length > 50) setHasMore(false);
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore, users.length, generateMockUsers]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <DialogHeader className="p-4 border-b bg-background/95 backdrop-blur-md sticky top-0 z-10 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold capitalize">
              {type}
            </DialogTitle>
            <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {users.length}{hasMore ? "+" : ""}
            </span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
            <X size={20} />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4">
          <div className="space-y-4">
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/5">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-sm">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <Button
                  variant={type === 'blocked' ? "destructive" : (user.isFollowing ? "secondary" : "default")}
                  size="sm"
                  className="rounded-full px-4 h-8 text-xs font-bold transition-all"
                  onClick={() => {
                    if (type === 'blocked') {
                      setUsers(prev => prev.filter(u => u.id !== user.id));
                    } else if (type === 'following') {
                      if (user.isFollowing) {
                        setUsers(prev => prev.filter(u => u.id !== user.id));
                      }
                    } else if (type === 'followers') {
                      setUsers(prev => prev.filter(u => u.id !== user.id));
                    }
                  }}
                >
                  {type === 'blocked' ? 'Unblock' : (
                    user.isFollowing ? (
                      <span className="flex items-center gap-1">
                        <Check size={14} /> Unfollow
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        {type === 'followers' ? 'Block' : (
                          <><UserPlus size={14} /> Follow</>
                        )}
                      </span>
                    )
                  )}
                </Button>
              </motion.div>
            ))}
            
            <div ref={observerTarget} className="h-10 flex items-center justify-center">
              {isLoading && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
