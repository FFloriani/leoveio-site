'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeOverlay, DEFAULT_QRCODE_CONFIG } from '@/features/overlay/components/QRCodeOverlay';
import type { QROverlayConfig } from '@/features/overlay/components/QRCodeOverlay';

function RenderContent() {
  const searchParams = useSearchParams();
  const configParam = searchParams.get('config');

  let config: QROverlayConfig = DEFAULT_QRCODE_CONFIG;

  if (configParam) {
    try {
      config = JSON.parse(decodeURIComponent(configParam));
    } catch {
      console.error('Failed to parse config');
    }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
    }}>
      <QRCodeOverlay config={config} />
    </div>
  );
}

export default function QRCodeRenderPage() {
  return (
    <html>
      <body style={{ margin: 0, padding: 0, background: 'transparent', overflow: 'hidden' }}>
        <Suspense fallback={null}>
          <RenderContent />
        </Suspense>
      </body>
    </html>
  );
}
