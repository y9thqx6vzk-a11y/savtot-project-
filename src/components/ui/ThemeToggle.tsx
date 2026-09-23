"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
        isLight
          ? 'bg-[#ffffff] text-[#1d1d1f] border-[#e2ded5] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#f6f4ee]'
          : 'bg-[#1c1c1e] text-[#f5f5f7] border-[#2c2c30] shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:bg-[#2c2c30]'
      }`}
      title="החלף בין מצב בהיר חם למצב כהה"
    >
      <span className="text-sm">{isLight ? '☀️' : '🌙'}</span>
      <span className="font-mono text-[11px]">{isLight ? 'עיצוב אפל בהיר' : 'עיצוב כהה'}</span>
    </button>
  );
}
