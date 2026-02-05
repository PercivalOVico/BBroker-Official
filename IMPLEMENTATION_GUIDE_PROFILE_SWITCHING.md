# Profile Switching Implementation Guide

## Overview
This guide provides step-by-step implementation for the dual-profile system (User ↔ Business).

---

## 1. Database Setup

### Update users table (already in schema-complete.ts):
```typescript
currentProfile: profileTypeEnum("current_profile").notNull().default('user'),
hasBusinessProfile: boolean("has_business_profile").notNull().default(false),
```

### Ensure businesses table has userId reference:
```typescript
userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
```

---

## 2. Backend API Endpoints

### File: `server/controllers/profile.controller.ts`

```typescript
import { Request, Response } from 'express';
import { db } from '../db';
import { users, businesses } from '../../shared/schema-complete';
import { eq } from 'drizzle-orm';

export class ProfileController {
  
  // Get current profile status
  static async getProfileStatus(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user[0]) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      let businessProfile = null;
      if (user[0].hasBusinessProfile) {
        const business = await db.select()
          .from(businesses)
          .where(eq(businesses.userId, userId))
          .limit(1);
        businessProfile = business[0] || null;
      }
      
      return res.json({
        currentProfile: user[0].currentProfile,
        hasBusinessProfile: user[0].hasBusinessProfile,
        businessProfile: businessProfile
      });
    } catch (error) {
      console.error('Get profile status error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Switch profile
  static async switchProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { profileType } = req.body; // 'user' or 'business'
      
      if (!['user', 'business'].includes(profileType)) {
        return res.status(400).json({ error: 'Invalid profile type' });
      }
      
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user[0]) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Check if switching to business but no business profile exists
      if (profileType === 'business' && !user[0].hasBusinessProfile) {
        return res.status(400).json({ 
          error: 'No business profile found',
          needsSetup: true 
        });
      }
      
      // Update current profile
      await db.update(users)
        .set({ 
          currentProfile: profileType,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      // If switching to business, update business lastActiveAt
      if (profileType === 'business') {
        await db.update(businesses)
          .set({ lastActiveAt: new Date() })
          .where(eq(businesses.userId, userId));
      }
      
      return res.json({ 
        success: true, 
        currentProfile: profileType 
      });
    } catch (error) {
      console.error('Switch profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  // Create business profile (setup wizard)
  static async createBusinessProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const {
        businessName,
        description,
        location,
        workingHours,
        mainCategory,
        affiliateCategory1,
        affiliateCategory2,
        affiliateCategory3,
        targetMarket,
        targetAgeRanges
      } = req.body;
      
      // Validate required fields
      if (!businessName || !description || !location || !workingHours || !mainCategory || !targetMarket || !targetAgeRanges) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Check if business profile already exists
      const existing = await db.select()
        .from(businesses)
        .where(eq(businesses.userId, userId))
        .limit(1);
      
      if (existing.length > 0) {
        return res.status(400).json({ error: 'Business profile already exists' });
      }
      
      // Create business profile
      const newBusiness = await db.insert(businesses).values({
        userId,
        businessName,
        description,
        location,
        workingHours,
        mainCategory,
        affiliateCategory1,
        affiliateCategory2,
        affiliateCategory3,
        targetMarket,
        targetAgeRanges,
        status: 'pending_verification',
        rating: '0',
        reviewCount: 0,
        followerCount: 0,
        viewCount: 0
      }).returning();
      
      // Update user to mark has business profile
      await db.update(users)
        .set({ 
          hasBusinessProfile: true,
          currentProfile: 'business',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      // Award BBT tokens for setup completion
      await awardTokens(userId, 420, 'Business profile setup completed');
      
      return res.json({ 
        success: true, 
        business: newBusiness[0],
        bbtAwarded: 420
      });
    } catch (error) {
      console.error('Create business profile error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Helper function (will be in wallet service)
async function awardTokens(userId: string, amount: number, description: string) {
  // Implementation in Part 2 (Wallet System)
  console.log(`Award ${amount} BBT to ${userId}: ${description}`);
}
```

### Add routes in `server/routes.ts`:

```typescript
import { ProfileController } from './controllers/profile.controller';

// In your Express app setup:
app.get('/api/users/profile-status', authenticate, ProfileController.getProfileStatus);
app.post('/api/users/switch-profile', authenticate, ProfileController.switchProfile);
app.post('/api/businesses/setup', authenticate, ProfileController.createBusinessProfile);
```

---

## 3. Frontend Hook

### File: `client/src/hooks/use-profile-switch.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

interface ProfileStatus {
  currentProfile: 'user' | 'business';
  hasBusinessProfile: boolean;
  businessProfile: any | null;
}

export function useProfileSwitch() {
  const queryClient = useQueryClient();
  
  // Get current profile status
  const { data: profileStatus, isLoading } = useQuery<ProfileStatus>({
    queryKey: ['profileStatus'],
    queryFn: async () => {
      const res = await apiClient.get('/api/users/profile-status');
      return res.data;
    }
  });
  
  // Switch profile mutation
  const switchProfile = useMutation({
    mutationFn: async (profileType: 'user' | 'business') => {
      const res = await apiClient.post('/api/users/switch-profile', { profileType });
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate all queries to refetch with new profile context
      queryClient.invalidateQueries();
      
      // Update profile status cache
      queryClient.setQueryData(['profileStatus'], (old: ProfileStatus) => ({
        ...old,
        currentProfile: data.currentProfile
      }));
      
      // Trigger page reload or navigation
      window.location.reload(); // Or use router navigation
    },
    onError: (error: any) => {
      if (error.response?.data?.needsSetup) {
        // Redirect to business setup wizard
        // This will be handled in the component
        return { needsSetup: true };
      }
    }
  });
  
  return {
    currentProfile: profileStatus?.currentProfile || 'user',
    hasBusinessProfile: profileStatus?.hasBusinessProfile || false,
    businessProfile: profileStatus?.businessProfile,
    isLoading,
    switchProfile: switchProfile.mutate,
    isSwitching: switchProfile.isPending
  };
}
```

---

## 4. Profile Switch UI Component

### File: `client/src/components/ProfileSwitchModal.tsx`

```typescript
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProfileSwitch } from '@/hooks/use-profile-switch';
import { User, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNeedsSetup: () => void; // Callback to open business setup wizard
}

export function ProfileSwitchModal({ isOpen, onClose, onNeedsSetup }: ProfileSwitchModalProps) {
  const { currentProfile, hasBusinessProfile, switchProfile, isSwitching } = useProfileSwitch();
  
  const handleSwitch = (profileType: 'user' | 'business') => {
    if (profileType === currentProfile) {
      onClose();
      return;
    }
    
    if (profileType === 'business' && !hasBusinessProfile) {
      onClose();
      onNeedsSetup(); // Open business setup wizard
      return;
    }
    
    switchProfile(profileType);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* User Profile Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSwitch('user')}
            className={`
              relative p-6 rounded-lg border-2 cursor-pointer transition-all
              ${currentProfile === 'user' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`
                  p-3 rounded-full 
                  ${currentProfile === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                `}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">User Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentProfile === 'user' ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              {currentProfile === 'user' && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                  ACTIVE
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Business Profile Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSwitch('business')}
            className={`
              relative p-6 rounded-lg border-2 cursor-pointer transition-all
              ${currentProfile === 'business' 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`
                  p-3 rounded-full 
                  ${currentProfile === 'business' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                `}>
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Business Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    {!hasBusinessProfile 
                      ? 'Not set up' 
                      : currentProfile === 'business' 
                        ? 'Active' 
                        : 'Inactive'
                    }
                  </p>
                </div>
              </div>
              {currentProfile === 'business' && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
                  ACTIVE
                </div>
              )}
              {!hasBusinessProfile && (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </motion.div>
        </div>
        
        {isSwitching && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Switching profile...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

---

## 5. Business Setup Wizard

### File: `client/src/components/BusinessSetupWizard.tsx`

```typescript
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { MapPin, Clock, Tag, Target } from 'lucide-react';

// Import components for each step (to be created)
import { StepBusinessName } from './setup-steps/StepBusinessName';
import { StepDescription } from './setup-steps/StepDescription';
import { StepLocation } from './setup-steps/StepLocation';
import { StepWorkingHours } from './setup-steps/StepWorkingHours';
import { StepCategories } from './setup-steps/StepCategories';
import { StepTargetAudience } from './setup-steps/StepTargetAudience';

interface BusinessSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function BusinessSetupWizard({ isOpen, onClose, onComplete }: BusinessSetupWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    location: null,
    workingHours: null,
    mainCategory: '',
    affiliateCategory1: null,
    affiliateCategory2: null,
    affiliateCategory3: null,
    targetMarket: '',
    targetAgeRanges: []
  });
  
  const createBusiness = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/api/businesses/setup', data);
      return res.data;
    },
    onSuccess: (data) => {
      // Show success message with BBT reward
      alert(`Business created! You earned ${data.bbtAwarded} BBT!`);
      onComplete();
    }
  });
  
  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit
      createBusiness.mutate(formData);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} />
          </div>
          
          {/* Step Content */}
          <div className="min-h-[400px]">
            {step === 1 && <StepBusinessName data={formData} onChange={updateFormData} />}
            {step === 2 && <StepDescription data={formData} onChange={updateFormData} />}
            {step === 3 && <StepLocation data={formData} onChange={updateFormData} />}
            {step === 4 && <StepWorkingHours data={formData} onChange={updateFormData} />}
            {step === 5 && <StepCategories data={formData} onChange={updateFormData} />}
            {step === 6 && <StepTargetAudience data={formData} onChange={updateFormData} />}
          </div>
          
          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={createBusiness.isPending}
            >
              {step === totalSteps ? 'Finish Setup' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 6. Integration in Settings Page

### File: `client/src/pages/SettingsPage.tsx` (excerpt)

```typescript
import { useState } from 'react';
import { ProfileSwitchModal } from '@/components/ProfileSwitchModal';
import { BusinessSetupWizard } from '@/components/BusinessSetupWizard';
import { Button } from '@/components/ui/button';
import { useProfileSwitch } from '@/hooks/use-profile-switch';

export default function SettingsPage() {
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const { currentProfile } = useProfileSwitch();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {/* Profile Section */}
      <section className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Current Profile</p>
            <p className="text-sm text-muted-foreground capitalize">{currentProfile} Mode</p>
          </div>
          <Button onClick={() => setShowSwitchModal(true)}>
            Switch Profile
          </Button>
        </div>
      </section>
      
      {/* Other settings sections... */}
      
      <ProfileSwitchModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onNeedsSetup={() => {
          setShowSwitchModal(false);
          setShowSetupWizard(true);
        }}
      />
      
      <BusinessSetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onComplete={() => {
          setShowSetupWizard(false);
          // Refresh page to show business UI
          window.location.reload();
        }}
      />
    </div>
  );
}
```

---

## 7. UI Changes Based on Profile

### File: `client/src/App.tsx` (excerpt)

```typescript
import { useProfileSwitch } from '@/hooks/use-profile-switch';
import { BottomNav } from '@/components/BottomNav';
import { BusinessBottomNav } from '@/components/BusinessBottomNav';

function Router() {
  const { currentProfile, isLoading } = useProfileSwitch();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  const isBusinessMode = currentProfile === 'business';
  
  return (
    <div className="min-h-screen bg-background">
      {/* Conditional navigation based on profile */}
      {isBusinessMode ? <BusinessBottomNav /> : <BottomNav />}
      
      {/* Routes... */}
    </div>
  );
}
```

---

## Testing Checklist

- [ ] User can see profile switch option in settings
- [ ] Clicking "Switch Profile" opens modal with two cards
- [ ] Active profile shows "ACTIVE" badge
- [ ] Switching to user profile (when in business) works instantly
- [ ] Switching to business (first time) opens setup wizard
- [ ] All 6 setup steps work correctly
- [ ] Setup completion awards 420 BBT
- [ ] After setup, business profile is created in database
- [ ] hasBusinessProfile flag is set to true
- [ ] currentProfile is updated to 'business'
- [ ] UI changes to business mode (bottom nav, etc.)
- [ ] Subsequent switches work instantly
- [ ] Business profile goes to inactive when switching to user
- [ ] Switching back to business reactivates it
- [ ] lastActiveAt timestamp updates on business activation

---

This completes the Profile Switching implementation guide!
