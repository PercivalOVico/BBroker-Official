import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import type { BusinessSetupData } from '../BusinessSetupWizard';

interface StepDescriptionProps {
  formData: BusinessSetupData;
  updateFormData: (updates: Partial<BusinessSetupData>) => void;
}

export function StepDescription({ formData, updateFormData }: StepDescriptionProps) {
  const charCount = formData.description.length;
  const isValid = charCount >= 10 && charCount <= 500;

  return (
    <div className="space-y-6">
      {/* Icon & Title */}
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Describe your business</h3>
        <p className="text-sm text-muted-foreground">
          Tell customers what makes your business special
        </p>
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-medium">
          Business Description *
        </Label>
        <Textarea
          id="description"
          placeholder="e.g., Cozy neighborhood coffee shop serving artisan coffee, fresh pastries, and homemade sandwiches. We source our beans locally and create a warm, welcoming atmosphere for the community."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          className="min-h-[150px] text-base resize-none"
          autoFocus
          maxLength={500}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={isValid ? 'text-green-600' : 'text-muted-foreground'}>
            {isValid ? (
              <span>✓ Great description!</span>
            ) : charCount < 10 ? (
              <span>Minimum 10 characters ({10 - charCount} more needed)</span>
            ) : (
              <span>Maximum 500 characters</span>
            )}
          </span>
          <span className="text-muted-foreground">{charCount} / 500</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="pt-4 border-t border-border">
        <p className="text-sm font-medium mb-3">What to include:</p>
        <div className="grid gap-2">
          {[
            { icon: '🎯', text: 'What products or services you offer' },
            { icon: '✨', text: 'What makes you unique' },
            { icon: '👥', text: 'Who your ideal customer is' },
            { icon: '💝', text: 'Your business values or mission' },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-start gap-3 px-3 py-2 rounded-lg bg-secondary/50"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-2">
          📝 Example Descriptions:
        </p>
        <div className="space-y-3">
          <button
            onClick={() =>
              updateFormData({
                description:
                  'Family-owned Italian restaurant serving authentic homemade pasta, wood-fired pizzas, and traditional desserts. Using recipes passed down through three generations.',
              })
            }
            className="text-left w-full px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-xs text-muted-foreground"
          >
            <strong className="text-foreground">Restaurant:</strong> "Family-owned Italian
            restaurant serving authentic homemade pasta..."
          </button>
          <button
            onClick={() =>
              updateFormData({
                description:
                  'Modern hair salon offering precision cuts, creative coloring, and premium styling services. Our team of expert stylists stays current with the latest trends and techniques.',
              })
            }
            className="text-left w-full px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-xs text-muted-foreground"
          >
            <strong className="text-foreground">Salon:</strong> "Modern hair salon offering
            precision cuts, creative coloring..."
          </button>
        </div>
      </div>
    </div>
  );
}
