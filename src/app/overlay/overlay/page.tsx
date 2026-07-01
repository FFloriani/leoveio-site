import { OVERLAY_ENABLED } from '@/lib/feature-flags';
import OverlayDisabledNotice from '@/components/OverlayDisabledNotice';
import OverlayRenderPage from '@/features/overlay/pages/OverlayRenderPage';

export default function OverlayRenderRoute() {
  if (!OVERLAY_ENABLED) {
    return <OverlayDisabledNotice variant="render" title="Overlay indisponível" />;
  }

  return <OverlayRenderPage />;
}
