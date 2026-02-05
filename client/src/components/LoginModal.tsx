import { useState } from "react";
import { X, ArrowRight, Loader2, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { apiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [isPending, setIsPending] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        variant: 'destructive',
        title: 'Username required',
        description: 'Please enter a username',
      });
      return;
    }
    
    setIsPending(true);

    try {
      // Call the backend login/register endpoint
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        username: username.trim(),
      });

      const user = response.data;

      // Store user data in localStorage
      localStorage.setItem('userId', user.id);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userRole', 'user'); // Default to user role

      // Show success toast
      toast({
        title: isLogin ? 'Welcome back!' : 'Account created!',
        description: `Logged in as ${user.username}`,
      });

      // Close modal
      onClose();

      // Redirect to feed
      setLocation('/feed');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsPending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-background rounded-2xl w-full max-w-md relative overflow-hidden border border-border shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors z-10"
          disabled={isPending}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 border-b border-border">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 bg-primary mx-auto rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3">
              <span className="text-4xl font-display font-bold text-white">B</span>
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              {isLogin ? 'Welcome Back' : 'Join BBroker'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin 
                ? 'Login to continue your journey' 
                : 'Create an account to get started'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="username"
                  placeholder="Enter your username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 pl-10 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary/20 transition-all"
                  disabled={isPending}
                  autoFocus
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isLogin 
                  ? 'Enter your username to continue' 
                  : 'Choose a unique username (will auto-create account)'}
              </p>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              disabled={!username.trim() || isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={isPending}
            >
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <span className="text-primary font-semibold">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="text-primary font-semibold">Login</span>
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Start as a User
                </p>
                <p className="text-xs">
                  You can switch to Business mode anytime from your profile settings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to BBroker's Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
