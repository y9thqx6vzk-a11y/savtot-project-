"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step5Tasks({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateAvenue, setActiveStep, addSubtask, toggleSubtask, removeSubtask } = useAppStore();
  const { transition } = useAppMotion();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeAvenueId, setActiveAvenueId] = useState<string | null>(project.avenues[0]?.id || null);
  const [isEssential, setIsEssential] = useState(true);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskInputs, setNewSubtaskInputs] = useState<Record<string, string>>({});

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
      <div className="space-y-3">
        {project.avenues.find(a => a.id === activeAvenueId)?.tasks.map(task => {
          const subtasks = task.subtasks || [];
          const completedSubtasks = subtasks.filter(st => st.completed).length;

          return (
            <div key={task.id} className="p-3 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${task.isEssential ? 'bg-zinc-950 dark:bg-white' : 'bg-zinc-400'}`} />
                  <span className={`text-sm ${task.isEssential ? 'text-zinc-950 dark:text-white font-medium' : 'text-zinc-500'}`}>
                    {task.title}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded">
                    {task.isEssential ? 'הכרחי ל-MVP' : 'תוספת'}
                  </span>
                  {subtasks.length > 0 && (
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 px-1.5 py-0.5 rounded">
                      {completedSubtasks}/{subtasks.length} תתי משימות
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 font-sans"
                  >
                    {expandedTaskId === task.id ? 'הסתר תתי משימות' : `תתי משימות (${subtasks.length})`}
                  </button>
                  <button onClick={() => removeTask(activeAvenueId!, task.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
                </div>
              </div>

              {/* Subtasks Section */}
              {expandedTaskId === task.id && (
                <div className="mr-4 mt-2 pt-2 border-r-2 border-zinc-200 dark:border-zinc-700 pr-3 space-y-2">
                  {subtasks.length > 0 && (
                    <div className="space-y-1.5">
                      {subtasks.map((st) => (
                        <div key={st.id} className="flex items-center justify-between text-xs py-1 px-2 rounded bg-zinc-50 dark:bg-zinc-850/60 group/st">
                          <label className="flex items-center gap-2 cursor-pointer flex-1">
                            <input 
                              type="checkbox" 
                              checked={st.completed} 
                              onChange={() => toggleSubtask(activeAvenueId!, task.id, st.id)}
                              className="accent-zinc-900 dark:accent-white w-3.5 h-3.5 rounded"
                            />
                            <span className={st.completed ? 'line-through text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}>
                              {st.title}
                            </span>
                          </label>
                          <button 
                            onClick={() => removeSubtask(activeAvenueId!, task.id, st.id)}
                            className="text-zinc-400 hover:text-red-500 opacity-0 group-hover/st:opacity-100 transition-opacity text-[11px]"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Subtask Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input 
                      dir="rtl"
                      className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded px-3.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none placeholder:text-zinc-400"
                      placeholder="הוסף תת-משימה..."
                      value={newSubtaskInputs[task.id] || ""}
                      onChange={(e) => setNewSubtaskInputs({ ...newSubtaskInputs, [task.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (newSubtaskInputs[task.id] || "").trim();
                          if (val) {
                            addSubtask(activeAvenueId!, task.id, val);
                            setNewSubtaskInputs({ ...newSubtaskInputs, [task.id]: "" });
                          }
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const val = (newSubtaskInputs[task.id] || "").trim();
                        if (val) {
                          addSubtask(activeAvenueId!, task.id, val);
                          setNewSubtaskInputs({ ...newSubtaskInputs, [task.id]: "" });
                        }
                      }}
                      className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded font-medium border border-zinc-200 dark:border-zinc-700 transition-colors"
                    >
                      + הוסף
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Task Box */}
      <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded space-y-3 mt-4">
        <input 
          dir="rtl"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-400"
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
