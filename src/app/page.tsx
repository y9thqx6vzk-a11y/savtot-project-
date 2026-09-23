"use client";

import { useAppStore } from "@/lib/store";
import JourneyWizard from "@/components/journey/JourneyWizard";
import SkeletonDashboard from "@/components/skeleton/SkeletonDashboard";
import { useEffect, useState } from "react";

export default function Home() {
  const stage = useAppStore((state) => state.stage);
  const theme = useAppStore((state) => state.theme);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  }, [theme]);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-[#09090b]" />;

  return (
    <main className={`min-h-screen transition-colors duration-200 font-sans ${
      theme === 'light' 
        ? 'bg-[#ffffff] text-zinc-900 selection:bg-zinc-200' 
        : 'bg-[#09090b] text-zinc-100 selection:bg-zinc-800'
    }`}>
      {stage === 1 ? <JourneyWizard /> : <SkeletonDashboard />}
    </main>
  );
}
