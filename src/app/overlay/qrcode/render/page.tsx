import { OVERLAY_ENABLED } from '@/lib/feature-flags';
import OverlayDisabledNotice from '@/components/OverlayDisabledNotice';
import QRCodeRenderPage from '@/features/overlay/pages/QRCodeRenderPage';

export default function QRCodeRenderRoute() {
  if (!OVERLAY_ENABLED) {
    return <OverlayDisabledNotice variant="render" title="QR Code indisponível" />;
  }

  return <QRCodeRenderPage />;
}
