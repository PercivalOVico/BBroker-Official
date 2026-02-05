import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, BarChart3, Grid3x3, Store, LogOut, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setLocation("/");
  };

  const stats = [
    { label: "Total Users", value: "2,450", icon: Users, color: "from-blue-500/10 to-blue-500/5" },
    { label: "Active Feeds", value: "856", icon: Grid3x3, color: "from-purple-500/10 to-purple-500/5" },
    { label: "Businesses", value: "340", icon: Store, color: "from-green-500/10 to-green-500/5" },
    { label: "Total Revenue", value: "$45.2K", icon: BarChart3, color: "from-orange-500/10 to-orange-500/5" },
  ];

  const menuItems = [
    { label: "Manage Users", icon: Users, action: () => {} },
    { label: "View Analytics", icon: BarChart3, action: () => {} },
    { label: "Feed Management", icon: Grid3x3, action: () => {} },
    { label: "Business Profiles", icon: Store, action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              ⚙️
            </div>
            <div>
              <h1 className="font-bold text-xl">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">System Administration Panel</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${stat.color} p-6 border-0`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="text-primary/30" size={32} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Admin Controls</h2>
              <div className="space-y-2">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-10"
                      onClick={item.action}
                      data-testid={`button-admin-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium">New user registered</p>
                  <p className="text-muted-foreground text-xs">5 minutes ago</p>
                </div>
                <div className="border-t pt-3">
                  <p className="font-medium text-sm">New business profile created</p>
                  <p className="text-muted-foreground text-xs">12 minutes ago</p>
                </div>
                <div className="border-t pt-3">
                  <p className="font-medium text-sm">Feed post submitted</p>
                  <p className="text-muted-foreground text-xs">28 minutes ago</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Links */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">System Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Database</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">API Server</p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Frontend</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-secondary/50">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Cache</p>
              <p className="text-xs text-muted-foreground">97% Hit</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
