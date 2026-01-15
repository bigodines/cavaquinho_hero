'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/pt/about');
  }, [router]);

  return null;
}
