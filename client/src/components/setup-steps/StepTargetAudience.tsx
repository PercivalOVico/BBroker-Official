import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Users } from 'lucide-react';
import type { BusinessSetupData } from '../BusinessSetupWizard';

interface StepTargetAudienceProps {
  formData: BusinessSetupData;
  updateFormData: (updates: Partial<BusinessSetupData>) => void;
}

const TARGET_MARKETS = [
  { value: 'neighborhood', label: 'Neighborhood', desc: 'Very local area' },
  { value: 'local', label: 'Local', desc: 'City or town' },
  { value: 'regional', label: 'Regional', desc: 'Multiple cities/counties' },
  { value: 'national', label: 'National', desc: 'Entire country' },
  { value: 'global', label: 'Global', desc: 'International' },
] as const;

const AGE_RANGES = [
  '18-25',
  '26-30',
  '31-35',
  '36-40',
  '41-45',
  '46-50',
  '51-55',
  '56-60',
  '61-65',
  '66+',
  'All Ages',
];

export function StepTargetAudience({ formData, updateFormData }: StepTargetAudienceProps) {
  const toggleAgeRange = (range: string) => {
    const current = formData.targetAgeRanges;
    if (current.includes(range)) {
      updateFormData({
        targetAgeRanges: current.filter((r) => r !== range),
      });
    } else {
      updateFormData({
        targetAgeRanges: [...current, range],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">Who is your target audience?</h3>
        <p className="text-sm text-muted-foreground">
          Help us connect you with the right customers
        </p>
      </div>

      {/* Target Market */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Geographic Reach *</Label>
        <RadioGroup
          value={formData.targetMarket}
          onValueChange={(value) =>
            updateFormData({
              targetMarket: value as BusinessSetupData['targetMarket'],
            })
          }
        >
          {TARGET_MARKETS.map((market) => (
            <div
              key={market.value}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary transition-colors"
            >
              <RadioGroupItem value={market.value} id={market.value} />
              <Label htmlFor={market.value} className="flex-1 cursor-pointer">
                <div className="font-medium">{market.label}</div>
                <div className="text-xs text-muted-foreground">{market.desc}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Age Ranges */}
      <div className="space-y-3 pt-4 border-t">
        <Label className="text-base font-medium">Target Age Ranges *</Label>
        <p className="text-sm text-muted-foreground">Select all that apply</p>
        <div className="grid grid-cols-2 gap-3">
          {AGE_RANGES.map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <Checkbox
                id={range}
                checked={formData.targetAgeRanges.includes(range)}
                onCheckedChange={() => toggleAgeRange(range)}
              />
              <Label htmlFor={range} className="cursor-pointer">
                {range}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {formData.targetMarket && formData.targetAgeRanges.length > 0 && (
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="font-medium text-green-600 dark:text-green-400 mb-2">
            ✓ Target Audience Set
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Reach:</strong> {formData.targetMarket}
            </p>
            <p>
              <strong>Age Groups:</strong> {formData.targetAgeRanges.join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
