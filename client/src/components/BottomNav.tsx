import { Link, useLocation } from "wouter";
import { Home, Heart, MessageSquare, User, Briefcase, Bookmark, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/feed" },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: Briefcase, label: "Biz", href: "/map-discovery" },
    { icon: MessageSquare, label: "Inbox", href: "/inbox" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  // Add Favorites only if not on certain pages
  const shouldShowFavorites = location !== "/" && location !== "/favorites";

  if (location === "/" || location === "/login") return null;

  const displayItems = location === "/feed" ? [
    ...navItems,
    { icon: Bookmark, label: "Saved", href: "/favorites" },
  ] : navItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {displayItems.map(({ icon: Icon, label, href }) => {
          const isActive = location === href;
          return (
            <Link key={href} href={href} className="flex-1 flex flex-col items-center justify-center py-2 group">
              <div
                className={cn(
                  "p-1.5 rounded-full transition-all duration-200",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground group-hover:text-foreground group-active:scale-95"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-1 transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
