"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

interface HamburgerMenuProps {
  onOpenShortcuts: () => void;
  onOpenShareModal: () => void;
  focusMode: boolean;
  onToggleFocusMode: () => void;
}

export default function HamburgerMenu({
  onOpenShortcuts,
  onOpenShareModal,
  focusMode,
  onToggleFocusMode,
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    theme,
    toggleTheme,
    setStage,
    exportJSON,
    importJSON,
  } = useAppStore();

  const isLight = theme === "light";

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON());
    const el = document.createElement("a");
    el.setAttribute("href", dataStr);
    el.setAttribute("download", `project-skeleton-${Date.now()}.json`);
    el.click();
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          importJSON(content);
          setIsOpen(false);
        } catch (err) {
          alert("שגיאה בטעינת קובץ ה-JSON. ודא שהקובץ תקין.");
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="relative font-sans text-right" ref={dropdownRef} dir="rtl">
      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs"
        title="תפריט אפשרויות"
        aria-label="תפריט"
      >
        <div className="flex flex-col gap-1 items-center justify-center w-4 h-4">
          <span className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${isOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <span className={`block h-0.5 w-4 bg-current transition-opacity duration-200 ${isOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-4 bg-current transition-transform duration-200 ${isOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 mt-2 w-56 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 text-right"
          >
            {/* 1. יצוא JSON */}
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-zinc-400">↓</span>
                <span>ייצוא קובץ JSON</span>
              </div>
              <kbd className="text-[10px] font-mono text-zinc-400">E</kbd>
            </button>

            {/* 2. העלאת JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-zinc-400">↑</span>
                <span>העלאת קובץ JSON</span>
              </div>
            </button>

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-900" />

            {/* 3. מצב מיקוד */}
            <button
              onClick={() => {
                onToggleFocusMode();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400">◎</span>
                <span>מצב מיקוד</span>
              </div>
              {focusMode && (
                <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">פעיל ✓</span>
              )}
            </button>

            {/* 4. מצב בהיר / כהה */}
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full border border-zinc-400 bg-zinc-200 dark:bg-zinc-700 inline-block" />
                <span>{isLight ? "מצב כהה" : "מצב בהיר"}</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">
                {isLight ? "לילה" : "יום"}
              </span>
            </button>

            {/* 5. שתף קישור */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenShareModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-zinc-400">↗</span>
                <span>שתף קישור</span>
              </div>
            </button>

            <div className="my-1 border-t border-zinc-100 dark:border-zinc-900" />

            {/* 6. עריכת מסע */}
            <button
              onClick={() => {
                setIsOpen(false);
                setStage(1);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-zinc-400">↺</span>
                <span>עריכת המסע</span>
              </div>
              <kbd className="text-[10px] font-mono text-zinc-400">J</kbd>
            </button>

            {/* 7. קיצורי מקלדת (?) */}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenShortcuts();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-zinc-400 font-bold">?</span>
                <span>קיצורי מקלדת ועזרה</span>
              </div>
              <kbd className="text-[10px] font-mono text-zinc-400">?</kbd>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
