import { OVERLAY_ENABLED } from '@/lib/feature-flags';
import OverlayDisabledNotice from '@/components/OverlayDisabledNotice';
import QRCodeConfigPage from '@/features/overlay/pages/QRCodeConfigPage';

export default function QRCodeOverlayPage() {
  if (!OVERLAY_ENABLED) {
    return <OverlayDisabledNotice title="Overlay QR Code" />;
  }

  return <QRCodeConfigPage />;
}
