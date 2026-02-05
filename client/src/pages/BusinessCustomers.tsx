import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageSquare, BarChart3, Plus, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessCustomers() {
  const [activeTab, setActiveTab] = useState("orders");

  const businessData = {
    engagement: { views: 12450, likes: 892, comments: 145, shares: 34 },
    stats: [
      { label: "Today's Views", value: "1,240", color: "from-blue-500/10 to-blue-500/5" },
      { label: "This Week Sales", value: "$2,840", color: "from-green-500/10 to-green-500/5" },
      { label: "Pending Orders", value: "12", color: "from-orange-500/10 to-orange-500/5" },
      { label: "Followers", value: "1,240", color: "from-purple-500/10 to-purple-500/5" },
    ]
  };

  const pendingOrders = [
    { id: 1, customer: "Sarah Mitchell", product: "Premium Package", amount: "$299", status: "pending" },
    { id: 2, customer: "James Brown", product: "Service Bundle", amount: "$450", status: "pending" },
    { id: 3, customer: "Lisa Chen", product: "Custom Request", amount: "$650", status: "processing" },
  ];

  const businessRequests = [
    { id: 1, type: "Collaboration", from: "Tech Startup Inc", date: "1 hour ago" },
    { id: 2, type: "Partnership", from: "Local Marketing Agency", date: "3 hours ago" },
    { id: 3, type: "Feature Request", from: "Customer John", date: "1 day ago" },
  ];

  const campaigns = [
    { id: 1, name: "Summer Promo", reach: "15.2K", conversions: "234", status: "active" },
    { id: 2, name: "New Year Deal", reach: "8.9K", conversions: "112", status: "active" },
    { id: 3, name: "Holiday Bundle", reach: "12.4K", conversions: "89", status: "scheduled" },
  ];

  const recentPosts = [
    { id: 1, title: "Summer Collection Launch", views: 2450, likes: 234, timestamp: "2 hours ago" },
    { id: 2, title: "New Partnership Announcement", views: 1890, likes: 156, timestamp: "5 hours ago" },
    { id: 3, title: "Flash Sale Extended", views: 3210, likes: 412, timestamp: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg">
              B
            </div>
            <div>
              <h1 className="text-lg font-bold">Customers</h1>
              <p className="text-xs text-muted-foreground">Manage orders & requests</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
              <SearchIcon size={18} />
            </div>
            <input
              type="text"
              placeholder="Search customers, orders..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-secondary border-none text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              data-testid="input-search-customers"
            />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {businessData.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${stat.color} p-4 border-0`}>
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { id: "orders", label: "Orders", icon: ShoppingCart },
            { id: "requests", label: "Requests", icon: MessageSquare },
            { id: "campaigns", label: "Campaigns", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
                data-testid={`button-tab-${tab.id}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pending Orders</h2>
              <Button data-testid="button-new-order">
                <Plus size={18} className="mr-2" />
                New Order
              </Button>
            </div>
            {pendingOrders.map((order) => (
              <Card key={order.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{order.customer}</h3>
                    <p className="text-sm text-muted-foreground">{order.product}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === "pending" ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">{order.amount}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" data-testid={`button-view-order-${order.id}`}>View</Button>
                    <Button size="sm" data-testid={`button-accept-order-${order.id}`}>Accept</Button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {activeTab === "requests" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold mb-4">Business Requests</h2>
            {businessRequests.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{request.type}</h3>
                    <p className="text-sm text-muted-foreground">{request.from}</p>
                    <p className="text-xs text-muted-foreground mt-2">{request.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" data-testid={`button-decline-request-${request.id}`}>Decline</Button>
                    <Button size="sm" data-testid={`button-approve-request-${request.id}`}>Approve</Button>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {activeTab === "campaigns" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Marketing Campaigns</h2>
              <Button data-testid="button-new-campaign">
                <Plus size={18} className="mr-2" />
                New Campaign
              </Button>
            </div>
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Reach: {campaign.reach}</span>
                      <span>Conversions: {campaign.conversions}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    campaign.status === "active" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                <Button size="sm" variant="outline" data-testid={`button-edit-campaign-${campaign.id}`}>Edit</Button>
              </Card>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
