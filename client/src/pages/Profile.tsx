import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Store, ArrowRight, Map } from "lucide-react";
import { FollowListModal } from "@/components/FollowListModal";

export default function Profile() {
  const [, setLocation] = useLocation();
  const [profileType, setProfileType] = useState<"user" | "business">("user");
  const [followModal, setFollowModal] = useState<{ isOpen: boolean; type: "followers" | "following" | "blocked" }>({
    isOpen: false,
    type: "followers",
  });

  useEffect(() => {
    const stored = localStorage.getItem("profileType") as "user" | "business" | null;
    if (stored) setProfileType(stored);
  }, []);

  const handleMapNavigation = () => {
    setLocation("/map-discovery");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("profileType");
    setLocation("/");
  };

  const handleSwitchToBusiness = () => {
    localStorage.setItem("profileType", "business");
    setProfileType("business");
    setLocation("/business-feed");
  };

  const handleSwitchToUser = () => {
    localStorage.setItem("profileType", "user");
    setProfileType("user");
    setLocation("/feed");
  };

  return (
    <div className="min-h-screen bg-background pb-24 pt-20">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Profile</h1>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Alex Johnson</h2>
              <p className="text-muted-foreground">@alexj</p>
              <p className="text-sm mt-2">Digital entrepreneur and business enthusiast</p>
              <div className="flex gap-4 mt-4 text-sm">
                <button 
                  onClick={() => setFollowModal({ isOpen: true, type: "followers" })}
                  className="hover:opacity-70 transition-opacity flex gap-1 items-center"
                >
                  <span className="font-bold">1.2K</span>
                  <span className="text-muted-foreground">Followers</span>
                </button>
                <button 
                  onClick={() => setFollowModal({ isOpen: true, type: "following" })}
                  className="hover:opacity-70 transition-opacity flex gap-1 items-center"
                >
                  <span className="font-bold">340</span>
                  <span className="text-muted-foreground">Following</span>
                </button>
                <button 
                  onClick={() => setFollowModal({ isOpen: true, type: "blocked" })}
                  className="hover:opacity-70 transition-opacity flex gap-1 items-center"
                >
                  <span className="font-bold text-red-500">12</span>
                  <span className="text-muted-foreground">Blocked</span>
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Type Switch */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Account Type</h3>
          <div className="space-y-3">
            <div 
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                profileType === "user" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-border"
              }`} 
              onClick={handleSwitchToUser} 
              data-testid="button-profile-user"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">User Profile</p>
                  <p className="text-sm text-muted-foreground">Browse, follow, like, and comment</p>
                </div>
                {profileType === "user" && <div className="text-primary font-bold">Active</div>}
              </div>
            </div>

            <div 
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                profileType === "business" 
                  ? "border-primary bg-primary/5" 
                  : "border-border/50 hover:border-border"
              }`} 
              onClick={handleSwitchToBusiness} 
              data-testid="button-profile-business"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <Store size={18} />
                    Business Profile
                  </p>
                  <p className="text-sm text-muted-foreground">Post feeds, track engagement, sell products</p>
                </div>
                {profileType === "business" && <div className="text-primary font-bold">Active</div>}
              </div>
            </div>
          </div>

          {profileType === "business" && (
            <Button 
              className="w-full mt-4 gap-2" 
              onClick={handleSwitchToBusiness}
              data-testid="button-open-business-dashboard"
            >
              Open Business Dashboard
              <ArrowRight size={18} />
            </Button>
          )}
        </Card>

        {/* Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Biz Services</h3>
          <div className="space-y-2">
            <Button 
              variant="secondary" 
              className="w-full justify-between gap-3 h-14 rounded-2xl px-6 group"
              onClick={handleMapNavigation}
              data-testid="button-map-navigation"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <Map size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Map Navigation</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Discover Businesses</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Settings</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 h-11"
              onClick={() => setLocation('/settings')}
            >
              <Settings size={18} />
              Account Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11" disabled>
              <Settings size={18} />
              Privacy Settings (Coming Soon)
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11">
              <Settings size={18} />
              Notifications
            </Button>
          </div>
        </Card>

        {/* Logout */}
        <Button 
          variant="destructive" 
          className="w-full gap-2 h-11"
          onClick={handleLogout}
          data-testid="button-logout-profile"
        >
          <LogOut size={18} />
          Logout
        </Button>
      </main>

      <FollowListModal
        isOpen={followModal.isOpen}
        onClose={() => setFollowModal({ ...followModal, isOpen: false })}
        type={followModal.type}
        username="Alex Johnson"
      />
    </div>
  );
}
