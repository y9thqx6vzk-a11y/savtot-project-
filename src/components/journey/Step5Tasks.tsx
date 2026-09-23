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
      title: newTaskTitle.trim(),
      isEssential: isEssential,
      isBottleneck: false,
      delayDays: 0,
      okr: { metric: "", target: 0, current: 0, unit: "" },
      completed: false,
    };

    // Purge system-suggested sample tasks (t-*) when user adds their own
    const existingTasks = avenue.tasks.filter(t => !t.id.startsWith("t-"));
    updateAvenue(activeAvenueId, { tasks: [...existingTasks, newTask] });
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
        <span className="font-mono font-medium text-zinc-900 dark:text-white">{totalTasks}</span> משימות (<span className="font-mono font-medium text-zinc-900 dark:text-white">{essentialTasks}</span> הכרחיות לגרסת חצי הזמן)
      </motion.div>
    );
  }

  if (project.avenues.length === 0) {
    return (
      <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-zinc-400">
        אנא הגדר תחילה לפחות אפיק פעולה אחד בשלב 3.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Guidance */}
      <div className="space-y-1 text-xs text-zinc-500 font-light leading-relaxed border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        <p>
          <strong>פירוק כל אפיק למשימות ותעדוף:</strong> נזהה איזו משימה היא הכרחית ואיזו תוספת.
        </p>
        <p className="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
          <strong>מבחן חצי הזמן:</strong> אם היינו חייבים לשחרר גרסה עובדת בחצי מהזמן – על מה היינו מוותרים כדי שזה יקרה?
        </p>
      </div>

      {/* Avenue Pills */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3 overflow-x-auto no-scrollbar">
        {project.avenues.map(ave => (
          <button
            key={ave.id}
            onClick={() => setActiveAvenueId(ave.id)}
            className={`text-xs px-3 py-1 rounded whitespace-nowrap transition-colors font-mono ${
              activeAvenueId === ave.id 
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-medium' 
                : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            {ave.title} <span className="text-[10px] opacity-70">({ave.tasks.length})</span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {project.avenues.find(a => a.id === activeAvenueId)?.tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between group p-3 bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded">
            <div className="flex items-center gap-3">
              <span className={`w-1.5 h-1.5 rounded-full ${task.isEssential ? 'bg-zinc-950 dark:bg-white' : 'bg-zinc-400'}`} />
              <span className={`text-sm ${task.isEssential ? 'text-zinc-950 dark:text-white font-medium' : 'text-zinc-500'}`}>
                {task.title}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                {task.isEssential ? 'הכרחי ל-MVP' : 'תוספת'}
              </span>
            </div>
            <button onClick={() => removeTask(activeAvenueId!, task.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
          </div>
        ))}
      </div>

      {/* Add Task Box */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded space-y-3 mt-4">
        <input 
          dir="rtl"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-400"
          placeholder="שם המשימה הבאה..."
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
            <input type="radio" checked={isEssential} onChange={() => setIsEssential(true)} className="accent-zinc-900 dark:accent-white w-4 h-4" />
            <span className="text-xs text-zinc-900 dark:text-white font-medium">הכרחית לשחרור (גרסת חצי הזמן)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="radio" checked={!isEssential} onChange={() => setIsEssential(false)} className="accent-zinc-900 dark:accent-white w-4 h-4" />
            <span className="text-xs text-zinc-500">תוספת / אפשר לוותר זמנית</span>
          </label>
        </div>

        <div className="flex justify-end pt-1">
          <button 
            onClick={handleAddTask} 
            className="text-xs bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-1.5 rounded font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            + הוסף משימה
          </button>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          הקש <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">Enter</kbd> לשמירה ומעבר
        </div>
        <button 
          onClick={() => setActiveStep(6)}
          className="bg-zinc-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          המשך לשלב 6 ←
        </button>
      </div>
    </motion.div>
  );
}
