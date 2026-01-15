'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChordsRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/pt/chords');
  }, [router]);

  return null;
}
