import { useState } from "react";
import { Link } from "wouter";
import { Bell, Search, Filter, Moon, Sun, RefreshCw } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { ProfileSwitchModal } from "@/components/ProfileSwitchModal";
import { useProfileSwitch } from "@/hooks/use-profile-switch";

export function Header({ onSearch }: { onSearch?: (query: string) => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileSwitchModal, setShowProfileSwitchModal] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { isBusinessMode } = useProfileSwitch();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 10);
    });
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50 py-2" : "bg-transparent py-2 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-4">
        {/* Logo Icon */}
        <Link href="/feed" className="flex-shrink-0">
          <div className="w-9 sm:w-10 h-9 sm:h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-lg sm:text-xl shadow-lg shadow-primary/20">
            B
          </div>
        </Link>

        {/* Search Bar - Hidden on very small screens */}
        <div className="hidden sm:flex flex-1 relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search businesses..."
            className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-full bg-secondary border-none text-xs sm:text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          <button className="p-2 sm:p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative" data-testid="button-notifications">
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-primary rounded-full border border-background"></span>
          </button>

          {/* Profile Switch Button */}
          <button
            onClick={() => setShowProfileSwitchModal(true)}
            className={`
              p-2 sm:p-2.5 rounded-full transition-all
              ${isBusinessMode 
                ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }
            `}
            data-testid="button-profile-switch"
            aria-label="Switch profile"
            title="Switch between User and Business mode"
          >
            <RefreshCw size={18} className="sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={18} className="sm:w-5 sm:h-5" />
            ) : (
              <Sun size={18} className="sm:w-5 sm:h-5" />
            )}
          </button>
          
          <button className="p-2 sm:p-2.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors sm:hidden" data-testid="button-filter">
            <Filter size={18} />
          </button>

          <div className="hidden md:block">
            <Link href="/profile">
               <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border-2 border-background shadow-sm hover:border-primary/50 transition-colors flex-shrink-0">
                 <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" alt="Profile" />
               </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Switch Modal */}
      <ProfileSwitchModal
        isOpen={showProfileSwitchModal}
        onClose={() => setShowProfileSwitchModal(false)}
      />
    </header>
  );
}
