import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/feed
export function useFeed(params: { lat?: number; lng?: number; category?: string } = {}) {
  return useQuery({
    queryKey: [api.feed.list.path, params],
    queryFn: async () => {
      // Build query string manually since URLSearchParams handles undefined poorly in some envs
      const queryParams: Record<string, string> = {};
      if (params.lat) queryParams.lat = String(params.lat);
      if (params.lng) queryParams.lng = String(params.lng);
      if (params.category) queryParams.category = params.category;
      
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${api.feed.list.path}?${queryString}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch feed');
      
      // We manually parse here because the Zod union type is complex
      return api.feed.list.responses[200].parse(await res.json());
    },
  });
}
