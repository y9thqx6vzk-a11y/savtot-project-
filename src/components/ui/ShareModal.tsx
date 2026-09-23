"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { generateShareUrl } from "@/lib/urlSharing";
import { motion, AnimatePresence } from "framer-motion";

interface ShareModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export default function ShareModal({
  isOpen: controlledIsOpen,
  onOpenChange,
  showTrigger = true,
}: ShareModalProps = {}) {
  const { project } = useAppStore();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const shareUrl = isOpen ? generateShareUrl(project) : "";

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <>
      {showTrigger && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs flex items-center gap-1.5"
          title="צור קישור ייחודי לשיתוף הפרויקט"
        >
          <span className="font-mono text-zinc-400">↗</span>
          <span>שתף קישור</span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 text-right"
            dir="rtl"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-wide">
                  שיתוף פרויקט באמצעות קישור ייחודי
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-mono text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
                הקישור מכיל את כל נתוני הפרויקט באופן מאובטח ומכווץ. כל מי שיפתח את הקישור יקבל עותק עצמאי ופרטי משלו ישירות לדפדפן שלו — ללא צורך בהרשמה או מסד נתונים חיצוני!
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  הקישור הייחודי לפרויקט:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-xs font-mono text-zinc-700 dark:text-zinc-300 focus:outline-none select-all truncate"
                  />
                  <button
                    onClick={handleCopy}
                    className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-md text-xs font-medium transition-colors shadow-xs shrink-0"
                  >
                    {copied ? "הועתק! ✓" : "העתק קישור"}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] text-zinc-400 border-t border-zinc-100 dark:border-zinc-900">
                <span>פרטיות מלאה: הנתונים אינם עוברים דרך שרת צד-שלישי.</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-zinc-700 dark:text-zinc-300 hover:underline"
                >
                  סגור
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
