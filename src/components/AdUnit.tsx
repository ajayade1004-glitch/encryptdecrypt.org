import React, { useEffect, useState } from 'react';
import { getAdsSettings } from '../utils/adminStorage';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({
  slot = '1234567890',
  format = 'auto',
  className = '',
}) => {
  const [adsConfig, setAdsConfig] = useState(() => getAdsSettings());

  useEffect(() => {
    // Re-check ads settings on mount
    setAdsConfig(getAdsSettings());
  }, []);

  if (!adsConfig.enabled || !adsConfig.adsensePublisherId || adsConfig.adsensePublisherId.includes('XXXXX')) {
    return null;
  }

  return (
    <div className={`my-6 text-center overflow-hidden clear-both ${className}`} role="region" aria-label="Advertisement">
      {/* Explicit Advertisement Marker per Google AdSense Guidelines */}
      <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mb-1.5 opacity-70">
        Advertisement
      </div>
      
      {/* Container with reserved minimum height to prevent Cumulative Layout Shift (CLS) */}
      <div className="min-h-[90px] w-full max-w-4xl mx-auto rounded-lg bg-[var(--bg-input)]/50 border border-[var(--border-subtle)]/60 flex items-center justify-center p-2">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px' }}
          data-ad-client={adsConfig.adsensePublisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};
