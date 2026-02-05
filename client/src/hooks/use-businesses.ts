import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// GET /api/businesses
export function useBusinesses(params: { lat?: number; lng?: number; radius?: number } = {}) {
  return useQuery({
    queryKey: [api.businesses.list.path, params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      if (params.lat) queryParams.lat = String(params.lat);
      if (params.lng) queryParams.lng = String(params.lng);
      if (params.radius) queryParams.radius = String(params.radius);
      
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${api.businesses.list.path}?${queryString}`;

      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error('Failed to fetch businesses');
      return api.businesses.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/businesses/:id
export function useBusiness(id: number) {
  return useQuery({
    queryKey: [api.businesses.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.businesses.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch business');
      return api.businesses.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
