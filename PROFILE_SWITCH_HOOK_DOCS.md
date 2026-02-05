# useProfileSwitch Hook - Documentation

## Overview

The `useProfileSwitch` hook provides complete profile switching functionality using React Query for state management and caching.

## Features

✅ **Auto-fetch profile status** on mount  
✅ **Switch between user/business** with one function call  
✅ **Loading states** for all operations  
✅ **Error handling** with toast notifications  
✅ **Optimistic updates** for instant UI feedback  
✅ **Cache invalidation** to keep data fresh  
✅ **TypeScript types** for all data  
✅ **Refetch on focus** to stay in sync  

---

## Installation

Already installed! The hook is at:
```
client/src/hooks/use-profile-switch.ts
```

---

## Basic Usage

```typescript
import { useProfileSwitch } from '@/hooks/use-profile-switch';

function MyComponent() {
  const {
    currentProfile,
    hasBusinessProfile,
    isBusinessMode,
    switchToBusiness,
    isSwitching,
  } = useProfileSwitch();

  return (
    <div>
      <p>Current Profile: {currentProfile}</p>
      
      {hasBusinessProfile && (
        <button 
          onClick={switchToBusiness} 
          disabled={isSwitching}
        >
          {isSwitching ? 'Switching...' : 'Switch to Business'}
        </button>
      )}
    </div>
  );
}
```

---

## API Reference

### Return Values

#### Data Properties

**`profileStatus`**: `ProfileStatus | undefined`
- Complete profile status object
- Undefined while loading

**`currentProfile`**: `'user' | 'business'`
- Current active profile
- Defaults to 'user' if loading

**`hasBusinessProfile`**: `boolean`
- Whether user has a business profile set up
- False if not set up or loading

**`businessProfile`**: `BusinessProfile | null`
- Business profile data
- Null if no business or in user mode

**`user`**: `User | undefined`
- Current user information
- Includes id, username, email, etc.

#### Boolean Helpers

**`isUserMode`**: `boolean`
- True if currentProfile === 'user'

**`isBusinessMode`**: `boolean`
- True if currentProfile === 'business'

#### Loading States

**`isLoading`**: `boolean`
- True while fetching profile status

**`isSwitching`**: `boolean`
- True while switching profiles

**`error`**: `Error | null`
- Error from profile status fetch

#### Actions

**`switchProfile(request: { profileType: 'user' | 'business' })`**
- Low-level switch function
- Triggers mutation

**`switchToUser()`**
- Quick helper to switch to user mode

**`switchToBusiness()`**
- Quick helper to switch to business mode

**`toggleProfile()`**
- Toggle between current and other profile

**`refetchProfileStatus()`**
- Manually refetch profile status

#### Mutation Results

**`switchResult`**: `SwitchProfileResponse | undefined`
- Result from last switch attempt
- Check for needsSetup flag

**`switchError`**: `Error | null`
- Error from switch attempt
- Check response.data.needsSetup

---

## Common Patterns

### 1. Profile Switcher Button

```typescript
function ProfileButton() {
  const { 
    isBusinessMode, 
    toggleProfile, 
    isSwitching 
  } = useProfileSwitch();

  return (
    <button onClick={toggleProfile} disabled={isSwitching}>
      {isSwitching 
        ? 'Switching...' 
        : `Switch to ${isBusinessMode ? 'User' : 'Business'}`
      }
    </button>
  );
}
```

### 2. Check Business Profile Exists

```typescript
function BusinessFeature() {
  const { hasBusinessProfile, switchToBusiness } = useProfileSwitch();

  if (!hasBusinessProfile) {
    return (
      <div>
        <p>You need a business profile to use this feature.</p>
        <button onClick={() => {/* Open setup wizard */}}>
          Set Up Business
        </button>
      </div>
    );
  }

  return <div>Business features here...</div>;
}
```

### 3. Show Business Info

```typescript
function BusinessInfo() {
  const { businessProfile, isBusinessMode } = useProfileSwitch();

  if (!isBusinessMode || !businessProfile) {
    return <p>Not in business mode</p>;
  }

  return (
    <div>
      <h2>{businessProfile.businessName}</h2>
      <p>{businessProfile.description}</p>
      <p>Rating: {businessProfile.rating} ⭐</p>
    </div>
  );
}
```

### 4. Handle Setup Needed

```typescript
function SwitchHandler() {
  const { switchToBusiness, switchError } = useProfileSwitch();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (switchError?.response?.data?.needsSetup) {
      setShowSetup(true);
    }
  }, [switchError]);

  if (showSetup) {
    return <BusinessSetupWizard />;
  }

  return (
    <button onClick={switchToBusiness}>
      Switch to Business
    </button>
  );
}
```

### 5. Conditional Rendering Based on Mode

```typescript
function Dashboard() {
  const { isUserMode, isBusinessMode } = useProfileSwitch();

  return (
    <div>
      {isUserMode && <UserDashboard />}
      {isBusinessMode && <BusinessDashboard />}
    </div>
  );
}
```

### 6. Loading State

```typescript
function ProfileDisplay() {
  const { profileStatus, isLoading } = useProfileSwitch();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <p>Profile: {profileStatus?.currentProfile}</p>
    </div>
  );
}
```

---

## TypeScript Types

```typescript
interface ProfileStatus {
  currentProfile: 'user' | 'business';
  hasBusinessProfile: boolean;
  businessProfile: BusinessProfile | null;
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string | null;
    profilePhoto: string | null;
  };
}

interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  mainCategory: string;
  status: string;
  rating: string;
  reviewCount: number;
  followerCount: number;
  isVerified: boolean;
  createdAt: string;
}
```

---

## React Query Integration

### Query Key
```typescript
QUERY_KEYS.PROFILE_STATUS = ['user', 'profile-status']
```

### Cache Behavior
- **Stale Time**: 5 minutes
- **Refetch on Focus**: Yes (keeps sync across tabs)
- **Auto-refetch**: On window focus
- **Cache Invalidation**: After successful switch

### Optimistic Updates
When switching profiles, the cache is updated immediately before the server confirms, providing instant UI feedback.

---

## Error Handling

### Automatic Error Handling

The hook automatically handles:
- ✅ 401 Unauthorized → Returns default state
- ✅ Network errors → Shows toast
- ✅ Switch failures → Shows toast
- ✅ Missing business → Returns needsSetup flag

### Manual Error Handling

```typescript
function Component() {
  const { switchError, error } = useProfileSwitch();

  // Check profile fetch error
  if (error) {
    return <div>Error loading profile: {error.message}</div>;
  }

  // Check switch error
  if (switchError) {
    const needsSetup = switchError.response?.data?.needsSetup;
    if (needsSetup) {
      return <BusinessSetupPrompt />;
    }
    return <div>Switch failed: {switchError.message}</div>;
  }

  return <div>All good!</div>;
}
```

---

## Performance Considerations

### Caching
Profile status is cached for 5 minutes, reducing unnecessary API calls.

### Refetch Strategy
- Refetches on window focus (stays in sync)
- Refetches after successful switch
- Does NOT refetch on mount if cache is fresh

### Optimistic Updates
UI updates immediately on switch, then confirms with server.

---

## Testing

### With React Testing Library

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProfileSwitch } from './use-profile-switch';

test('fetches profile status', async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useProfileSwitch(), { wrapper });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.currentProfile).toBeDefined();
});
```

---

## Best Practices

### ✅ DO

- Use boolean helpers (isUserMode, isBusinessMode) instead of checking currentProfile directly
- Check hasBusinessProfile before allowing business features
- Handle the needsSetup case when switching to business
- Show loading states (isSwitching) on buttons
- Use toggleProfile() for simple switch buttons

### ❌ DON'T

- Don't call switchProfile manually - use helper functions
- Don't forget to disable buttons while isSwitching
- Don't access profileStatus directly without checking isLoading
- Don't try to switch to business without checking hasBusinessProfile
- Don't forget to handle the setup needed case

---

## Examples

### Full Component Example

See: `client/src/components/ProfileSwitcher.tsx`

Two components provided:
1. **ProfileSwitcher** - Full card-based UI with status
2. **ProfileSwitcherSimple** - Compact button for navbar

---

## Troubleshooting

### Issue: Hook returns undefined data
**Solution**: Make sure you're using the hook inside a component wrapped with QueryClientProvider

### Issue: Switch doesn't work
**Solution**: Check backend is running and `/api/users/switch-profile` endpoint is accessible

### Issue: Business profile not showing
**Solution**: Ensure user has completed business setup wizard

### Issue: Infinite loading
**Solution**: Check network tab for API errors, ensure DATABASE_URL is set

### Issue: needsSetup not detected
**Solution**: Access via `switchError?.response?.data?.needsSetup`

---

## Next Steps

After Session 4:
- ✅ Hook is ready to use
- Session 5: Create Settings page with ProfileSwitcher
- Session 6: Add profile switch modal UI
- Session 7: Business setup wizard (handles needsSetup)

---

**The hook is production-ready!** 🚀
