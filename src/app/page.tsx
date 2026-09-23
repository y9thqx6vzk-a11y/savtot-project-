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
  }, []);

  if (!mounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-800">
      {stage === 1 ? <JourneyWizard /> : <SkeletonDashboard />}
    </main>
  );
}
