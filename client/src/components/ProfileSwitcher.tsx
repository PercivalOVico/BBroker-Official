import { useState } from 'react';
import { useProfileSwitch } from '@/hooks/use-profile-switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building2, Loader2 } from 'lucide-react';
import { BusinessSetupWizard } from '@/components/BusinessSetupWizard';

export function ProfileSwitcher() {
  const {
    currentProfile,
    hasBusinessProfile,
    businessProfile,
    isUserMode,
    isBusinessMode,
    isSwitching,
    switchToUser,
    switchToBusiness,
    switchError,
  } = useProfileSwitch();

  const [showSetupPrompt, setShowSetupPrompt] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  // Check if switch failed due to missing business profile
  const needsSetup = switchError?.response?.data?.needsSetup;

  // Handle switch to business
  const handleSwitchToBusiness = () => {
    if (!hasBusinessProfile) {
      setShowSetupPrompt(true);
    } else {
      switchToBusiness();
    }
  };

  // Handle opening the setup wizard
  const handleOpenSetupWizard = () => {
    setShowSetupWizard(true);
    setShowSetupPrompt(false);
  };

  // Handle wizard completion
  const handleSetupComplete = () => {
    setShowSetupWizard(false);
    // The wizard already handles profile switching internally
  };

  return (
    <div className="space-y-4">
      {/* Current Profile Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Profile Mode</span>
            <Badge variant={isBusinessMode ? 'default' : 'secondary'}>
              {currentProfile === 'user' ? 'User' : 'Business'}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isUserMode
              ? 'You are browsing as a user'
              : 'You are managing your business'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Mode Card */}
          <div
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              isUserMode
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => isBusinessMode && switchToUser()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isUserMode ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                }`}
              >
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">User Mode</h3>
                <p className="text-sm text-muted-foreground">
                  Browse and discover local businesses
                </p>
              </div>
              {isUserMode && (
                <Badge className="ml-auto" variant="default">
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Business Mode Card */}
          <div
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              isBusinessMode
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => isUserMode && handleSwitchToBusiness()}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isBusinessMode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary'
                }`}
              >
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Business Mode</h3>
                <p className="text-sm text-muted-foreground">
                  {hasBusinessProfile
                    ? businessProfile?.businessName || 'Manage your business'
                    : 'Set up your business profile'}
                </p>
              </div>
              {isBusinessMode && (
                <Badge className="ml-auto" variant="default">
                  Active
                </Badge>
              )}
              {!hasBusinessProfile && (
                <Badge className="ml-auto" variant="outline">
                  Not Set Up
                </Badge>
              )}
            </div>
          </div>

          {/* Switch Button */}
          {isUserMode && hasBusinessProfile && (
            <Button
              onClick={switchToBusiness}
              disabled={isSwitching}
              className="w-full"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Switching to Business...
                </>
              ) : (
                <>
                  <Building2 className="mr-2 h-4 w-4" />
                  Switch to Business Mode
                </>
              )}
            </Button>
          )}

          {isBusinessMode && (
            <Button
              onClick={switchToUser}
              disabled={isSwitching}
              variant="outline"
              className="w-full"
            >
              {isSwitching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Switching to User...
                </>
              ) : (
                <>
                  <User className="mr-2 h-4 w-4" />
                  Switch to User Mode
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Setup Prompt */}
      {(showSetupPrompt || needsSetup) && !hasBusinessProfile && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-600">
              Business Profile Not Set Up
            </CardTitle>
            <CardDescription>
              You need to complete the business setup wizard before switching to
              business mode.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleOpenSetupWizard}
              className="w-full"
            >
              Start Business Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Business Setup Wizard Modal */}
      <BusinessSetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onSuccess={handleSetupComplete}
      />
    </div>
  );
}

// ============================================================================
// SIMPLE VERSION (for navbar/header)
// ============================================================================

export function ProfileSwitcherSimple() {
  const { isBusinessMode, toggleProfile, isSwitching } = useProfileSwitch();

  return (
    <Button
      onClick={toggleProfile}
      disabled={isSwitching}
      variant="outline"
      size="sm"
    >
      {isSwitching ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isBusinessMode ? (
        <User className="mr-2 h-4 w-4" />
      ) : (
        <Building2 className="mr-2 h-4 w-4" />
      )}
      {isSwitching
        ? 'Switching...'
        : isBusinessMode
        ? 'User Mode'
        : 'Business Mode'}
    </Button>
  );
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

// 1. In Settings Page:
import { ProfileSwitcher } from '@/components/ProfileSwitcher';

function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <ProfileSwitcher />
    </div>
  );
}

// 2. In Header/Navbar:
import { ProfileSwitcherSimple } from '@/components/ProfileSwitcher';

function Header() {
  return (
    <header>
      <nav>
        <ProfileSwitcherSimple />
      </nav>
    </header>
  );
}

// 3. Custom Implementation:
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
      <p>Current: {currentProfile}</p>
      {hasBusinessProfile && (
        <button onClick={switchToBusiness} disabled={isSwitching}>
          Go to Business
        </button>
      )}
    </div>
  );
}

*/
