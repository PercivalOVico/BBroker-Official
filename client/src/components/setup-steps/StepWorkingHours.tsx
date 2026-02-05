import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Clock } from 'lucide-react';
import type { BusinessSetupData } from '../BusinessSetupWizard';

interface StepWorkingHoursProps {
  formData: BusinessSetupData;
  updateFormData: (updates: Partial<BusinessSetupData>) => void;
}

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export function StepWorkingHours({ formData, updateFormData }: StepWorkingHoursProps) {
  const updateDay = (
    day: keyof typeof formData.workingHours,
    updates: Partial<typeof formData.workingHours.monday>
  ) => {
    updateFormData({
      workingHours: {
        ...formData.workingHours,
        [day]: { ...formData.workingHours[day], ...updates },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
          <Clock className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">When are you open?</h3>
        <p className="text-sm text-muted-foreground">Set your business hours</p>
      </div>

      {/* Days */}
      <div className="space-y-3">
        {DAYS.map((day) => {
          const dayData = formData.workingHours[day];
          return (
            <div key={day} className="flex items-center gap-4 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3 flex-1">
                <Switch
                  checked={dayData.open}
                  onCheckedChange={(open) => updateDay(day, { open })}
                />
                <Label className="capitalize min-w-[100px]">{day}</Label>
              </div>
              {dayData.open && (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => updateDay(day, { start: e.target.value })}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => updateDay(day, { end: e.target.value })}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Special Hours */}
      <div className="space-y-2 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>24/7 Operation</Label>
          <Switch
            checked={formData.workingHours.is24x7}
            onCheckedChange={(is24x7) =>
              updateFormData({
                workingHours: { ...formData.workingHours, is24x7 },
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>By Appointment Only</Label>
          <Switch
            checked={formData.workingHours.isByAppointment}
            onCheckedChange={(isByAppointment) =>
              updateFormData({
                workingHours: { ...formData.workingHours, isByAppointment },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
