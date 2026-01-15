'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page redirects to the default locale
export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/pt');
  }, [router]);

  return null;
}
