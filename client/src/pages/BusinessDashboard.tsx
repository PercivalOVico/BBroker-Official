import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, ShoppingCart, Plus, LogOut, Wallet, Clock, CheckCircle, AlertCircle, MessageSquare } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function BusinessDashboard() {
  const [, setLocation] = useLocation();

  const handleBackToFeed = () => {
    setLocation("/business-feed");
  };

  const businessStats = [
    { label: "Total Revenue", value: "$12,450", icon: Wallet, color: "from-green-500/10 to-green-500/5" },
    { label: "Active Orders", value: "24", icon: ShoppingCart, color: "from-blue-500/10 to-blue-500/5" },
    { label: "Engagement Rate", value: "8.4%", icon: TrendingUp, color: "from-purple-500/10 to-purple-500/5" },
    { label: "Followers", value: "2,340", icon: Users, color: "from-orange-500/10 to-orange-500/5" },
  ];

  const recentOrders = [
    { id: 1, customer: "Sarah Mitchell", product: "Premium Package", amount: "$299", status: "completed" },
    { id: 2, customer: "James Brown", product: "Service Bundle", amount: "$450", status: "processing" },
    { id: 3, customer: "Lisa Chen", product: "Custom Request", amount: "$650", status: "pending" },
    { id: 4, customer: "Tom Wilson", product: "Deluxe Plan", amount: "$399", status: "completed" },
  ];

  const campaigns = [
    { name: "Summer Sale 2024", reach: "15.2K", conversions: 234, roi: "245%", status: "active" },
    { name: "Flash Deal Friday", reach: "8.9K", conversions: 156, roi: "189%", status: "active" },
    { name: "Holiday Bundle", reach: "12.4K", conversions: 342, roi: "312%", status: "completed" },
  ];

  const walletData = {
    balance: "$5,240.50",
    pendingPayout: "$1,240.00",
    totalEarned: "$25,840",
  };

  const customerRequests = [
    { id: 1, type: "Collaboration", from: "Tech Startup Inc", status: "pending", date: "1 hour ago" },
    { id: 2, type: "Partnership", from: "Local Marketing Agency", status: "pending", date: "3 hours ago" },
    { id: 3, type: "Feature Request", from: "Customer Sarah", status: "reviewing", date: "5 hours ago" },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "processing": return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "pending": return "bg-orange-500/20 text-orange-600 dark:text-orange-400";
      case "active": return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "reviewing": return "bg-purple-500/20 text-purple-600 dark:text-purple-400";
      default: return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              📊
            </div>
            <div>
              <h1 className="font-bold text-xl">Business Analytics Dashboard</h1>
              <p className="text-xs text-muted-foreground">Track engagement, orders, campaigns & wallet</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBackToFeed}
            data-testid="button-back-to-feed"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {businessStats.map((stat, idx) => {
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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Orders Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Orders</h2>
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  New Order
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-2 font-semibold">Customer</th>
                      <th className="text-left py-3 px-2 font-semibold">Product</th>
                      <th className="text-left py-3 px-2 font-semibold">Amount</th>
                      <th className="text-left py-3 px-2 font-semibold">Status</th>
                      <th className="text-left py-3 px-2 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="py-3 px-2">{order.customer}</td>
                        <td className="py-3 px-2">{order.product}</td>
                        <td className="py-3 px-2 font-semibold">{order.amount}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Button size="sm" variant="outline" data-testid={`button-order-${order.id}`}>View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Wallet */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Wallet size={20} />
                Wallet
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                  <p className="text-3xl font-bold text-primary">{walletData.balance}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-secondary/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Pending Payout</p>
                    <p className="font-bold text-sm">{walletData.pendingPayout}</p>
                  </div>
                  <div className="bg-secondary/50 p-3 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total Earned</p>
                    <p className="font-bold text-sm">{walletData.totalEarned}</p>
                  </div>
                </div>
                <Button className="w-full gap-2">
                  <CheckCircle size={16} />
                  Request Payout
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Campaigns Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Marketing Campaigns</h2>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                New Campaign
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((campaign, idx) => (
                <div key={idx} className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-sm">{campaign.name}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reach</span>
                      <span className="font-semibold">{campaign.reach}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Conversions</span>
                      <span className="font-semibold">{campaign.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROI</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{campaign.roi}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">Edit Campaign</Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Customer Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Business Requests & Messages</h2>
              <span className="text-sm text-muted-foreground">{customerRequests.length} pending</span>
            </div>
            <div className="space-y-3">
              {customerRequests.map((req) => (
                <div key={req.id} className="p-4 border border-border/50 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{req.type}</p>
                      <p className="text-xs text-muted-foreground">{req.from}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{req.date}</p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare size={14} />
                    Respond
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
