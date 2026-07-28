'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { GOOGLE_AD } from '@/config-global';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
}

export default function GoogleAd({
  slot,
  format = 'auto',
  className,
  style,
}: GoogleAdProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Adsense:', err);
    }
  }, [pathname]);

  return (
    <ins
      key={pathname}
      className={`adsbygoogle ${className ?? ''}`}
      style={{
        display: 'block',
        ...style,
      }}
      data-ad-client={`ca-pub-${GOOGLE_AD}`}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
