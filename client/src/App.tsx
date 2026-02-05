import { Switch, Route, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/hooks/useTheme";

import LandingFeed from "@/pages/LandingFeed";
import Feed from "@/pages/Feed";
import Wishlist from "@/pages/Wishlist";
import Favorites from "@/pages/Favorites";
import Inbox from "@/pages/Inbox";
import MapDiscovery from "@/pages/MapDiscovery";
import BusinessDetail from "@/pages/BusinessDetail";
import ProductDetail from "@/pages/ProductDetail";
import Profile from "@/pages/Profile";
import Wallet from "@/pages/Wallet";
import SettingsPage from "@/pages/SettingsPage";
import AdminDashboard from "@/pages/AdminDashboard";
import ShadowProfile from "@/pages/ShadowProfile";
import BusinessDashboard from "@/pages/BusinessDashboard";
import BusinessFeed from "@/pages/BusinessFeed";
import BusinessCustomers from "@/pages/BusinessCustomers";

import { BottomNav } from "@/components/BottomNav";
import { BusinessBottomNav } from "@/components/BusinessBottomNav";
import { Header } from "@/components/Header";

function Router() {
  const [location] = useLocation();
  const [profileType, setProfileType] = useState<string>("user");

  useEffect(() => {
    const stored = localStorage.getItem("profileType") || "user";
    setProfileType(stored);
  }, []);

  const isBusinessPage = location.startsWith("/business-");
  const showHeader = location !== "/" && location !== "/admin" && location !== "/shadow" && !isBusinessPage && location !== "/favorites" && location !== "/inbox" && location !== "/map-discovery" && location !== "/wishlist" && location !== "/settings";
  const showBottomNav = location !== "/" && location !== "/admin" && location !== "/shadow" && !isBusinessPage && location !== "/settings";
  const showBusinessBottomNav = isBusinessPage;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {showHeader && <Header />}
      <Switch>
        <Route path="/" component={LandingFeed} />
        <Route path="/feed" component={Feed} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/inbox" component={Inbox} />
        <Route path="/map-discovery" component={MapDiscovery} />
        <Route path="/business/:id" component={BusinessDetail} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/profile" component={Profile} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/explore" component={Feed} />
        <Route path="/businesses" component={Feed} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/shadow" component={ShadowProfile} />
        <Route path="/business-feed" component={BusinessFeed} />
        <Route path="/business-dashboard" component={BusinessDashboard} />
        <Route path="/business-customers" component={BusinessCustomers} />
        <Route component={NotFound} />
      </Switch>
      {showBottomNav && <BottomNav />}
      {showBusinessBottomNav && <BusinessBottomNav />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
