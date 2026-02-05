import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tag } from 'lucide-react';
import type { BusinessSetupData } from '../BusinessSetupWizard';

interface StepCategoriesProps {
  formData: BusinessSetupData;
  updateFormData: (updates: Partial<BusinessSetupData>) => void;
}

const CATEGORIES = [
  'Acting',
  'Accommodation',
  'Auto Services',
  'Clothing',
  'Dancing',
  'Dry Cleaning',
  'Education',
  'Energy',
  'Farming',
  'Finance',
  'Food & Beverage',
  'Furniture',
  'Hair Salon',
  'Health',
  'Hotel',
  'Influencer',
  'Lounge',
  'Medication',
  'Pet Grooming',
  'Photography',
  'Politics',
  'Religious',
  'Supermarket',
  'Technology',
  'Transport',
];

export function StepCategories({ formData, updateFormData }: StepCategoriesProps) {
  const availableAffiliates = CATEGORIES.filter((cat) => cat !== formData.mainCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Tag className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">What category describes your business?</h3>
        <p className="text-sm text-muted-foreground">
          Choose your main category and up to 3 related categories
        </p>
      </div>

      {/* Main Category */}
      <div className="space-y-2">
        <Label>Main Category *</Label>
        <Select
          value={formData.mainCategory}
          onValueChange={(value) => updateFormData({ mainCategory: value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Affiliate Categories */}
      {formData.mainCategory && (
        <>
          <div className="space-y-2">
            <Label>Affiliate Category 1 (Optional)</Label>
            <Select
              value={formData.affiliateCategory1 || ''}
              onValueChange={(value) => updateFormData({ affiliateCategory1: value || null })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select affiliate category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {availableAffiliates.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Affiliate Category 2 (Optional)</Label>
            <Select
              value={formData.affiliateCategory2 || ''}
              onValueChange={(value) => updateFormData({ affiliateCategory2: value || null })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select affiliate category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {availableAffiliates
                  .filter((cat) => cat !== formData.affiliateCategory1)
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Affiliate Category 3 (Optional)</Label>
            <Select
              value={formData.affiliateCategory3 || ''}
              onValueChange={(value) => updateFormData({ affiliateCategory3: value || null })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select affiliate category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {availableAffiliates
                  .filter(
                    (cat) =>
                      cat !== formData.affiliateCategory1 && cat !== formData.affiliateCategory2
                  )
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}
