'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HarmonicFieldRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/pt/harmonic_field');
  }, [router]);

  return null;
}
