# API Client Usage Guide

## Overview

The new API client (`client/src/lib/api.ts`) provides a centralized, robust way to make API calls with built-in:
- ✅ Authentication (automatic token attachment)
- ✅ Error handling (401, 403, 404, 500, etc.)
- ✅ Retry logic
- ✅ Request/response interceptors
- ✅ Toast notifications for errors
- ✅ File upload/download support

## Basic Usage

### Import the API client:
```typescript
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';
```

### Making requests:

#### GET Request:
```typescript
// Get current user
const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
const user = response.data;

// Get business by ID
const response = await apiClient.get(API_ENDPOINTS.BUSINESSES.BY_ID('123'));
const business = response.data;

// With query parameters
const response = await apiClient.get('/api/businesses', {
  params: {
    category: 'restaurant',
    limit: 20
  }
});
```

#### POST Request:
```typescript
// Register user
const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
  username: 'john',
  email: 'john@example.com',
  password: 'secret123'
});

// Create post
const response = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, {
  content: 'Hello world!',
  media: ['image1.jpg']
});
```

#### PUT/PATCH Request:
```typescript
// Update user profile
const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE, {
  bio: 'New bio text',
  profilePhoto: 'photo.jpg'
});
```

#### DELETE Request:
```typescript
// Delete post
await apiClient.delete(API_ENDPOINTS.POSTS.DELETE('post-id-123'));
```

## Using with React Query

### Example Hook:
```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';

// GET with useQuery
export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
      return response.data;
    }
  });
}

// POST with useMutation
export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { content: string; media?: string[] }) => {
      const response = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate feed to refetch with new post
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FEED });
    }
  });
}
```

## Authentication

### Login:
```typescript
// Login and save token
const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
  username: 'john',
  password: 'secret'
});

// If backend returns a JWT token:
if (response.data.token) {
  apiClient.setAuthToken(response.data.token);
}
```

### Logout:
```typescript
await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
apiClient.clearAuthToken();
```

### Check Authentication:
```typescript
if (apiClient.isAuthenticated()) {
  // User is logged in
}
```

## File Upload

### Upload Image:
```typescript
const formData = new FormData();
formData.append('image', file);

const response = await apiClient.upload(
  API_ENDPOINTS.UPLOAD.IMAGE,
  formData,
  (progress) => {
    console.log(`Upload progress: ${progress}%`);
  }
);

const imageUrl = response.data.url;
```

## File Download:
```typescript
await apiClient.download(
  '/api/analytics/business/123/export',
  'analytics-report.pdf'
);
```

## Error Handling

The API client automatically handles errors:

- **401 Unauthorized**: Redirects to login, shows toast
- **403 Forbidden**: Shows "Access denied" toast
- **404 Not Found**: Shows "Not found" toast
- **422 Validation Error**: Passes through for component handling
- **429 Rate Limit**: Shows "Too many requests" toast
- **500 Server Error**: Shows "Server error" toast
- **Network Error**: Shows "Check your connection" toast

### Manual Error Handling:
```typescript
try {
  const response = await apiClient.post('/api/bookings', bookingData);
  // Success
} catch (error) {
  // Error already shown via toast
  // You can add additional handling here
  console.error('Booking failed:', error);
}
```

## Migration from Old API Calls

### Before (using fetch):
```typescript
const res = await fetch('/api/users/me', {
  credentials: 'include'
});
if (!res.ok) throw new Error('Failed');
const user = await res.json();
```

### After (using apiClient):
```typescript
const response = await apiClient.get(API_ENDPOINTS.USERS.ME);
const user = response.data;
```

### Before (in React Query):
```typescript
queryFn: async () => {
  const res = await fetch('/api/feed');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}
```

### After:
```typescript
queryFn: async () => {
  const response = await apiClient.get(API_ENDPOINTS.FEED.MAIN);
  return response.data;
}
```

## Constants Usage

Instead of hardcoding URLs:
```typescript
// ❌ Bad
await apiClient.get('/api/businesses/123');

// ✅ Good
await apiClient.get(API_ENDPOINTS.BUSINESSES.BY_ID('123'));
```

Benefits:
- Type safety
- Autocomplete in IDE
- Easy refactoring
- Centralized URL management

## Toast Notifications

The API client automatically shows toasts for errors. To listen for toast events in your UI:

```typescript
// In your Toast component or App.tsx
useEffect(() => {
  const handleToast = (event: CustomEvent) => {
    const { message, type } = event.detail;
    toast({
      title: type === 'error' ? 'Error' : 'Info',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };
  
  window.addEventListener('show-toast', handleToast as EventListener);
  return () => window.removeEventListener('show-toast', handleToast as EventListener);
}, []);
```

## Best Practices

1. **Always use API_ENDPOINTS constants** - Don't hardcode URLs
2. **Use QUERY_KEYS for React Query** - Consistent cache management
3. **Handle loading states** - Show spinners during requests
4. **Use TypeScript types** - Define response types for type safety
5. **Invalidate queries** - After mutations, invalidate affected queries

## Example: Complete Feature

```typescript
// hooks/use-profile-switch.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';

interface ProfileStatus {
  currentProfile: 'user' | 'business';
  hasBusinessProfile: boolean;
}

export function useProfileSwitch() {
  const queryClient = useQueryClient();
  
  // Get profile status
  const { data: profileStatus, isLoading } = useQuery({
    queryKey: QUERY_KEYS.PROFILE_STATUS,
    queryFn: async () => {
      const response = await apiClient.get<ProfileStatus>(
        API_ENDPOINTS.USERS.PROFILE_STATUS
      );
      return response.data;
    }
  });
  
  // Switch profile
  const switchProfile = useMutation({
    mutationFn: async (profileType: 'user' | 'business') => {
      const response = await apiClient.post(
        API_ENDPOINTS.USERS.SWITCH_PROFILE,
        { profileType }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all queries to refetch with new profile context
      queryClient.invalidateQueries();
    }
  });
  
  return {
    currentProfile: profileStatus?.currentProfile,
    hasBusinessProfile: profileStatus?.hasBusinessProfile,
    isLoading,
    switchProfile: switchProfile.mutate,
    isSwitching: switchProfile.isPending
  };
}
```

## Environment Variables

Set in `.env` file:
```
VITE_API_URL=https://api.bbroker.com  # Only needed if API is on different domain
```

In development, API is on same origin, so no URL needed.

---

**You're all set!** The API client is ready to use throughout your application. 🚀
