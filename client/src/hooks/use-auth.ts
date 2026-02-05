import { useMutation } from "@tanstack/react-query";
import { api, type LoginRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useLogin() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await fetch(api.auth.login.path, {
        method: api.auth.login.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error('Login failed');
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      toast({
        title: `Welcome back, ${user.displayName}!`,
        description: "You are now logged in.",
      });
      setLocation("/feed");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please check your username and try again.",
      });
    },
  });
}
