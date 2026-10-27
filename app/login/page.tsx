'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth?mode=signin');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F3EC] flex items-center justify-center">
      <div className="p-4 bg-[#FFFDF7] border-2 border-[#111218] rounded-2xl shadow-neo-sm font-display font-bold text-xs">
        Redirecting to Sign In...
      </div>
    </div>
  );
}
