import { OVERLAY_ENABLED } from '@/lib/feature-flags';
import OverlayDisabledNotice from '@/components/OverlayDisabledNotice';
import OverlayConfigPage from '@/features/overlay/pages/OverlayConfigPage';

export default function OverlayPage() {
  if (!OVERLAY_ENABLED) {
    return <OverlayDisabledNotice title="Overlay YouTube" />;
  }

  return <OverlayConfigPage />;
}
