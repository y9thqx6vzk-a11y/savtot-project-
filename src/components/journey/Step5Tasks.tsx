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
      <motion.div layout transition={transition} className="text-sm">
        <span className="font-mono font-medium text-[#1d1d1f] dark:text-white">{totalTasks}</span> משימות בסך הכל (<span className="font-mono font-medium text-[#1d1d1f] dark:text-white">{essentialTasks}</span> הכרחיות לגרסת חצי הזמן)
      </motion.div>
    );
  }

  if (project.avenues.length === 0) {
    return (
      <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#86868b]">
        אנא הגדר תחילה לפחות אפיק פעולה אחד בשלב 3.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Guidance text from user prompt */}
      <div className="space-y-2 text-xs text-[#666] dark:text-zinc-400 font-light leading-relaxed border-r-2 border-[#1d1d1f] dark:border-white pr-3">
        <p>
          <strong>פירוק כל אפיק למשימות ותעדוף:</strong> נזהה איזו משימה היא הכרחית ואיזו תוספת.
        </p>
        <p className="bg-[#f7f5ef] dark:bg-zinc-900 p-2.5 rounded-xl border border-[#e5e1d6] dark:border-zinc-800 text-[#1d1d1f] dark:text-zinc-200">
          <strong>מבחן חצי הזמן:</strong> אם היינו חייבים לשחרר גרסה עובדת בחצי מהזמן – על מה היינו מוותרים כדי שזה יקרה? המשימות שנשארות הן משימות הליבה ההכרחיות (MVP).
        </p>
      </div>

      {/* Avenue Pills */}
      <div className="flex gap-2 border-b border-[#e8e5dc] dark:border-zinc-900 pb-3 overflow-x-auto no-scrollbar">
        {project.avenues.map(ave => (
          <button
            key={ave.id}
            onClick={() => setActiveAvenueId(ave.id)}
            className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-medium ${
              activeAvenueId === ave.id 
                ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black shadow-sm' 
                : 'bg-white/80 dark:bg-zinc-950 border border-[#e2ded5] dark:border-zinc-800 text-[#666] hover:text-[#1d1d1f]'
            }`}
          >
            {ave.title} <span className="font-mono text-[10px] opacity-75">({ave.tasks.length})</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {project.avenues.find(a => a.id === activeAvenueId)?.tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between group p-3 bg-white/70 dark:bg-zinc-950/70 border border-[#e2ded5] dark:border-zinc-800 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${task.isEssential ? 'bg-[#1d1d1f] dark:bg-white' : 'bg-[#c5c0b5]'}`} />
              <span className={`text-sm ${task.isEssential ? 'text-[#1d1d1f] dark:text-white font-medium' : 'text-[#666]'}`}>
                {task.title}
              </span>
              <span className="text-[10px] font-mono text-[#86868b] border border-[#d8d4ca] dark:border-zinc-800 px-2 py-0.5 rounded-full">
                {task.isEssential ? 'הכרחי (גרסת חצי הזמן)' : 'תוספת / רשות'}
              </span>
            </div>
            <button onClick={() => removeTask(activeAvenueId!, task.id)} className="text-[#86868b] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
          </div>
        ))}
      </div>

      {/* Add Task Box */}
      <div className="bg-[#f7f5ef] dark:bg-zinc-950 p-4 border border-[#e5e1d6] dark:border-zinc-900 rounded-2xl space-y-3 mt-4">
        <input 
          className="w-full bg-transparent border-b border-[#dcd8ce] dark:border-zinc-800 pb-2 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
          placeholder="הגדר משימה חדשה..."
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
        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="radio" checked={isEssential} onChange={() => setIsEssential(true)} className="accent-[#1d1d1f] w-4 h-4" />
            <span className="text-xs text-[#1d1d1f] dark:text-white font-medium">הכרחית לשחרור (גרסת חצי הזמן)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="radio" checked={!isEssential} onChange={() => setIsEssential(false)} className="accent-[#1d1d1f] w-4 h-4" />
            <span className="text-xs text-[#666] dark:text-zinc-400">תוספת / אפשר לוותר זמנית</span>
          </label>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">
          הקש <kbd className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 rounded font-mono text-[11px] shadow-sm">Cmd + Enter</kbd> למעבר
        </div>
        <button 
          onClick={() => setActiveStep(6)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          המשך לשלב 6 ←
        </button>
      </div>
    </motion.div>
  );
}
