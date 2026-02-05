# ProfileSwitchModal - Quick Reference

## Component

Beautiful modal for quick profile switching with animations.

## Props

```typescript
{
  isOpen: boolean;               // Required
  onClose: () => void;           // Required
  onOpenSetupWizard?: () => void; // Optional
}
```

## Basic Usage

```typescript
import { ProfileSwitchModal } from '@/components/ProfileSwitchModal';

const [show, setShow] = useState(false);

<button onClick={() => setShow(true)}>Switch</button>

<ProfileSwitchModal
  isOpen={show}
  onClose={() => setShow(false)}
/>
```

## Features

✅ Animated with Framer Motion
✅ Auto-closes after successful switch
✅ Opens setup wizard if no business
✅ Loading & success states
✅ Dark mode compatible
✅ Responsive design

## Access

Now available in Header via RefreshCw icon button!

## Integration

Uses `useProfileSwitch()` hook for all functionality.
