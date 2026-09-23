"use client";

import { useRef } from "react";
import { useAppStore } from "@/lib/store";

export default function JsonUploader({ className = "" }: { className?: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importJSON } = useAppStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          importJSON(content);
        } catch (err) {
          alert("שגיאה בטעינת קובץ ה-JSON. ודא שהקובץ תקין.");
        }
      }
    };
    reader.readAsText(file);
    // Reset input value so same file can be reloaded if needed
    e.target.value = "";
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className={`text-xs px-3 py-1 rounded transition-colors font-mono border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs flex items-center gap-1.5 ${className}`}
      >
        <span>↑</span>
        <span>העלה JSON</span>
      </button>
    </div>
  );
}
