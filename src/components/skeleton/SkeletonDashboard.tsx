"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Command } from "cmdk";

export default function SkeletonDashboard() {
  const { project, setStage, updateTask, getBufferStatus, getConsumedBufferDays, exportJSON } = useAppStore();
  const [mvpOnly, setMvpOnly] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Toggle Command Palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSON());
    const el = document.createElement('a');
    el.setAttribute("href", dataStr);
    el.setAttribute("download", "project-export.json");
    el.click();
  };

  const bufferStatus = getBufferStatus();
  const bufferColor = bufferStatus === 'green' ? 'bg-[#22c55e] shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                      bufferStatus === 'yellow' ? 'bg-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 
                      'bg-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.5)]';

  const toggleTaskComplete = (aveId: string, taskId: string, completed: boolean) => {
    updateTask(aveId, taskId, { completed: !completed });
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex justify-center py-12 px-6">
      
      {/* Header & Controls */}
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-end mb-12 border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-3xl font-light mb-1">{project.oneLiner || "Untitled"}</h1>
            <div className="text-sm text-zinc-500 flex gap-4">
              <span>{project.avenues.length} Avenues</span>
              <span>Buffer: {getConsumedBufferDays()} / {project.totalBufferDays}d</span>
              <button onClick={() => setDrawerOpen(true)} className="hover:text-zinc-300">View Story</button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-zinc-400">MVP ONLY</span>
              <button 
                onClick={() => setMvpOnly(!mvpOnly)}
                className={`relative w-10 h-5 rounded-full transition-colors ${mvpOnly ? 'bg-zinc-200' : 'bg-zinc-800'}`}
              >
                <motion.div 
                  layout
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full ${mvpOnly ? 'bg-black translate-x-5' : 'bg-zinc-400'}`}
                />
              </button>
            </div>
            
            {/* Global Traffic Light */}
            <div className="relative group cursor-help">
              <div className={`w-3 h-3 rounded-full ${bufferColor}`} />
            </div>

            <button onClick={() => setStage(1)} className="text-xs text-zinc-500 hover:text-white transition-colors">Edit Journey</button>
          </div>
        </div>

        {/* Tree Structure */}
        <div className="space-y-8">
          {project.avenues.map(ave => {
            const visibleTasks = mvpOnly ? ave.tasks.filter(t => t.isEssential) : ave.tasks;
            if (visibleTasks.length === 0) return null;

            return (
              <div key={ave.id} className="space-y-3">
                <h3 className="font-medium text-zinc-200 uppercase tracking-widest text-xs flex items-center gap-2">
                  {ave.title} 
                  {ave.isCriticalPath && <span className="text-[9px] border border-red-900 text-red-500 px-1 rounded bg-red-950/20">Critical</span>}
                </h3>
                
                <div className="pl-4 space-y-1 border-l border-zinc-900">
                  <AnimatePresence>
                    {visibleTasks.map(task => (
                      <motion.div 
                        key={task.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-between py-2 pr-2 group hover:bg-zinc-900/40 rounded-sm -ml-4 pl-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleTaskComplete(ave.id, task.id, task.completed)}
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${task.completed ? 'bg-zinc-300 border-zinc-300' : 'border-zinc-700 hover:border-zinc-500'}`}
                          >
                            {task.completed && <span className="text-black text-[10px]">✓</span>}
                          </button>
                          <span className={`text-sm transition-colors ${task.completed ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                            {task.title}
                          </span>
                          {!task.isEssential && !mvpOnly && (
                            <span className="text-[10px] text-zinc-700 uppercase border border-zinc-800 px-1 rounded">Extra</span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 opacity-100 sm:opacity-50 sm:group-hover:opacity-100 transition-opacity">
                          {/* OKR Badge */}
                          {task.okr && task.okr.target > 0 && (
                            <div className="text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-sm text-zinc-400 font-mono flex items-center gap-2">
                              <span>{task.okr.metric}:</span>
                              <div className="flex items-center text-zinc-300">
                                <input 
                                  className="bg-transparent w-8 text-right focus:outline-none focus:text-white" 
                                  value={task.okr.current} 
                                  onChange={(e) => updateTask(ave.id, task.id, { okr: { ...task.okr, current: Number(e.target.value) } })}
                                />
                                <span>/ {task.okr.target} {task.okr.unit}</span>
                              </div>
                            </div>
                          )}

                          {/* Task Delay/Buffer Modifier */}
                          {task.isBottleneck && (
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="text-yellow-600">Delay:</span>
                              <input 
                                className="bg-transparent border border-zinc-800 rounded px-1 w-8 text-center text-zinc-300 focus:outline-none focus:border-zinc-500" 
                                value={task.delayDays} 
                                onChange={(e) => updateTask(ave.id, task.id, { delayDays: Number(e.target.value) })}
                              />
                              <span className="text-zinc-600">d</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 pt-6 border-t border-zinc-900 flex justify-between items-center text-xs text-zinc-600">
          <div>Press <kbd className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">Cmd + K</kbd> for command palette</div>
          <button onClick={handleExport} className="hover:text-white transition-colors">Export JSON</button>
        </div>
      </div>

      {/* Story Drawer Slide-over */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-[400px] bg-zinc-950 border-l border-zinc-900 p-6 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-medium">Project Story & Gaps</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            
            <div className="space-y-6 text-sm text-zinc-400">
              <div>
                <h4 className="text-zinc-500 text-xs mb-1 uppercase">Problem</h4>
                <p className="text-zinc-200">{project.problem}</p>
              </div>
              <div>
                <h4 className="text-zinc-500 text-xs mb-1 uppercase">Day in the life</h4>
                <p className="text-zinc-200">{project.dayInTheLife}</p>
              </div>
              <div>
                <h4 className="text-zinc-500 text-xs mb-1 uppercase">Pre-mortem</h4>
                <p className="text-red-300/80">{project.preMortem}</p>
              </div>
              <div className="pt-4 border-t border-zinc-900">
                <h4 className="text-zinc-500 text-xs mb-3 uppercase flex justify-between items-center">
                  Knowledge Gaps
                  <button onClick={() => setStage(1)} className="text-[10px] text-zinc-600 hover:text-white">Edit in Wizard</button>
                </h4>
                <div className="space-y-3">
                  {project.knowledgeGaps.map(g => (
                    <div key={g.id} className="bg-black border border-zinc-900 p-3 rounded-md">
                      <div className="text-zinc-300 mb-1">{g.description}</div>
                      <div className="text-[10px] text-zinc-500">Mitigation: {g.mitigation}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette */}
      {cmdOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <Command 
            className="w-[500px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center px-4 border-b border-zinc-900">
              <Command.Input 
                className="w-full bg-transparent text-sm py-4 focus:outline-none placeholder:text-zinc-600 text-white" 
                placeholder="Type a command or search..."
                autoFocus
              />
              <button onClick={() => setCmdOpen(false)} className="text-[10px] bg-zinc-900 px-2 py-1 rounded text-zinc-500">ESC</button>
            </div>
            
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="text-sm text-zinc-500 p-4 text-center">No results found.</Command.Empty>
              <Command.Group heading="Actions" className="text-xs text-zinc-600 font-medium px-2 py-2">
                <Command.Item 
                  onSelect={() => { setMvpOnly(!mvpOnly); setCmdOpen(false); }}
                  className="px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900"
                >
                  Toggle MVP Mode
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setDrawerOpen(true); setCmdOpen(false); }}
                  className="px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900"
                >
                  View Story & Pre-mortem
                </Command.Item>
                <Command.Item 
                  onSelect={() => { handleExport(); setCmdOpen(false); }}
                  className="px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900"
                >
                  Export JSON
                </Command.Item>
                <Command.Item 
                  onSelect={() => { setStage(1); setCmdOpen(false); }}
                  className="px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white rounded cursor-pointer data-[selected=true]:bg-zinc-900"
                >
                  Return to Edit Journey (Stage 1)
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </div>
      )}

    </div>
  );
}
