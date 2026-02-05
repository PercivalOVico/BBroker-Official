import { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/constants';

// Step Components (will create separately)
import { StepBusinessName } from './setup-steps/StepBusinessName';
import { StepDescription } from './setup-steps/StepDescription';
import { StepLocation } from './setup-steps/StepLocation';
import { StepWorkingHours } from './setup-steps/StepWorkingHours';
import { StepCategories } from './setup-steps/StepCategories';
import { StepTargetAudience } from './setup-steps/StepTargetAudience';

// ============================================================================
// TYPES
// ============================================================================

export interface BusinessSetupData {
  // Step 1: Business Name
  businessName: string;
  
  // Step 2: Description
  description: string;
  
  // Step 3: Location
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  
  // Step 4: Working Hours
  workingHours: {
    monday: { open: boolean; start: string; end: string };
    tuesday: { open: boolean; start: string; end: string };
    wednesday: { open: boolean; start: string; end: string };
    thursday: { open: boolean; start: string; end: string };
    friday: { open: boolean; start: string; end: string };
    saturday: { open: boolean; start: string; end: string };
    sunday: { open: boolean; start: string; end: string };
    is24x7: boolean;
    isByAppointment: boolean;
  };
  
  // Step 5: Categories
  mainCategory: string;
  affiliateCategory1: string | null;
  affiliateCategory2: string | null;
  affiliateCategory3: string | null;
  
  // Step 6: Target Audience
  targetMarket: 'neighborhood' | 'local' | 'regional' | 'national' | 'global' | '';
  targetAgeRanges: string[];
}

interface BusinessSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function BusinessSetupWizard({
  isOpen,
  onClose,
  onSuccess,
}: BusinessSetupWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data state
  const [formData, setFormData] = useState<BusinessSetupData>({
    businessName: '',
    description: '',
    location: null,
    workingHours: {
      monday: { open: true, start: '09:00', end: '17:00' },
      tuesday: { open: true, start: '09:00', end: '17:00' },
      wednesday: { open: true, start: '09:00', end: '17:00' },
      thursday: { open: true, start: '09:00', end: '17:00' },
      friday: { open: true, start: '09:00', end: '17:00' },
      saturday: { open: false, start: '', end: '' },
      sunday: { open: false, start: '', end: '' },
      is24x7: false,
      isByAppointment: false,
    },
    mainCategory: '',
    affiliateCategory1: null,
    affiliateCategory2: null,
    affiliateCategory3: null,
    targetMarket: '',
    targetAgeRanges: [],
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        businessName: '',
        description: '',
        location: null,
        workingHours: {
          monday: { open: true, start: '09:00', end: '17:00' },
          tuesday: { open: true, start: '09:00', end: '17:00' },
          wednesday: { open: true, start: '09:00', end: '17:00' },
          thursday: { open: true, start: '09:00', end: '17:00' },
          friday: { open: true, start: '09:00', end: '17:00' },
          saturday: { open: false, start: '', end: '' },
          sunday: { open: false, start: '', end: '' },
          is24x7: false,
          isByAppointment: false,
        },
        mainCategory: '',
        affiliateCategory1: null,
        affiliateCategory2: null,
        affiliateCategory3: null,
        targetMarket: '',
        targetAgeRanges: [],
      });
    }
  }, [isOpen]);

  // Update form data
  const updateFormData = (updates: Partial<BusinessSetupData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Validation for each step
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName.trim().length >= 2;
      case 2:
        return formData.description.trim().length >= 10;
      case 3:
        return formData.location !== null;
      case 4:
        return true; // Working hours always valid
      case 5:
        return formData.mainCategory !== '';
      case 6:
        return formData.targetMarket !== '' && formData.targetAgeRanges.length > 0;
      default:
        return false;
    }
  };

  // Navigation
  const goToNextStep = () => {
    if (canProceed() && currentStep < 6) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (!canProceed()) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Information',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post(API_ENDPOINTS.BUSINESSES.SETUP, {
        businessName: formData.businessName,
        description: formData.description,
        location: formData.location,
        workingHours: formData.workingHours,
        mainCategory: formData.mainCategory,
        affiliateCategory1: formData.affiliateCategory1,
        affiliateCategory2: formData.affiliateCategory2,
        affiliateCategory3: formData.affiliateCategory3,
        targetMarket: formData.targetMarket,
        targetAgeRanges: formData.targetAgeRanges,
      });

      toast({
        title: '🎉 Business Created!',
        description: `${formData.businessName} is now live! You earned ${response.data.bbtAwarded} BBT!`,
      });

      // Close wizard and trigger success callback
      setTimeout(() => {
        onClose();
        onSuccess?.();
        // Reload to refresh profile status
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Business setup error:', error);
      toast({
        variant: 'destructive',
        title: 'Setup Failed',
        description: error.response?.data?.message || 'Failed to create business profile.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Business Name', component: StepBusinessName },
    { number: 2, title: 'Description', component: StepDescription },
    { number: 3, title: 'Location', component: StepLocation },
    { number: 4, title: 'Working Hours', component: StepWorkingHours },
    { number: 5, title: 'Categories', component: StepCategories },
    { number: 6, title: 'Target Audience', component: StepTargetAudience },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
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
        className="relative bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-border"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border-b border-border">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-background/80 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Business Setup</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Step {currentStep} of 6 - {steps[currentStep - 1].title}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 relative">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`
                    text-xs font-medium transition-colors
                    ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}
                  `}
                >
                  {currentStep > step.number ? (
                    <Check className="w-4 h-4 inline" />
                  ) : (
                    step.number
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer - Navigation */}
        <div className="p-6 border-t border-border bg-secondary/20">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={goToPrevStep}
              disabled={currentStep === 1 || isSubmitting}
              className="min-w-[100px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentStep} / {steps.length}
            </div>

            {currentStep < 6 ? (
              <Button
                onClick={goToNextStep}
                disabled={!canProceed() || isSubmitting}
                className="min-w-[100px]"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className="min-w-[100px] bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
