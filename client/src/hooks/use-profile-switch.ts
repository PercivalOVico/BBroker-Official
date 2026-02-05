import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

// ============================================================================
// TYPES
// ============================================================================

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

interface SwitchProfileRequest {
  profileType: 'user' | 'business';
}

interface SwitchProfileResponse {
  success: boolean;
  currentProfile: 'user' | 'business';
  message: string;
  needsSetup?: boolean;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for profile switching functionality
 * Provides profile status and switching capabilities
 */
export function useProfileSwitch() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // ============================================================================
  // GET PROFILE STATUS
  // ============================================================================

  /**
   * Fetch current profile status
   * Auto-refetches when window regains focus
   */
  const {
    data: profileStatus,
    isLoading,
    error,
    refetch: refetchProfileStatus,
  } = useQuery<ProfileStatus>({
    queryKey: QUERY_KEYS.PROFILE_STATUS,
    queryFn: async () => {
      try {
        const response = await apiClient.get<ProfileStatus>(
          API_ENDPOINTS.USERS.PROFILE_STATUS
        );
        return response.data;
      } catch (error: any) {
        // If user is not authenticated, return default state
        if (error.response?.status === 401) {
          return {
            currentProfile: 'user' as const,
            hasBusinessProfile: false,
            businessProfile: null,
            user: null as any, // Will redirect to login
          };
        }
        throw error;
      }
    },
    // Refetch when window regains focus (user might have switched in another tab)
    refetchOnWindowFocus: true,
    // Keep data fresh
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // ============================================================================
  // SWITCH PROFILE MUTATION
  // ============================================================================

  /**
   * Mutation to switch between user and business profiles
   */
  const switchProfileMutation = useMutation<
    SwitchProfileResponse,
    Error,
    SwitchProfileRequest
  >({
    mutationFn: async ({ profileType }) => {
      const response = await apiClient.post<SwitchProfileResponse>(
        API_ENDPOINTS.USERS.SWITCH_PROFILE,
        { profileType }
      );
      return response.data;
    },
    onSuccess: (data) => {
      // If business setup is needed, don't show success message
      if (data.needsSetup) {
        return;
      }

      // Update the profile status cache immediately (optimistic update)
      queryClient.setQueryData<ProfileStatus>(
        QUERY_KEYS.PROFILE_STATUS,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            currentProfile: data.currentProfile,
          };
        }
      );

      // Invalidate all queries to refetch data with new profile context
      // This ensures all data is fresh for the new profile
      queryClient.invalidateQueries();

      // Show success toast
      toast({
        title: 'Profile Switched',
        description: `Switched to ${data.currentProfile} profile`,
      });

      // Optional: Reload the page to reset UI state
      // Comment this out if you want seamless switching without reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: any) => {
      // Check if it's a "needs setup" error
      if (error.response?.data?.needsSetup) {
        // This will be handled by the component (open setup wizard)
        return;
      }

      // Show error toast for other errors
      toast({
        variant: 'destructive',
        title: 'Switch Failed',
        description:
          error.response?.data?.message || 'Failed to switch profile',
      });
    },
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Check if currently in user mode
   */
  const isUserMode = profileStatus?.currentProfile === 'user';

  /**
   * Check if currently in business mode
   */
  const isBusinessMode = profileStatus?.currentProfile === 'business';

  /**
   * Check if user has a business profile set up
   */
  const hasBusinessProfile = profileStatus?.hasBusinessProfile || false;

  /**
   * Switch to user profile
   */
  const switchToUser = () => {
    switchProfileMutation.mutate({ profileType: 'user' });
  };

  /**
   * Switch to business profile
   */
  const switchToBusiness = () => {
    switchProfileMutation.mutate({ profileType: 'business' });
  };

  /**
   * Toggle between profiles
   */
  const toggleProfile = () => {
    if (isUserMode) {
      switchToBusiness();
    } else {
      switchToUser();
    }
  };

  // ============================================================================
  // RETURN API
  // ============================================================================

  return {
    // Profile status data
    profileStatus,
    currentProfile: profileStatus?.currentProfile || 'user',
    hasBusinessProfile,
    businessProfile: profileStatus?.businessProfile,
    user: profileStatus?.user,

    // Boolean helpers
    isUserMode,
    isBusinessMode,

    // Loading states
    isLoading,
    isSwitching: switchProfileMutation.isPending,
    error,

    // Actions
    switchProfile: switchProfileMutation.mutate,
    switchToUser,
    switchToBusiness,
    toggleProfile,
    refetchProfileStatus,

    // Mutation result for checking needsSetup
    switchResult: switchProfileMutation.data,
    switchError: switchProfileMutation.error,
  };
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

/*

// In a component:

import { useProfileSwitch } from '@/hooks/use-profile-switch';

function ProfileSwitcher() {
  const {
    currentProfile,
    hasBusinessProfile,
    isBusinessMode,
    isUserMode,
    isSwitching,
    switchToUser,
    switchToBusiness,
    toggleProfile,
  } = useProfileSwitch();

  if (isBusinessMode) {
    return (
      <button onClick={switchToUser} disabled={isSwitching}>
        {isSwitching ? 'Switching...' : 'Switch to User Mode'}
      </button>
    );
  }

  return (
    <button onClick={switchToBusiness} disabled={isSwitching}>
      {isSwitching ? 'Switching...' : 'Switch to Business Mode'}
    </button>
  );
}

// Or use toggle:
<button onClick={toggleProfile}>
  Switch to {isUserMode ? 'Business' : 'User'}
</button>

// Check if needs setup:
const { switchResult, switchError } = useProfileSwitch();

useEffect(() => {
  if (switchError?.response?.data?.needsSetup) {
    // Open business setup wizard
    setShowSetupWizard(true);
  }
}, [switchError]);

*/
