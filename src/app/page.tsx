"use client";

import { useAppStore } from "@/lib/store";
import JourneyWizard from "@/components/journey/JourneyWizard";
import SkeletonDashboard from "@/components/skeleton/SkeletonDashboard";
import { useEffect, useState } from "react";

import { decodeProjectFromUrl } from "@/lib/urlSharing";

export default function Home() {
  const stage = useAppStore((state) => state.stage);
  const theme = useAppStore((state) => state.theme);
  const createProject = useAppStore((state) => state.createProject);
  
  const [mounted, setMounted] = useState(false);
  const [sharedNotice, setSharedNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    // Check for shared project in URL hash or query params
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      const search = window.location.search;
      let rawData = "";

      if (hash.includes("share=") || hash.includes("p=")) {
        rawData = hash;
      } else if (search.includes("share=") || search.includes("p=")) {
        rawData = search;
      }

      if (rawData) {
        const decoded = decodeProjectFromUrl(rawData);
        if (decoded) {
          const name = decoded.oneLiner ? decoded.oneLiner.slice(0, 30) : "פרויקט משותף";
          createProject(`${name} (משותף)`, decoded);
          setSharedNotice(name);
          // Clean URL without triggering page reload
          window.history.replaceState(null, "", window.location.pathname);
          setTimeout(() => setSharedNotice(null), 4000);
        }
      }
    }

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
  }, [theme, createProject]);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-[#09090b]" />;

  return (
    <main className={`min-h-screen transition-colors duration-200 font-sans ${
      theme === 'light' 
        ? 'bg-[#ffffff] text-zinc-900 selection:bg-zinc-200' 
        : 'bg-[#09090b] text-zinc-100 selection:bg-zinc-800'
    }`}>
      {sharedNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-full shadow-lg text-xs font-medium flex items-center gap-2" dir="rtl">
          <span>✓</span>
          <span>הפרויקט המשותף &quot;{sharedNotice}&quot; נטען בהצלחה!</span>
        </div>
      )}
      {stage === 1 ? <JourneyWizard /> : <SkeletonDashboard />}
    </main>
  );
}
