"use client";

import { useAppStore } from "@/lib/store";
import JourneyWizard from "@/components/journey/JourneyWizard";
import SkeletonDashboard from "@/components/skeleton/SkeletonDashboard";
import { useEffect, useState } from "react";

export default function Home() {
  const stage = useAppStore((state) => state.stage);
  
  // Prevent hydration mismatch for persisted store
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Register Service Worker for offline PWA capabilities
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      {stage === 1 ? <JourneyWizard /> : <SkeletonDashboard />}
    </main>
  );
}
