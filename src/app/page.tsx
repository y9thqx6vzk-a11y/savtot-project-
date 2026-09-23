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
    // Sync html class with initial theme
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    // Register Service Worker for offline PWA capabilities
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('Service worker registration failed:', err);
        });
      });
    }
  }, [theme]);

  if (!mounted) return <div className="min-h-screen bg-[#fbfaf7] dark:bg-[#0c0c0e]" />;

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      theme === 'light' 
        ? 'bg-[#fbfaf7] text-[#1d1d1f] selection:bg-[#e8e4da]' 
        : 'bg-[#0c0c0e] text-[#f5f5f7] selection:bg-[#2c2c30]'
    }`}>
      {stage === 1 ? <JourneyWizard /> : <SkeletonDashboard />}
    </main>
  );
}
