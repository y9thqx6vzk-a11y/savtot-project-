"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Step5Tasks({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateAvenue, setActiveStep } = useAppStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeAvenueId, setActiveAvenueId] = useState<string | null>(project.avenues[0]?.id || null);
  const [isEssential, setIsEssential] = useState(true);

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !activeAvenueId) return;
    
    const avenue = project.avenues.find(a => a.id === activeAvenueId);
    if (!avenue) return;

    const newTask = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      isEssential: isEssential,
      isBottleneck: false, // Default, can be toggled later
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

  if (!isActive && isPast) {
    const totalTasks = project.avenues.reduce((acc, ave) => acc + ave.tasks.length, 0);
    const essentialTasks = project.avenues.reduce((acc, ave) => acc + ave.tasks.filter(t => t.isEssential).length, 0);
    return (
      <motion.div layout className="text-zinc-400 text-sm">
        {totalTasks} total tasks ({essentialTasks} MVP)
      </motion.div>
    );
  }

  if (project.avenues.length === 0) {
    return (
      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-zinc-500">
        Please define at least one Avenue in Step 3 first.
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="flex gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
        {project.avenues.map(ave => (
          <button
            key={ave.id}
            onClick={() => setActiveAvenueId(ave.id)}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${activeAvenueId === ave.id ? 'bg-zinc-200 text-black' : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
          >
            {ave.title} ({ave.tasks.length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {project.avenues.find(a => a.id === activeAvenueId)?.tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between group p-2 hover:bg-zinc-900/50 rounded-md">
            <div className="flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${task.isEssential ? 'bg-zinc-300' : 'bg-zinc-700'}`} />
              <span className={`text-sm ${task.isEssential ? 'text-zinc-200' : 'text-zinc-500'}`}>{task.title}</span>
              <span className="text-[10px] text-zinc-600 uppercase border border-zinc-800 px-1 rounded">{task.isEssential ? 'MVP' : 'Extra'}</span>
            </div>
            <button onClick={() => removeTask(activeAvenueId!, task.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md space-y-3 mt-4">
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
          placeholder="New task name..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
              e.preventDefault();
            }
          }}
        />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={isEssential} onChange={() => setIsEssential(true)} className="accent-zinc-500" />
            <span className="text-xs text-zinc-400">Essential (MVP)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={!isEssential} onChange={() => setIsEssential(false)} className="accent-zinc-500" />
            <span className="text-xs text-zinc-400">Nice-to-have (Extra)</span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-800/50">
         <div className="text-xs text-zinc-600">Add tasks for each avenue</div>
        <button 
          onClick={() => setActiveStep(6)}
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
