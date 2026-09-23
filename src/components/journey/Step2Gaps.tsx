"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { GapCategory } from "@/types/project";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step2Gaps({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState<GapCategory>("critical");
  const [newMit, setNewMit] = useState("");

  const catLabels: Record<GapCategory, { label: string; desc: string }> = {
    critical: {
      label: "פער קריטי",
      desc: "חוסר ידע שעלול להביא לביטול הפרויקט",
    },
    acquired: {
      label: "פער נרכש",
      desc: "ידע שנלמד ומעמיקים בו תוך כדי תנועה",
    },
  };

  const handleAdd = () => {
    if (!newDesc.trim()) return;
    const gap = {
      id: Math.random().toString(36).substring(2, 9),
      description: newDesc,
      category: newCat,
      mitigation: newMit || "העמקת ידע וניסוי מקדים",
    };
    updateProject({ knowledgeGaps: [...project.knowledgeGaps, gap] });
    setNewDesc("");
    setNewMit("");
  };

  const handleRemove = (id: string) => {
    updateProject({ knowledgeGaps: project.knowledgeGaps.filter(g => g.id !== id) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(3);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-sm space-y-1.5">
        {project.knowledgeGaps.length === 0 ? (
          <div className="text-zinc-500 italic">לא הוגדרו פערי ידע.</div>
        ) : (
          project.knowledgeGaps.map(g => (
            <div key={g.id} className="flex gap-2 items-center text-xs">
              <span className={`w-1.5 h-1.5 rounded-full ${g.category === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
              <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{g.description}</span>
              <span className="text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                {catLabels[g.category]?.label || g.category}
              </span>
            </div>
          ))
        )}
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="space-y-1 text-xs text-zinc-500 font-light leading-relaxed border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        <p>
          באילו תחומי עניין הפרויקט מתמקד? אילו הנחות יסוד או טכנולוגיות אני לא יודע בצורה מספקת?
        </p>
        <p>
          נחשוב איפה יש לנו פערי ידע שיכולים לגרום לביטול הפרויקט. הבדל בין <strong>״פער קריטי״</strong> לבין <strong>״פער נרכש״</strong>.
        </p>
      </div>

      {/* Existing Gaps */}
      <div className="space-y-2">
        {project.knowledgeGaps.map((gap) => (
          <div key={gap.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900/60 flex justify-between items-start group">
            <div>
              <div className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">{gap.description}</div>
              <div className="text-xs text-zinc-500 mt-1 flex gap-2.5 items-center font-mono">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  gap.category === 'critical'
                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900/60'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400'
                }`}>
                  {catLabels[gap.category]?.label || gap.category}
                </span>
                <span>בדיקה: {gap.mitigation}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(gap.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
          </div>
        ))}
      </div>

      {/* New Gap Form */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded space-y-3">
        <input 
          className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 placeholder:text-zinc-400"
          placeholder="תאר את פער הידע (טכנולוגיה, שיטה, רגולציה)..."
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step2-mit')?.focus()}
        />
        
        {/* Toggle Critical vs Acquired */}
        <div className="flex gap-2">
          {(['critical', 'acquired'] as GapCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setNewCat(cat)}
              className={`text-xs px-3 py-1 rounded border transition-colors font-mono ${
                newCat === cat 
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-black border-transparent font-medium' 
                  : 'bg-white dark:bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {catLabels[cat].label}
            </button>
          ))}
        </div>

        <input 
          id="step2-mit"
          className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 placeholder:text-zinc-400"
          placeholder="פעולת אימות מקדימה / ניסוי מהיר (ספייק קוד, בדיקה)"
          value={newMit}
          onChange={(e) => setNewMit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
              e.preventDefault();
            } else {
              handleKeyDown(e);
            }
          }}
        />

        <div className="flex justify-end pt-1">
          <button 
            onClick={handleAdd} 
            className="text-xs bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-1.5 rounded font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            + הוסף פער ידע
          </button>
        </div>
      </div>

      {/* Suggested Reading References */}
      <div className="p-3 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded text-xs text-zinc-600 dark:text-zinc-400">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100 block mb-1 font-mono text-[11px] uppercase tracking-wider">
          עקרונות ומתודולוגיות מומלצות לתכנון הפרויקט:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px] font-mono text-zinc-500">
          <div>• Thinking, Fast and Slow (Kahneman)</div>
          <div>• The Goal (Eliyahu Goldratt)</div>
          <div>• Making Things Happen (Scott Berkun)</div>
          <div>• Measure What Matters (John Doerr)</div>
          <div>• How Big Things Get Done (Flyvbjerg)</div>
          <div>• User Story Mapping (Jeff Patton)</div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          הקש <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">Enter</kbd> לשמירה ומעבר
        </div>
        <button 
          onClick={() => setActiveStep(3)}
          className="bg-zinc-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          המשך לשלב 3 ←
        </button>
      </div>
    </motion.div>
  );
}
