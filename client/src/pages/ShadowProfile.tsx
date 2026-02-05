import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Eye, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ShadowProfile() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setLocation("/");
  };

  const recentActivity = [
    { user: "john_doe", action: "Posted feed", time: "5 min ago", status: "normal" },
    { user: "jane_smith", action: "Created business", time: "12 min ago", status: "normal" },
    { user: "alex_business", action: "Made large purchase", time: "28 min ago", status: "flagged" },
    { user: "mike_trader", action: "Posted campaign", time: "45 min ago", status: "normal" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              👁️
            </div>
            <div>
              <h1 className="font-bold text-xl">Shadow Profile</h1>
              <p className="text-xs text-muted-foreground">Monitoring & Moderation Panel</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleLogout}
            data-testid="button-logout-shadow"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Monitoring Users</p>
                <p className="text-3xl font-bold">2,450</p>
              </div>
              <Eye className="text-primary/30" size={32} />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-6 border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Flagged Content</p>
                <p className="text-3xl font-bold">23</p>
              </div>
              <AlertCircle className="text-orange-500/30" size={32} />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 border-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Active Sessions</p>
                <p className="text-3xl font-bold">1,847</p>
              </div>
              <Activity className="text-green-500/30" size={32} />
            </div>
          </Card>
        </motion.div>

        {/* Activity Monitor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Recent System Activity</h2>
            <div className="space-y-2">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm"><span className="text-primary">{item.user}</span> {item.action}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'flagged' 
                      ? 'bg-red-500/20 text-red-600 dark:text-red-400' 
                      : 'bg-green-500/20 text-green-600 dark:text-green-400'
                  }`}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Moderation Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Moderation Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start gap-2 h-10">
                <AlertCircle size={18} />
                Review Flagged Content
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-10">
                <Eye size={18} />
                Monitor Live Activity
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-10">
                <Activity size={18} />
                View User Reports
              </Button>
              <Button variant="outline" className="justify-start gap-2 h-10">
                <AlertCircle size={18} />
                Manage Violations
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
