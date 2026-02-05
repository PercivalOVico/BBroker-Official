import { useState, useEffect } from 'react';
import { X, User, Building2, Loader2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileSwitch } from '@/hooks/use-profile-switch';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// TYPES
// ============================================================================

interface ProfileSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSetupWizard?: () => void; // Callback to open business setup wizard
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProfileSwitchModal({
  isOpen,
  onClose,
  onOpenSetupWizard,
}: ProfileSwitchModalProps) {
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

  const [selectedProfile, setSelectedProfile] = useState<'user' | 'business' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset selected profile when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedProfile(null);
      setShowSuccess(false);
    }
  }, [isOpen]);

  // Check if switch failed due to missing business profile
  useEffect(() => {
    if (switchError?.response?.data?.needsSetup) {
      onClose();
      onOpenSetupWizard?.();
    }
  }, [switchError, onClose, onOpenSetupWizard]);

  // Handle successful switch
  useEffect(() => {
    if (!isSwitching && selectedProfile && currentProfile === selectedProfile) {
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  }, [isSwitching, selectedProfile, currentProfile, onClose]);

  // Handle profile selection and switch
  const handleProfileSelect = (profile: 'user' | 'business') => {
    if (profile === currentProfile) {
      onClose();
      return;
    }

    setSelectedProfile(profile);

    if (profile === 'user') {
      switchToUser();
    } else if (profile === 'business') {
      if (!hasBusinessProfile) {
        onClose();
        onOpenSetupWizard?.();
      } else {
        switchToBusiness();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/80 transition-colors"
                disabled={isSwitching}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Switch Profile</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Choose how you want to use BBroker
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Options */}
            <div className="p-6 space-y-3">
              {/* User Profile Card */}
              <motion.button
                whileHover={{ scale: isSwitching ? 1 : 1.02 }}
                whileTap={{ scale: isSwitching ? 1 : 0.98 }}
                onClick={() => handleProfileSelect('user')}
                disabled={isSwitching}
                className={`
                  w-full p-5 rounded-xl border-2 transition-all text-left
                  ${
                    isUserMode
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                  ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        p-3 rounded-full transition-colors
                        ${
                          isUserMode
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }
                      `}
                    >
                      <User className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        User Mode
                        {isUserMode && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Browse and discover local businesses
                      </p>
                    </div>
                  </div>

                  {isUserMode ? (
                    <Badge variant="default" className="ml-2">
                      Active
                    </Badge>
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </motion.button>

              {/* Business Profile Card */}
              <motion.button
                whileHover={{ scale: isSwitching ? 1 : 1.02 }}
                whileTap={{ scale: isSwitching ? 1 : 0.98 }}
                onClick={() => handleProfileSelect('business')}
                disabled={isSwitching}
                className={`
                  w-full p-5 rounded-xl border-2 transition-all text-left
                  ${
                    isBusinessMode
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  }
                  ${isSwitching ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                        p-3 rounded-full transition-colors
                        ${
                          isBusinessMode
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }
                      `}
                    >
                      <Building2 className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        Business Mode
                        {isBusinessMode && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hasBusinessProfile
                          ? businessProfile?.businessName || 'Manage your business'
                          : 'Set up your business profile'}
                      </p>
                    </div>
                  </div>

                  {isBusinessMode ? (
                    <Badge variant="default" className="ml-2">
                      Active
                    </Badge>
                  ) : !hasBusinessProfile ? (
                    <Badge variant="outline" className="ml-2">
                      Setup
                    </Badge>
                  ) : (
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </motion.button>

              {/* Switching Indicator */}
              <AnimatePresence>
                {isSwitching && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-2 py-4 text-primary"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-medium">
                      Switching to {selectedProfile}...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success Indicator */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center gap-2 py-4 text-green-600"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      Switched successfully!
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground">
                  You can switch between profiles anytime from Settings
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/*

// Basic Usage:
import { ProfileSwitchModal } from '@/components/ProfileSwitchModal';

function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Switch Profile
      </button>

      <ProfileSwitchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

// With Business Setup Wizard Integration:
function MyComponent() {
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);

  return (
    <>
      <button onClick={() => setShowSwitchModal(true)}>
        Switch Profile
      </button>

      <ProfileSwitchModal
        isOpen={showSwitchModal}
        onClose={() => setShowSwitchModal(false)}
        onOpenSetupWizard={() => {
          setShowSwitchModal(false);
          setShowSetupWizard(true);
        }}
      />

      <BusinessSetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
      />
    </>
  );
}

// Trigger from Header/Navbar:
import { ProfileSwitchModal } from '@/components/ProfileSwitchModal';

function Header() {
  const [showModal, setShowModal] = useState(false);

  return (
    <header>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 rounded-full hover:bg-secondary"
      >
        <User className="w-5 h-5" />
      </button>

      <ProfileSwitchModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </header>
  );
}

*/
