"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Command } from "cmdk";
import { useAppMotion } from "@/lib/useMotionConfig";
import { GapCategory } from "@/types/project";

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
  } = useAppStore();

  const { transition, shouldReduceMotion } = useAppMotion();

  const [mvpOnly, setMvpOnly] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Inline gap creation state inside drawer
  const [newGapDesc, setNewGapDesc] = useState("");
  const [newGapCat, setNewGapCat] = useState<GapCategory>("tech");
  const [newGapMit, setNewGapMit] = useState("");

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger single-key shortcuts when typing in inputs
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
      // In focus mode, collapse all others and open this one
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
      mitigation: newGapMit || "Under investigation",
    };
    updateProject({ knowledgeGaps: [...project.knowledgeGaps, newGap] });
    setNewGapDesc("");
    setNewGapMit("");
  };

  const handleRemoveDrawerGap = (id: string) => {
    updateProject({ knowledgeGaps: project.knowledgeGaps.filter(g => g.id !== id) });
  };

  const bufferStatus = getBufferStatus();
  const bufferColor = bufferStatus === 'green' ? 'bg-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 
                      bufferStatus === 'yellow' ? 'bg-[#eab308] shadow-[0_0_12px_rgba(234,179,8,0.6)]' : 
                      'bg-[#ef4444] shadow-[0_0_12px_rgba(239,68,68,0.6)]';

  const consumedDays = getConsumedBufferDays();
  const totalDays = project.totalBufferDays;
  const bufferPct = totalDays > 0 ? Math.round((consumedDays / totalDays) * 100) : 0;

  const toggleTaskComplete = (aveId: string, taskId: string, completed: boolean) => {
    updateTask(aveId, taskId, { completed: !completed });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex justify-center py-12 px-6 select-none font-sans">
      
      <div className="w-full max-w-4xl">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-zinc-900 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-3xl font-light tracking-tight text-white">{project.oneLiner || "The Skeleton"}</h1>
              {/* Traffic Light Dot (ONLY color on page) */}
              <div 
                title={`Buffer: ${consumedDays}/${totalDays}d used (${bufferPct}%) - ${bufferStatus.toUpperCase()}`}
                className="relative cursor-help"
              >
                <div className={`w-3 h-3 rounded-full ${bufferColor} transition-all duration-300`} />
              </div>
            </div>

            <div className="text-xs text-zinc-500 flex items-center gap-4 font-mono">
              <span>{project.avenues.length} Avenues</span>
              <span>Buffer: {consumedDays} / {totalDays}d ({bufferPct}%)</span>
              <button 
                onClick={() => setDrawerOpen(true)} 
                className="text-zinc-400 hover:text-white underline underline-offset-4 decoration-zinc-800 transition-colors"
              >
                Story & Risks [S]
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-5 flex-wrap">
            {/* Focus Mode Toggle */}
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded border transition-colors ${focusMode ? 'bg-white text-black font-semibold border-white' : 'border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
              title="Only keep one avenue open at a time"
            >
              Focus Mode
            </button>

            {/* MVP ONLY Switch */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono tracking-wider uppercase text-zinc-400">MVP ONLY</span>
              <button 
                onClick={() => setMvpOnly(!mvpOnly)}
                className={`relative w-10 h-5 rounded-full transition-colors ${mvpOnly ? 'bg-white' : 'bg-zinc-800'}`}
                aria-label="Toggle MVP Only Mode"
              >
                <motion.div 
                  layout
                  transition={transition}
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full ${mvpOnly ? 'bg-black translate-x-5' : 'bg-zinc-400'}`}
                />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShortcutsOpen(true)}
                className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-800 rounded px-2 py-1 font-mono"
                title="Keyboard Shortcuts"
              >
                ?
              </button>
              <button 
                onClick={() => setStage(1)} 
                className="text-xs text-zinc-500 hover:text-white transition-colors border border-zinc-800 rounded px-2.5 py-1 font-mono"
              >
                Edit [J]
              </button>
            </div>
          </div>
        </div>

        {/* Tree Structure */}
        <div className="space-y-6">
          {project.avenues.map(ave => {
            const visibleTasks = mvpOnly ? ave.tasks.filter(t => t.isEssential) : ave.tasks;
            const isCollapsed = collapsedAvenueIds.includes(ave.id);

            return (
              <div key={ave.id} className="border border-zinc-900/60 rounded-md p-4 bg-zinc-950/40">
                {/* Avenue Header (Click to collapse) */}
                <div 
                  onClick={() => handleAvenueClick(ave.id)}
                  className="flex items-center justify-between cursor-pointer group py-1 select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-zinc-600 transition-transform duration-200">
                      {isCollapsed ? "▶" : "▼"}
                    </span>
                    <h3 className="font-semibold text-zinc-200 tracking-wider text-xs uppercase flex items-center gap-2">
                      {ave.title}
                    </h3>
                    {ave.isCriticalPath && (
                      <span className="text-[9px] font-mono border border-zinc-700 bg-zinc-900 text-white px-1.5 py-0.5 rounded uppercase font-semibold">
                        Critical Path
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] font-mono text-zinc-600">
                    {visibleTasks.filter(t => t.completed).length} / {visibleTasks.length} done
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
                      className="mt-3 pl-3 space-y-1 border-l border-zinc-800/80 overflow-hidden"
                    >
                      {visibleTasks.length === 0 ? (
                        <div className="text-xs text-zinc-600 italic py-2">
                          {mvpOnly ? "No essential MVP tasks in this avenue." : "No tasks added yet."}
                        </div>
                      ) : (
                        visibleTasks.map(task => {
                          const isCriticalTask = ave.isCriticalPath || task.isBottleneck;

                          return (
                            <motion.div 
                              key={task.id}
                              layout
                              transition={transition}
                              className={`flex items-center justify-between py-2 pr-3 pl-3 rounded transition-colors group ${isCriticalTask ? 'border-l-2 border-white bg-zinc-900/30' : 'border-l-2 border-transparent hover:bg-zinc-900/40'}`}
                            >
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => toggleTaskComplete(ave.id, task.id, task.completed)}
                                  className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${task.completed ? 'bg-white border-white' : 'border-zinc-700 hover:border-zinc-400'}`}
                                >
                                  {task.completed && <span className="text-black text-[10px] font-bold">✓</span>}
                                </button>

                                <span className={`text-sm transition-colors ${task.completed ? 'text-zinc-600 line-through' : 'text-zinc-200 font-medium'}`}>
                                  {task.title}
                                </span>

                                {isCriticalTask && (
                                  <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1 rounded uppercase tracking-wider">
                                    Critical
                                  </span>
                                )}

                                {!task.isEssential && !mvpOnly && (
                                  <span className="text-[9px] font-mono text-zinc-600 uppercase border border-zinc-900 px-1 rounded">
                                    Extra
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-4">
                                {/* OKR Quantitative Badge */}
                                {task.okr && task.okr.target > 0 && (
                                  <div className="text-[10px] bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-mono flex items-center gap-1.5">
                                    <span className="text-zinc-500">{task.okr.metric}:</span>
                                    <div className="flex items-center text-zinc-200 font-bold">
                                      <input 
                                        type="number"
                                        className="bg-transparent w-8 text-right focus:outline-none focus:text-white font-mono" 
                                        value={task.okr.current} 
                                        onChange={(e) => updateTask(ave.id, task.id, { okr: { ...task.okr, current: Number(e.target.value) } })}
                                      />
                                      <span className="text-zinc-500 font-normal ml-0.5">/ {task.okr.target} {task.okr.unit}</span>
                                    </div>
                                  </div>
                                )}

                                {/* Task Slippage / Delay Modifier */}
                                {task.isBottleneck && (
                                  <div className="flex items-center gap-1 text-[10px] font-mono bg-zinc-950 px-2 py-0.5 border border-zinc-900 rounded">
                                    <span className="text-zinc-400">Delay:</span>
                                    <input 
                                      type="number"
                                      className="bg-transparent border border-zinc-800 rounded px-1 w-8 text-center text-white focus:outline-none focus:border-zinc-500 font-mono" 
                                      value={task.delayDays} 
                                      onChange={(e) => updateTask(ave.id, task.id, { delayDays: Number(e.target.value) })}
                                    />
                                    <span className="text-zinc-600">d</span>
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
        <div className="mt-16 pt-6 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-600 font-mono">
          <div className="flex items-center gap-2">
            <span>Press</span> 
            <kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-400 font-mono">Cmd + K</kbd> 
            <span>or</span>
            <kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-400 font-mono">?</kbd>
          </div>
          <button onClick={handleExport} className="hover:text-white transition-colors">
            Export JSON [E]
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
            className="fixed top-0 right-0 bottom-0 w-[420px] max-w-full bg-zinc-950 border-l border-zinc-900 p-6 shadow-2xl overflow-y-auto z-40"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-900">
              <h2 className="text-base font-medium text-white tracking-tight">Project Story & Gaps</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-zinc-500 hover:text-white text-xs font-mono">ESC</button>
            </div>
            
            <div className="space-y-6 text-sm text-zinc-400">
              <div>
                <h4 className="text-zinc-500 text-[11px] font-mono mb-1 uppercase tracking-wider">Root Problem</h4>
                <p className="text-zinc-200 text-xs leading-relaxed">{project.problem || "None specified"}</p>
              </div>

              <div>
                <h4 className="text-zinc-500 text-[11px] font-mono mb-1 uppercase tracking-wider">Target Audience</h4>
                <p className="text-zinc-200 text-xs">{project.targetAudience || "None specified"}</p>
              </div>

              <div>
                <h4 className="text-zinc-500 text-[11px] font-mono mb-1 uppercase tracking-wider">Day in the Life</h4>
                <p className="text-zinc-200 text-xs leading-relaxed">{project.dayInTheLife || "None specified"}</p>
              </div>

              <div>
                <h4 className="text-zinc-500 text-[11px] font-mono mb-1 uppercase tracking-wider">Pre-Mortem Failure Scenario</h4>
                <p className="text-zinc-300 border-l-2 border-zinc-700 pl-3 text-xs leading-relaxed italic">{project.preMortem || "None specified"}</p>
              </div>

              {/* Inline Knowledge Gaps Management */}
              <div className="pt-4 border-t border-zinc-900">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-zinc-400 text-xs font-mono uppercase tracking-wider">
                    Knowledge Gaps ({project.knowledgeGaps.length})
                  </h4>
                </div>

                <div className="space-y-2 mb-4">
                  {project.knowledgeGaps.map(g => (
                    <div key={g.id} className="bg-black border border-zinc-900 p-2.5 rounded group">
                      <div className="flex justify-between items-start">
                        <div className="text-zinc-200 text-xs font-medium">{g.description}</div>
                        <button onClick={() => handleRemoveDrawerGap(g.id)} className="text-zinc-600 hover:text-white text-xs opacity-0 group-hover:opacity-100">✕</button>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 flex gap-2 items-center">
                        <span className="font-mono uppercase bg-zinc-900 px-1 rounded text-zinc-400">{g.category}</span>
                        <span>Spike: {g.mitigation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Add Gap Form */}
                <div className="bg-black border border-zinc-900 p-3 rounded space-y-2">
                  <input 
                    className="w-full bg-transparent border-b border-zinc-800 pb-1 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500"
                    placeholder="Add new gap / unverified assumption..."
                    value={newGapDesc}
                    onChange={(e) => setNewGapDesc(e.target.value)}
                  />
                  <div className="flex gap-1.5 pt-1">
                    {(['tech', 'market', 'execution'] as GapCategory[]).map(c => (
                      <button
                        key={c}
                        onClick={() => setNewGapCat(c)}
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${newGapCat === c ? 'bg-white text-black border-white' : 'border-zinc-800 text-zinc-500'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <input 
                    className="w-full bg-transparent border-b border-zinc-800 pb-1 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-zinc-500"
                    placeholder="Mitigation experiment / spike"
                    value={newGapMit}
                    onChange={(e) => setNewGapMit(e.target.value)}
                  />
                  <button 
                    onClick={handleAddDrawerGap}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-[11px] py-1.5 rounded transition-colors font-medium"
                  >
                    + Add Risk Item
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={transition}
              className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Keyboard Shortcuts</h3>
                <button onClick={() => setShortcutsOpen(false)} className="text-xs font-mono text-zinc-500 hover:text-white">ESC</button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400">Open Command Palette</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">Cmd + K</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400">Toggle MVP Only View</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">M</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400">Open Story & Risks Drawer</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">S</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400">Return to The Journey (Wizard)</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">J</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400">Export JSON Backup</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">E</kbd>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-900">
                  <span className="text-zinc-400">Advance Step in Wizard</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">Cmd + Enter</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-400">Close Any Modal or Drawer</span>
                  <kbd className="bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-white">ESC</kbd>
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-28 px-4"
        >
          <Command 
            className="w-[520px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-zinc-900">
              <Command.Input 
                className="w-full bg-transparent text-sm py-4 focus:outline-none placeholder:text-zinc-600 text-white font-medium" 
                placeholder="Type a command or search..."
                autoFocus
              />
              <button onClick={() => setCmdOpen(false)} className="text-[10px] font-mono bg-zinc-900 px-2 py-1 rounded text-zinc-500">ESC</button>
            </div>
            
            <Command.List className="max-h-[320px] overflow-y-auto p-2">
              <Command.Empty className="text-xs text-zinc-500 p-4 text-center">No matching commands.</Command.Empty>
              
              <Command.Group heading="Display" className="text-[10px] font-mono uppercase text-zinc-500 px-2 py-1.5">
                <Command.Item 
                  onSelect={() => { setMvpOnly(!mvpOnly); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>Toggle MVP Only View</span>
                  <kbd className="font-mono text-[10px] text-zinc-500">M</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setFocusMode(!focusMode); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900"
                >
                  <span>Toggle Focus Mode (Single Avenue)</span>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Navigation & Context" className="text-[10px] font-mono uppercase text-zinc-500 px-2 py-1.5 mt-2">
                <Command.Item 
                  onSelect={() => { setDrawerOpen(true); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>View Story, Gaps & Pre-mortem</span>
                  <kbd className="font-mono text-[10px] text-zinc-500">S</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setShortcutsOpen(true); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>Keyboard Shortcuts Cheat Sheet</span>
                  <kbd className="font-mono text-[10px] text-zinc-500">?</kbd>
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setStage(1); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>Return to The Journey (Wizard)</span>
                  <kbd className="font-mono text-[10px] text-zinc-500">J</kbd>
                </Command.Item>
              </Command.Group>

              <Command.Group heading="Data" className="text-[10px] font-mono uppercase text-zinc-500 px-2 py-1.5 mt-2">
                <Command.Item 
                  onSelect={() => { handleExport(); setCmdOpen(false); }}
                  className="px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900 flex justify-between"
                >
                  <span>Export JSON Backup</span>
                  <kbd className="font-mono text-[10px] text-zinc-500">E</kbd>
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}

    </div>
  );
}
