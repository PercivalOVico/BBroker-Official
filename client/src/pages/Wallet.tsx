import { motion } from "framer-motion";
import { 
  Bell, 
  Plus, 
  Home, 
  BookOpen, 
  Globe, 
  Building2,
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCcw,
  FileText,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Wallet() {
  const financialPlans = [
    { icon: Home, label: "House", color: "bg-blue-100 text-blue-600" },
    { icon: BookOpen, label: "Education", color: "bg-orange-100 text-orange-600" },
    { icon: Globe, label: "Holiday", color: "bg-green-100 text-green-600" },
    { icon: Building2, label: "Apartment", color: "bg-purple-100 text-purple-600" },
  ];

  const transactions = [
    { title: "Dribbble Pro", date: "31 Mar 2022", amount: "- $68.21", icon: "🏀", category: "Design" },
    { title: "Restaurant Bill", date: "7 Jul 2022", amount: "- $32", icon: "🍱", category: "Food" },
    { title: "Youtube Premium", date: "11 Oct 2022", amount: "- $93.03", icon: "📺", category: "Entertainment" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-24 lg:pt-32 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Main Balance (lg:col-span-4) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Removed Header / Profile as requested */}

            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-[#1e463a] to-[#2d6654] text-white p-8 rounded-[40px] overflow-hidden relative border-none shadow-2xl group cursor-pointer">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <p className="text-sm text-white/70 font-medium">My Available Balance</p>
                      <h2 className="text-5xl font-bold tracking-tight">$12,253.70</h2>
                    </div>
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <WalletIcon className="text-white" size={28} />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1e463a] bg-white/20 backdrop-blur-sm" />
                      ))}
                    </div>
                    <p className="text-xs text-white/60 font-medium">+2 cards linked</p>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full -ml-16 -mb-16 blur-3xl" />
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Pay", icon: ArrowDownLeft, color: "bg-blue-500/10 text-blue-500" },
                { label: "Top up", icon: Plus, color: "bg-primary/10 text-primary" },
                { label: "Transfer", icon: RefreshCcw, color: "bg-orange-500/10 text-orange-500" },
                { label: "Request", icon: FileText, color: "bg-purple-500/10 text-purple-500" },
              ].map((action) => (
                <div key={action.label} className="flex flex-col items-center gap-3 group">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className={cn(
                      "h-16 w-16 rounded-[24px] transition-all duration-300 hover-elevate active-elevate-2 shadow-sm border-none",
                      action.color
                    )}
                  >
                    <action.icon size={26} />
                  </Button>
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Plans & Transactions (lg:col-span-8) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Financial Plan Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-bold tracking-tight">Financial Plan</h3>
                <Button variant="ghost" size="sm" className="text-muted-foreground font-bold hover:text-primary transition-colors">Manage</Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                <div className="flex flex-col items-center gap-3">
                  <Button 
                    variant="outline"
                    className="h-16 w-16 rounded-[24px] border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300"
                  >
                    <Plus size={28} />
                  </Button>
                  <span className="text-xs font-bold text-muted-foreground">Add Plan</span>
                </div>
                {financialPlans.map((plan) => (
                  <motion.div 
                    key={plan.label} 
                    whileHover={{ y: -5 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className={cn("h-16 w-16 rounded-[24px] flex items-center justify-center shadow-lg transition-shadow hover:shadow-xl", plan.color)}>
                      <plan.icon size={28} />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{plan.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
                <Button variant="ghost" className="text-primary font-bold p-0 h-auto hover:bg-transparent transition-colors">See All</Button>
              </div>
              <div className="grid gap-4">
                {transactions.map((t, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-5 rounded-[28px] bg-secondary/20 hover:bg-secondary/40 transition-all duration-300 cursor-pointer group border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-background flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform duration-300">
                        {t.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-base">{t.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{t.date}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{t.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="block font-black text-base text-foreground">{t.amount}</span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase">Completed</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-2">
                        <ChevronRight size={20} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
