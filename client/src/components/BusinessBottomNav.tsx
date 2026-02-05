import { Link, useLocation } from "wouter";
import { Home, MessageSquare, Users, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BusinessBottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Feeds", href: "/business-feed" },
    { icon: MessageSquare, label: "Messages", href: "/business-messages" },
    { icon: Users, label: "Customers", href: "/business-customers" },
    { icon: BarChart3, label: "Dashboard", href: "/business-dashboard" },
    { icon: Settings, label: "Settings", href: "/business-settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map(({ icon: Icon, label, href }) => {
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
