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
      desc: "חוסר ידע שעלול להביא לביטול הפרויקט (למשל: טכנולוגיה לא בשלה)",
    },
    acquired: {
      label: "פער נרכש",
      desc: "ידע שנלמד ומעמיקים בו תוך כדי תנועה לאורך הפרויקט",
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
          <div className="text-[#86868b] italic">לא הוגדרו פערי ידע.</div>
        ) : (
          project.knowledgeGaps.map(g => (
            <div key={g.id} className="flex gap-2 items-center text-xs">
              <span className={`w-2 h-2 rounded-full ${g.category === 'critical' ? 'bg-red-500' : 'bg-amber-500'}`} />
              <span className="font-medium text-[#1d1d1f] dark:text-zinc-200 truncate">{g.description}</span>
              <span className="text-[10px] font-mono text-[#86868b] border border-[#d8d4ca] dark:border-zinc-800 px-1.5 py-0.5 rounded">
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
      
      <div className="space-y-2 text-xs text-[#666] dark:text-zinc-400 font-light leading-relaxed border-r-2 border-[#1d1d1f] dark:border-white pr-3">
        <p>
          <strong>באילו תחומי עניין הפרויקט מתמקד?</strong> אילו הנחות יסוד או טכנולוגיות אני לא יודע בצורה מספקת?
        </p>
        <p>
          בשלב זה נחשוב איפה יש לנו פערי ידע שיכולים לגרום לביטול הפרויקט (למשל פתרון בעיה במקום שבו הטכנולוגיה עדיין אינה בשלה). הלמידה היא דינמית ולאורך כל הפרויקט, תוך הבדלה מובהקת בין <strong>״פער קריטי״</strong> לבין <strong>״פער נרכש״</strong>.
        </p>
      </div>

      {/* Existing Gaps */}
      <div className="space-y-2.5">
        {project.knowledgeGaps.map((gap) => (
          <div key={gap.id} className="p-3.5 border border-[#e2ded5] dark:border-zinc-800 rounded-xl bg-white/70 dark:bg-zinc-950/70 shadow-sm flex justify-between items-start group">
            <div>
              <div className="text-sm text-[#1d1d1f] dark:text-zinc-200 font-medium">{gap.description}</div>
              <div className="text-xs text-[#86868b] mt-1.5 flex gap-2.5 items-center">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  gap.category === 'critical'
                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900/60'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60'
                }`}>
                  {catLabels[gap.category]?.label || gap.category}
                </span>
                <span>פעולת למידה/אימות: {gap.mitigation}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(gap.id)} className="text-[#86868b] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
          </div>
        ))}
      </div>

      {/* New Gap Form */}
      <div className="bg-[#f7f5ef] dark:bg-zinc-950 p-4 border border-[#e5e1d6] dark:border-zinc-900 rounded-2xl space-y-3">
        <input 
          className="w-full bg-transparent border-b border-[#dcd8ce] dark:border-zinc-800 pb-2 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
          placeholder="מהו פער הידע או ההנחה הלא ידועה? (טכנולוגיה, פלטפורמה, שיטה)..."
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
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all text-right ${
                newCat === cat 
                  ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black border-transparent font-medium shadow-sm' 
                  : 'bg-white/80 dark:bg-transparent border-[#dcd8ce] dark:border-zinc-800 text-[#666] hover:text-[#1d1d1f]'
              }`}
            >
              <div className="font-semibold">{catLabels[cat].label}</div>
            </button>
          ))}
        </div>

        <input 
          id="step2-mit"
          className="w-full bg-transparent border-b border-[#dcd8ce] dark:border-zinc-800 pb-2 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
          placeholder="תוכנית הלמידה / בדיקה מקדימה (למשל: קריאת עקרונות מספר, ספייק קוד בג'מיני)"
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
        <button 
          onClick={handleAdd} 
          className="text-xs text-[#1d1d1f] dark:text-zinc-300 font-semibold hover:opacity-80 transition-opacity pt-1 block"
        >
          + הוסף פער ידע לרשימה
        </button>
      </div>

      {/* Suggested Reading References Accordion/Card */}
      <div className="p-3 bg-white/70 dark:bg-zinc-950/70 border border-[#e2ded5] dark:border-zinc-800 rounded-xl text-xs text-[#666] dark:text-zinc-400">
        <span className="font-semibold text-[#1d1d1f] dark:text-white block mb-1">
          📚 מקורות ידע ומתודולוגיות מומלצות לתכנון הפרויקט:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px] font-mono text-[#86868b]">
          <div>• Thinking, Fast and Slow (Kahneman)</div>
          <div>• The Goal (Eliyahu Goldratt)</div>
          <div>• Making Things Happen (Scott Berkun)</div>
          <div>• Measure What Matters (John Doerr)</div>
          <div>• How Big Things Get Done (Flyvbjerg)</div>
          <div>• User Story Mapping (Jeff Patton)</div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">
          הקש <kbd className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 rounded font-mono text-[11px] shadow-sm">Cmd + Enter</kbd> למעבר
        </div>
        <button 
          onClick={() => setActiveStep(3)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          המשך לשלב 3 ←
        </button>
      </div>
    </motion.div>
  );
}
