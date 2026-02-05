import { z } from 'zod';
import { insertBusinessSchema, insertProductSchema, insertPostSchema, businesses, products, posts, users } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Feed & Discovery
  feed: {
    list: {
      method: 'GET' as const,
      path: '/api/feed',
      input: z.object({
        lat: z.coerce.number().optional(),
        lng: z.coerce.number().optional(),
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.object({
          type: z.enum(['business', 'product', 'post']),
          data: z.union([
            z.custom<typeof businesses.$inferSelect>(),
            z.custom<typeof products.$inferSelect>(),
            z.custom<typeof posts.$inferSelect>(),
          ])
        })),
      },
    },
  },
  // Businesses
  businesses: {
    list: {
      method: 'GET' as const,
      path: '/api/businesses',
      input: z.object({
        lat: z.coerce.number().optional(),
        lng: z.coerce.number().optional(),
        radius: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof businesses.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/businesses/:id',
      responses: {
        200: z.custom<typeof businesses.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  // Products
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  // Auth (Mock)
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: z.object({ username: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
