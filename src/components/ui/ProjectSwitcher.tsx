"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectSwitcher() {
  const { 
    projects, 
    activeProjectId, 
    switchProject, 
    createProject, 
    renameProject, 
    duplicateProject, 
    deleteProject 
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const projectList = Object.values(projects || {}).sort((a, b) => b.updatedAt - a.updatedAt);
  const activeRecord = projects[activeProjectId] || projectList[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setEditingId(null);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleStartRename = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveRename = (id: string, e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      renameProject(id, editName.trim());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("האם למחוק פרויקט זה לצמיתות?")) {
      deleteProject(id);
    }
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateProject(id);
  };

  const handleCreateNew = () => {
    createProject();
    setIsOpen(false);
  };

  return (
    <div className="relative font-sans text-right" ref={dropdownRef} dir="rtl">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors shadow-xs"
        title="החלף פרויקט או צור פרויקט חדש"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />
        <span className="max-w-[130px] truncate">{activeRecord?.name || "הפרויקט שלי"}</span>
        <span className="text-[10px] text-zinc-400 font-mono">▼</span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1.5 w-72 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl p-2 z-50 text-right"
          >
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-zinc-100 dark:border-zinc-900 mb-1">
              <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                פרויקטים שמורים ({projectList.length})
              </span>
              <button
                onClick={handleCreateNew}
                className="text-[11px] font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 px-2 py-0.5 rounded transition-colors"
              >
                + חדש
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 py-1 no-scrollbar">
              {projectList.map((p) => {
                const isActive = p.id === activeProjectId;
                const isEditing = editingId === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (!isEditing) {
                        switchProject(p.id);
                        setIsOpen(false);
                      }
                    }}
                    className={`group flex items-center justify-between p-2 rounded-md transition-colors cursor-pointer text-xs ${
                      isActive 
                        ? "bg-zinc-100 dark:bg-zinc-900 font-medium text-zinc-950 dark:text-zinc-50" 
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-1">
                      {isEditing ? (
                        <form onSubmit={(e) => handleSaveRename(p.id, e)} onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onBlur={(e) => handleSaveRename(p.id, e)}
                            autoFocus
                            className="w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded px-1.5 py-0.5 text-xs text-zinc-900 dark:text-white focus:outline-none"
                          />
                        </form>
                      ) : (
                        <div>
                          <div className="truncate flex items-center gap-1.5">
                            {isActive && <span className="text-[10px] text-zinc-900 dark:text-white font-bold">✓</span>}
                            <span>{p.name}</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">
                            {new Date(p.updatedAt).toLocaleDateString("he-IL", {
                              day: "numeric",
                              month: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleStartRename(p.id, p.name, e)}
                          title="שנה שם"
                          className="p-1 hover:text-zinc-950 dark:hover:text-white text-zinc-400 rounded"
                        >
                          ✎
                        </button>
                        <button
                          onClick={(e) => handleDuplicate(p.id, e)}
                          title="שכפל פרויקט"
                          className="p-1 hover:text-zinc-950 dark:hover:text-white text-zinc-400 rounded"
                        >
                          ⎘
                        </button>
                        {projectList.length > 1 && (
                          <button
                            onClick={(e) => handleDelete(p.id, e)}
                            title="מחק פרויקט"
                            className="p-1 hover:text-red-600 text-zinc-400 rounded"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
