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
      className="flex items-center gap-2 px-3 py-1 rounded text-xs font-mono transition-colors border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs"
      title="החלף בין מצב בהיר למצב כהה"
    >
      <span className="w-2 h-2 rounded-full border border-zinc-400 dark:border-zinc-500 bg-zinc-200 dark:bg-zinc-700 inline-block" />
      <span>{isLight ? 'מצב בהיר' : 'מצב כהה'}</span>
    </button>
  );
}
