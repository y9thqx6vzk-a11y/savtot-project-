"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useAppMotion } from "@/lib/useMotionConfig";
import { GapCategory } from "@/types/project";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function SkeletonDashboard() {
  const { 
    project, 
    setStage, 
    updateProject,
    updateTask, 
    getBufferStatus, 
    getConsumedBufferDays, 
    exportJSON,
    collapsedAvenueIds,
    toggleAvenueCollapse,
    theme,
  } = useAppStore();

  const { transition, shouldReduceMotion } = useAppMotion();

  const [mvpOnly, setMvpOnly] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Inline gap creation state inside drawer
  const [newGapDesc, setNewGapDesc] = useState("");
  const [newGapCat, setNewGapCat] = useState<GapCategory>("critical");
  const [newGapMit, setNewGapMit] = useState("");

  const catLabels: Record<GapCategory, string> = {
    critical: "פער קריטי (סיכון לפרויקט)",
    acquired: "פער נרכש (נלמד תוך כדי)",
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
        return;
      }

      if (isInput) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShortcutsOpen((s) => !s);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setMvpOnly((prev) => !prev);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        setDrawerOpen((prev) => !prev);
      } else if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        setStage(1);
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        handleExport();
      } else if (e.key === "Escape") {
        setCmdOpen(false);
        setDrawerOpen(false);
        setShortcutsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON());
    const el = document.createElement('a');
    el.setAttribute("href", dataStr);
    el.setAttribute("download", `project-skeleton-${Date.now()}.json`);
    el.click();
  };

  const handleAvenueClick = (aveId: string) => {
    if (focusMode) {
      project.avenues.forEach(a => {
        if (a.id !== aveId && !collapsedAvenueIds.includes(a.id)) {
          toggleAvenueCollapse(a.id);
        }
      });
      if (collapsedAvenueIds.includes(aveId)) {
        toggleAvenueCollapse(aveId);
      }
    } else {
      toggleAvenueCollapse(aveId);
    }
  };

  const handleAddDrawerGap = () => {
    if (!newGapDesc.trim()) return;
    const newGap = {
      id: Math.random().toString(36).substring(2, 9),
      description: newGapDesc,
      category: newGapCat,
      mitigation: newGapMit || "בדיקה מקדימה",
    };
    updateProject({ knowledgeGaps: [...project.knowledgeGaps, newGap] });
    setNewGapDesc("");
    setNewGapMit("");
  };

  const handleRemoveDrawerGap = (id: string) => {
    updateProject({ knowledgeGaps: project.knowledgeGaps.filter(g => g.id !== id) });
  };

  const bufferStatus = getBufferStatus();
  const bufferColor = bufferStatus === 'green' ? 'bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 
                      bufferStatus === 'yellow' ? 'bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 
                      'bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.5)]';

  const bufferStatusText = bufferStatus === 'green'
    ? 'ירוק (< 33%): אין צורך בהתערבות'
    : bufferStatus === 'yellow'
    ? 'צהוב (33%-66%): מעקב מקרוב וזיהוי מגמות עיכוב'
    : 'אדום (> 66%): איתור חסמים והתערבות ממוקדת!';

  const consumedDays = getConsumedBufferDays();
  const totalDays = project.totalBufferDays;
  const bufferPct = totalDays > 0 ? Math.round((consumedDays / totalDays) * 100) : 0;

  const toggleTaskComplete = (aveId: string, taskId: string, completed: boolean) => {
    updateTask(aveId, taskId, { completed: !completed });
  };

  return (
    <div className="min-h-screen flex justify-center py-12 px-6 select-none font-sans text-right" dir="rtl">
      
      <div className="w-full max-w-4xl">
        {/* Top Bar with Theme Toggle & Status */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 border-b border-[#e8e5dc] dark:border-zinc-850 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light tracking-tight text-[#1d1d1f] dark:text-white">
                {project.oneLiner || "לוח השלד (The Skeleton)"}
              </h1>
              {/* Traffic Light Dot (ONLY color on canvas) */}
              <div 
                title={`באפר ביטחון: ${consumedDays}/${totalDays} ימים (${bufferPct}%) - ${bufferStatusText}`}
                className="relative cursor-help"
              >
                <div className={`w-3.5 h-3.5 rounded-full ${bufferColor} transition-all duration-300`} />
              </div>
            </div>

            <div className="text-xs text-[#86868b] flex items-center gap-4 font-mono">
              <span>{project.avenues.length} אפיקי פעולה</span>
              <span>באפר: {consumedDays} / {totalDays} ימים ({bufferPct}%)</span>
              <button 
                onClick={() => setDrawerOpen(true)} 
                className="text-[#1d1d1f] dark:text-white underline underline-offset-4 decoration-[#c5c0b5] hover:opacity-80 transition-opacity font-sans"
              >
                סיפור, פערי ידע ופרה-מורטם [S]
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <ThemeToggle />

            {/* Focus Mode Toggle */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                focusMode 
                  ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black font-semibold border-transparent shadow-sm' 
                  : 'bg-white/80 dark:bg-zinc-900 border-[#e2ded5] dark:border-zinc-800 text-[#666] hover:text-[#1d1d1f]'
              }`}
              title="מיקוד: פתיחת אפיק בודד וסגירת כל השאר כדי למנוע עומס"
            >
              מצב מיקוד
            </button>

            {/* MVP ONLY Switch */}
            <div className="flex items-center gap-2.5 bg-white/80 dark:bg-zinc-900 px-3.5 py-1 rounded-full border border-[#e2ded5] dark:border-zinc-800 shadow-sm">
              <span className="text-xs font-semibold text-[#1d1d1f] dark:text-zinc-300">גרסת חצי הזמן (MVP)</span>
              <button 
                onClick={() => setMvpOnly(!mvpOnly)}
                className={`relative w-9 h-5 rounded-full transition-colors ${mvpOnly ? 'bg-[#1d1d1f] dark:bg-white' : 'bg-[#e2ded5] dark:bg-zinc-800'}`}
                aria-label="סנן משימות הכרחיות בלבד"
              >
                <motion.div 
                  layout
                  transition={transition}
                  className={`absolute top-0.5 right-0.5 w-4 h-4 rounded-full ${mvpOnly ? 'bg-white dark:bg-black translate-x-[-16px]' : 'bg-[#8e8e93]'}`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShortcutsOpen(true)}
                className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-white/80 dark:bg-zinc-900 border border-[#e2ded5] dark:border-zinc-800 rounded-full px-2.5 py-1 font-mono shadow-sm"
                title="קיצורי מקלדת"
              >
                ?
              </button>
              <button 
                onClick={() => setStage(1)} 
                className="text-xs text-[#86868b] hover:text-[#1d1d1f] dark:hover:text-white bg-white/80 dark:bg-zinc-900 border border-[#e2ded5] dark:border-zinc-800 rounded-full px-3 py-1 font-sans shadow-sm"
              >
                עריכת המסע [J]
              </button>
            </div>
          </div>
        </div>

        {/* Tree Structure */}
        <div className="space-y-5">
          {project.avenues.map(ave => {
            const visibleTasks = mvpOnly ? ave.tasks.filter(t => t.isEssential) : ave.tasks;
            const isCollapsed = collapsedAvenueIds.includes(ave.id);

            return (
              <div 
                key={ave.id} 
                className="border border-[#e8e5dc] dark:border-zinc-850 rounded-2xl p-5 bg-white/80 dark:bg-zinc-950/80 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all"
              >
                {/* Avenue Header (Click to collapse) */}
                <div 
                  onClick={() => handleAvenueClick(ave.id)}
                  className="flex items-center justify-between cursor-pointer group py-1 select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-[#86868b] transition-transform duration-200">
                      {isCollapsed ? "◀" : "▼"}
                    </span>
                    <h3 className="font-semibold text-[#1d1d1f] dark:text-zinc-100 tracking-wide text-xs uppercase flex items-center gap-2">
                      {ave.title}
                    </h3>
                    {ave.isCriticalPath && (
                      <span className="text-[9px] font-mono border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full uppercase font-bold">
                        שלד בסיסי
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono text-[#86868b]">
                    {visibleTasks.filter(t => t.completed).length} / {visibleTasks.length} הושלמו
                  </div>
                </div>
                
                {/* Task List */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div 
                      key="content"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                      transition={transition}
                      className="mt-3 pr-3 space-y-1 border-r border-[#e8e5dc] dark:border-zinc-800 overflow-hidden"
                    >
                      {visibleTasks.length === 0 ? (
                        <div className="text-xs text-[#86868b] italic py-2">
                          {mvpOnly ? "אין משימות חיוניות לגרסת חצי הזמן באפיק זה." : "לא נוספו משימות לאפיק זה."}
                        </div>
                      ) : (
                        visibleTasks.map(task => {
                          const isCriticalTask = ave.isCriticalPath || task.isBottleneck;

                          return (
                            <motion.div 
                              key={task.id}
                              layout
                              transition={transition}
                              className={`flex items-center justify-between py-2.5 pl-3 pr-3 rounded-xl transition-all group ${
                                isCriticalTask 
                                  ? 'border-r-2 border-[#1d1d1f] dark:border-white bg-[#f8f6f0] dark:bg-zinc-900/40' 
                                  : 'border-r-2 border-transparent hover:bg-[#f7f5ef] dark:hover:bg-zinc-900/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => toggleTaskComplete(ave.id, task.id, task.completed)}
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                    task.completed 
                                      ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black border-transparent shadow-sm' 
                                      : 'border-[#c5c0b5] dark:border-zinc-700 hover:border-[#1d1d1f]'
                                  }`}
                                >
                                  {task.completed && <span className="text-[10px] font-bold">✓</span>}
                                </button>

                                <span className={`text-sm transition-colors ${
                                  task.completed 
                                    ? 'text-[#a1a1a6] line-through' 
                                    : 'text-[#1d1d1f] dark:text-zinc-200 font-medium'
                                }`}>
                                  {task.title}
                                </span>

                                {isCriticalTask && (
                                  <span className="text-[9px] font-mono text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 px-1.5 py-0.5 rounded">
                                    קריטי
                                  </span>
                                )}

                                {!task.isEssential && !mvpOnly && (
                                  <span className="text-[9px] font-mono text-[#86868b] border border-[#e2ded5] dark:border-zinc-800 px-1.5 py-0.5 rounded">
                                    תוספת
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                {/* OKR Quantitative Badge: יש מספר = לא ניתן לפרשנות */}
                                {task.okr && task.okr.target > 0 && (
                                  <div className="text-[10px] bg-white dark:bg-zinc-900 border border-[#e2ded5] dark:border-zinc-800 px-2.5 py-1 rounded-full text-[#555] dark:text-zinc-400 font-mono flex items-center gap-1.5 shadow-sm" title="תוצאת מפתח כמותית">
                                    <span className="text-[#86868b]">{task.okr.metric}:</span>
                                    <div className="flex items-center text-[#1d1d1f] dark:text-zinc-200 font-bold">
                                      <input 
                                        type="number"
                                        className="bg-transparent w-8 text-center focus:outline-none focus:underline font-mono" 
                                        value={task.okr.current} 
                                        onChange={(e) => updateTask(ave.id, task.id, { okr: { ...task.okr, current: Number(e.target.value) } })}
                                      />
                                      <span className="text-[#86868b] font-normal mr-0.5">/ {task.okr.target} {task.okr.unit}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Task Slippage / Delay Modifier */}
                                {task.isBottleneck && (
                                  <div className="flex items-center gap-1 text-[10px] font-mono bg-white dark:bg-zinc-900 px-2.5 py-1 border border-[#e2ded5] dark:border-zinc-800 rounded-full shadow-sm" title="עיכוב בצוואר בקבוק המקזז מהבאפר">
                                    <span className="text-[#86868b]">עיכוב:</span>
                                    <input 
                                      type="number"
                                      className="bg-transparent border border-[#d8d4ca] dark:border-zinc-700 rounded px-1 w-8 text-center text-[#1d1d1f] dark:text-white focus:outline-none font-mono font-bold" 
                                      value={task.delayDays} 
                                      onChange={(e) => updateTask(ave.id, task.id, { delayDays: Number(e.target.value) })}
                                    />
                                    <span className="text-[#86868b]">ימים</span>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Minimal Footer */}
        <div className="mt-14 pt-6 border-t border-[#e8e5dc] dark:border-zinc-850 flex justify-between items-center text-xs text-[#86868b] font-mono">
          <div className="flex items-center gap-2">
            <span>תפריט פקודות:</span> 
            <kbd className="bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-[#d8d4ca] dark:border-zinc-800 text-[#1d1d1f] dark:text-white font-mono shadow-sm">Cmd + K</kbd> 
            <span>או</span>
            <kbd className="bg-white dark:bg-zinc-900 px-2 py-0.5 rounded border border-[#d8d4ca] dark:border-zinc-800 text-[#1d1d1f] dark:text-white font-mono shadow-sm">?</kbd>
          </div>
          <button onClick={handleExport} className="hover:text-[#1d1d1f] dark:hover:text-white transition-colors">
            ייצוא גיבוי JSON [E]
          </button>
        </div>
      </div>

      {/* Story & Risks Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={transition}
            className="fixed top-0 left-0 bottom-0 w-[440px] max-w-full bg-[#fbfaf7] dark:bg-zinc-950 border-r border-[#e8e5dc] dark:border-zinc-800 p-6 shadow-2xl overflow-y-auto z-40 text-right"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#e8e5dc] dark:border-zinc-900">
              <h2 className="text-base font-semibold text-[#1d1d1f] dark:text-white tracking-tight">
                סיפור, פערי ידע ופרה-מורטם
              </h2>
              <button onClick={() => setDrawerOpen(false)} className="text-xs font-mono text-[#86868b] hover:text-[#1d1d1f]">סגור (ESC)</button>
            </div>
            
            <div className="space-y-6 text-sm text-[#555] dark:text-zinc-400">
              <div>
                <h4 className="text-[#86868b] text-[11px] font-semibold mb-1 uppercase tracking-wider">הבעיה המרכזית</h4>
                <p className="text-[#1d1d1f] dark:text-zinc-200 text-xs leading-relaxed">{project.problem || "טרם צוינה"}</p>
              </div>

              <div>
                <h4 className="text-[#86868b] text-[11px] font-semibold mb-1 uppercase tracking-wider">קהל יעד</h4>
                <p className="text-[#1d1d1f] dark:text-zinc-200 text-xs">{project.targetAudience || "טרם צוין"}</p>
              </div>

              <div>
                <h4 className="text-[#86868b] text-[11px] font-semibold mb-1 uppercase tracking-wider">היום שאחרי</h4>
                <p className="text-[#1d1d1f] dark:text-zinc-200 text-xs leading-relaxed">{project.dayInTheLife || "טרם צוין"}</p>
              </div>

              <div>
                <h4 className="text-[#86868b] text-[11px] font-semibold mb-1 uppercase tracking-wider">ניתוח כשל מראש (Pre-Mortem)</h4>
                <p className="text-[#1d1d1f] dark:text-zinc-200 border-r-2 border-[#1d1d1f] dark:border-zinc-700 pr-3 text-xs leading-relaxed italic">
                  {project.preMortem || "טרם הוגדר"}
                </p>
              </div>

              {/* Inline Knowledge Gaps Management */}
              <div className="pt-4 border-t border-[#e8e5dc] dark:border-zinc-900">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[#1d1d1f] dark:text-zinc-200 text-xs font-semibold uppercase tracking-wider">
                    פערי ידע ואי-ודאות ({project.knowledgeGaps.length})
                  </h4>
                </div>

                <div className="space-y-2 mb-4">
                  {project.knowledgeGaps.map(g => (
                    <div key={g.id} className="bg-white dark:bg-black border border-[#e2ded5] dark:border-zinc-900 p-3 rounded-xl shadow-sm group">
                      <div className="flex justify-between items-start">
                        <div className="text-[#1d1d1f] dark:text-zinc-200 text-xs font-medium">{g.description}</div>
                        <button onClick={() => handleRemoveDrawerGap(g.id)} className="text-[#86868b] hover:text-red-500 text-xs opacity-0 group-hover:opacity-100 p-0.5">✕</button>
                      </div>
                      <div className="text-[10px] text-[#86868b] mt-1.5 flex gap-2 items-center">
                        <span className={`font-mono px-1.5 py-0.5 rounded ${
                          g.category === 'critical'
                            ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/30'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30'
                        }`}>
                          {catLabels[g.category]}
                        </span>
                        <span>בדיקה: {g.mitigation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Add Gap Form */}
                <div className="bg-white/80 dark:bg-black border border-[#e2ded5] dark:border-zinc-900 p-3 rounded-2xl space-y-2 shadow-sm">
                  <input 
                    className="w-full bg-transparent border-b border-[#dcd8ce] dark:border-zinc-800 pb-1 text-xs text-[#1d1d1f] dark:text-white placeholder:text-[#a8a49c] focus:outline-none focus:border-[#1d1d1f]"
                    placeholder="הוסף פער ידע / סיכון חדש..."
                    value={newGapDesc}
                    onChange={(e) => setNewGapDesc(e.target.value)}
                  />
                  <div className="flex gap-1.5 pt-1">
                    {(['critical', 'acquired'] as GapCategory[]).map(c => (
                      <button
                        key={c}
                        onClick={() => setNewGapCat(c)}
                        className={`text-[10px] px-2.5 py-0.5 rounded-full border ${
                          newGapCat === c 
                            ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black border-transparent font-medium' 
                            : 'border-[#dcd8ce] dark:border-zinc-800 text-[#666]'
                        }`}
                      >
                        {c === 'critical' ? 'פער קריטי' : 'פער נרכש'}
                      </button>
                    ))}
                  </div>
                  <input 
                    className="w-full bg-transparent border-b border-[#dcd8ce] dark:border-zinc-800 pb-1 text-xs text-[#1d1d1f] dark:text-white placeholder:text-[#a8a49c] focus:outline-none focus:border-[#1d1d1f]"
                    placeholder="פעולת אימות (ניסוי / ספייק)"
                    value={newGapMit}
                    onChange={(e) => setNewGapMit(e.target.value)}
                  />
                  <button 
                    onClick={handleAddDrawerGap}
                    className="w-full bg-[#1d1d1f] text-white dark:bg-white dark:text-black text-xs py-1.5 rounded-full transition-opacity font-semibold mt-1"
                  >
                    + הוסף סיכון לרשימה
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Cheat Sheet Modal */}
      <AnimatePresence>
        {shortcutsOpen && (
          <div 
            onClick={() => setShortcutsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-right"
            dir="rtl"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={transition}
              className="bg-[#fbfaf7] dark:bg-zinc-950 border border-[#e2ded5] dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-[#e8e5dc] dark:border-zinc-900 pb-3">
                <h3 className="text-sm font-semibold text-[#1d1d1f] dark:text-white tracking-wide">קיצורי מקלדת (Keyboard Shortcuts)</h3>
                <button onClick={() => setShortcutsOpen(false)} className="text-xs font-mono text-[#86868b] hover:text-[#1d1d1f]">סגור (ESC)</button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-[#e8e5dc] dark:border-zinc-900">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">פתיחת שורת פקודות (Command Palette)</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">Cmd + K</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e5dc] dark:border-zinc-900">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">סינון גרסת חצי הזמן (MVP בלבד)</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">M</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e5dc] dark:border-zinc-900">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">פתיחת מגירת הסיפור והסיכונים</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">S</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e5dc] dark:border-zinc-900">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">חזרה לאשף The Journey</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">J</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e5dc] dark:border-zinc-900">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">ייצוא גיבוי נתונים לקובץ JSON</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">E</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#e8e5dc] dark:border-zinc-900">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">התקדמות שלב באשף</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">Cmd + Enter</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#555] dark:text-zinc-400 font-sans">סגירת חלונות ומגירות</span>
                  <kbd className="bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded text-[#1d1d1f] dark:text-white shadow-sm">ESC</kbd>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      {cmdOpen && (
        <div 
          onClick={() => setCmdOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-28 px-4"
          dir="rtl"
        >
          <Command 
            className="w-[520px] bg-[#fbfaf7] dark:bg-zinc-950 border border-[#e2ded5] dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden font-sans text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-[#e8e5dc] dark:border-zinc-900">
              <Command.Input 
                className="w-full bg-transparent text-sm py-4 focus:outline-none placeholder:text-[#a8a49c] text-[#1d1d1f] dark:text-white font-medium" 
                placeholder="הקלד פקודה או חפש..."
                autoFocus
              />
              <button onClick={() => setCmdOpen(false)} className="text-[10px] font-mono bg-white dark:bg-zinc-900 px-2 py-1 rounded border border-[#e2ded5] dark:border-zinc-800 text-[#86868b]">ESC</button>
            </div>
            
            <Command.List className="max-h-[320px] overflow-y-auto p-2">
              <Command.Empty className="text-xs text-[#86868b] p-4 text-center">לא נמצאו פקודות תואמות.</Command.Empty>
              
              <Command.Group heading="תצוגה" className="text-[11px] font-semibold text-[#86868b] px-2 py-1.5">
                <Command.Item 
                  onSelect={() => { setMvpOnly(!mvpOnly); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 rounded-lg cursor-pointer data-[selected=true]:bg-white dark:data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>הצג משימות גרסת חצי הזמן (MVP) בלבד</span>
                  <kbd className="font-mono text-[10px] text-[#86868b]">M</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setFocusMode(!focusMode); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 rounded-lg cursor-pointer data-[selected=true]:bg-white dark:data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>הפעל/כבה מצב מיקוד (אפיק יחיד)</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="ניווט ומידע" className="text-[11px] font-semibold text-[#86868b] px-2 py-1.5 mt-2">
                <Command.Item 
                  onSelect={() => { setDrawerOpen(true); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 rounded-lg cursor-pointer data-[selected=true]:bg-white dark:data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>צפה בסיפור, פערי ידע ופרה-מורטם</span>
                  <kbd className="font-mono text-[10px] text-[#86868b]">S</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setShortcutsOpen(true); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 rounded-lg cursor-pointer data-[selected=true]:bg-white dark:data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>רשימת קיצורי מקלדת</span>
                  <kbd className="font-mono text-[10px] text-[#86868b]">?</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setStage(1); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 rounded-lg cursor-pointer data-[selected=true]:bg-white dark:data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>חזרה לעריכת אשף המסע (Stage 1)</span>
                  <kbd className="font-mono text-[10px] text-[#86868b]">J</kbd>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="נתונים" className="text-[11px] font-semibold text-[#86868b] px-2 py-1.5 mt-2">
                <Command.Item 
                  onSelect={() => { handleExport(); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-[#1d1d1f] dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 rounded-lg cursor-pointer data-[selected=true]:bg-white dark:data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>ייצוא גיבוי נתונים לקובץ JSON</span>
                  <kbd className="font-mono text-[10px] text-[#86868b]">E</kbd>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}

    </div>
  );
}
