"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step5Tasks({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateAvenue, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeAvenueId, setActiveAvenueId] = useState<string | null>(project.avenues[0]?.id || null);
  const [isEssential, setIsEssential] = useState(true);

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeAvenueId) return;
    
    const avenue = project.avenues.find(a => a.id === activeAvenueId);
    if (!avenue) return;

    const newTask = {
      id: Math.random().toString(36).substring(2, 9),
      title: newTaskTitle,
      isEssential: isEssential,
      isBottleneck: false,
      delayDays: 0,
      okr: { metric: "", target: 0, current: 0, unit: "" },
      completed: false,
    };

    updateAvenue(activeAvenueId, { tasks: [...avenue.tasks, newTask] });
    setNewTaskTitle("");
  };

  const removeTask = (avenueId: string, taskId: string) => {
    const avenue = project.avenues.find(a => a.id === avenueId);
    if (!avenue) return;
    updateAvenue(avenueId, { tasks: avenue.tasks.filter(t => t.id !== taskId) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(6);
    }
  };

  if (!isActive && isPast) {
    const totalTasks = project.avenues.reduce((acc, ave) => acc + ave.tasks.length, 0);
    const essentialTasks = project.avenues.reduce((acc, ave) => acc + ave.tasks.filter(t => t.isEssential).length, 0);
    return (
      <motion.div layout transition={transition} className="text-zinc-400 text-sm">
        <span className="text-white font-mono font-medium">{totalTasks}</span> total tasks (<span className="text-white font-mono font-medium">{essentialTasks}</span> MVP Essential)
      </motion.div>
    );
  }

  if (project.avenues.length === 0) {
    return (
      <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-zinc-500">
        Please define at least one Avenue in Step 3 first.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Avenue Pills */}
      <div className="flex gap-2 border-b border-zinc-900 pb-3 overflow-x-auto no-scrollbar">
        {project.avenues.map(ave => (
          <button
            key={ave.id}
            onClick={() => setActiveAvenueId(ave.id)}
            className={`text-xs px-3 py-1.5 rounded whitespace-nowrap transition-colors font-medium ${activeAvenueId === ave.id ? 'bg-white text-black font-semibold' : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'}`}
          >
            {ave.title} <span className="font-mono text-[10px] opacity-70">({ave.tasks.length})</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {project.avenues.find(a => a.id === activeAvenueId)?.tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between group p-2.5 bg-zinc-950 border border-zinc-900 rounded">
            <div className="flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${task.isEssential ? 'bg-white' : 'bg-zinc-600'}`} />
              <span className={`text-sm ${task.isEssential ? 'text-white font-medium' : 'text-zinc-400'}`}>{task.title}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase border border-zinc-800 px-1 rounded">
                {task.isEssential ? 'Essential' : 'Nice-to-have'}
              </span>
            </div>
            <button onClick={() => removeTask(activeAvenueId!, task.id)} className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded space-y-3 mt-4">
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-700"
          placeholder="New task name..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
              e.preventDefault();
            } else {
              handleKeyDown(e);
            }
          }}
        />
        <div className="flex items-center gap-5 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="radio" checked={isEssential} onChange={() => setIsEssential(true)} className="accent-white" />
            <span className="text-xs text-white font-medium">Essential for MVP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="radio" checked={!isEssential} onChange={() => setIsEssential(false)} className="accent-white" />
            <span className="text-xs text-zinc-400">Nice-to-have / Extra</span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(6)}
          className="bg-white text-black px-4 py-1.5 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
