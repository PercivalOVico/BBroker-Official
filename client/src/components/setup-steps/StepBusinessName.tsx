import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store } from 'lucide-react';
import type { BusinessSetupData } from '../BusinessSetupWizard';

interface StepBusinessNameProps {
  formData: BusinessSetupData;
  updateFormData: (updates: Partial<BusinessSetupData>) => void;
}

export function StepBusinessName({ formData, updateFormData }: StepBusinessNameProps) {
  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Store className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">What's your business name?</h3>
        <p className="text-sm text-muted-foreground">
          This is how customers will find and recognize you
        </p>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <Label htmlFor="businessName" className="text-base font-medium">
          Business Name *
        </Label>
        <Input
          id="businessName"
          type="text"
          placeholder="e.g., Mike's Coffee Shop"
          value={formData.businessName}
          onChange={(e) => updateFormData({ businessName: e.target.value })}
          className="text-lg h-12"
          autoFocus
          maxLength={100}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {formData.businessName.length >= 2 ? (
              <span className="text-green-600">✓ Looks good!</span>
            ) : (
              <span>Minimum 2 characters</span>
            )}
          </span>
          <span>{formData.businessName.length} / 100</span>
        </div>
      </div>

      {/* Examples */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium mb-3">Examples:</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Joe's Barbershop",
            'Sunrise Bakery',
            'Tech Solutions Inc.',
            'Green Thumb Gardening',
          ].map((example) => (
            <button
              key={example}
              onClick={() => updateFormData({ businessName: example })}
              className="text-left px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
          💡 Tips for a great business name:
        </p>
        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
          <li>Keep it simple and memorable</li>
          <li>Make it easy to spell and pronounce</li>
          <li>Reflect what you do or who you serve</li>
        </ul>
      </div>
    </div>
  );
}
