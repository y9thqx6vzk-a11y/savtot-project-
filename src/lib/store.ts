import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { ProjectData, Avenue, KnowledgeGap, Task, HistoricalBenchmark, ProjectRecord } from "../types/project";

// Debounced localStorage to prevent disk thrashing and stutter on rapid typing
function createDebouncedStorage(delayMs = 300): StateStorage {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const pendingWrites = new Map<string, string>();

  return {
    getItem: (name: string): string | null => {
      if (typeof window === "undefined") return null;
      if (pendingWrites.has(name)) {
        return pendingWrites.get(name)!;
      }
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (typeof window === "undefined") return;
      pendingWrites.set(name, value);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(name, value);
          pendingWrites.delete(name);
        } catch (e) {
          console.error("Storage write error", e);
        }
      }, delayMs);
    },
    removeItem: (name: string): void => {
      if (typeof window === "undefined") return;
      if (timeoutId) clearTimeout(timeoutId);
      pendingWrites.delete(name);
      localStorage.removeItem(name);
    },
  };
}

export const initialProjectState: ProjectData = {
  oneLiner: "",
  problem: "",
  targetAudience: "",
  dayInTheLife: "",
  knowledgeGaps: [],
  avenues: [],
  preMortem: "",
  referenceProject: "",
  plannedDurationDays: 0,
  actualDurationDays: 0,
  optimismGapPercent: 0,
  addedValueText: "",
  lessonsLearnedText: "",
  outsideViewNotes: "",
  referenceScale: "",
  historicalBenchmarks: [],
  totalBufferDays: 0,
};

const defaultInitialId = "default-project";
const defaultInitialRecord: ProjectRecord = {
  id: defaultInitialId,
  name: "הפרויקט שלי",
  updatedAt: Date.now(),
  data: initialProjectState,
};

interface AppState {
  // Navigation & View Mode
  activeStep: number;
  stage: 1 | 2;
  theme: "light" | "dark";
  focusedAvenueId: string | null;
  collapsedAvenueIds: string[];
  
  // Multi-Project Data
  projects: Record<string, ProjectRecord>;
  activeProjectId: string;
  project: ProjectData;

  // Actions
  setActiveStep: (step: number) => void;
  setStage: (stage: 1 | 2) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
  setFocusedAvenueId: (id: string | null) => void;
  toggleAvenueCollapse: (id: string) => void;
  updateProject: (data: Partial<ProjectData>) => void;
  updateAvenue: (id: string, data: Partial<Avenue>) => void;
  updateTask: (avenueId: string, taskId: string, data: Partial<Task>) => void;
  addHistoricalBenchmark: (benchmark: Omit<HistoricalBenchmark, "id">) => void;
  removeHistoricalBenchmark: (id: string) => void;
  
  // Multi-Project Actions
  createProject: (name?: string, initialData?: ProjectData) => string;
  switchProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  importProjectRecord: (record: ProjectRecord) => void;

  // Helpers
  getConsumedBufferDays: () => number;
  getBufferStatus: () => "green" | "yellow" | "red";
  getAverageOptimismBias: () => number;
  getSuggestedBufferDays: () => number;
  exportJSON: () => string;
  importJSON: (json: string, customName?: string) => void;
  resetProject: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeStep: 1,
      stage: 1,
      theme: "light",
      focusedAvenueId: null,
      collapsedAvenueIds: [],
      
      projects: {
        [defaultInitialId]: defaultInitialRecord,
      },
      activeProjectId: defaultInitialId,
      project: initialProjectState,

      setActiveStep: (step) => set({ activeStep: step }),
      setStage: (stage) => set({ stage }),
      toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
      setFocusedAvenueId: (id) => set({ focusedAvenueId: id }),
      
      toggleAvenueCollapse: (id) => set((state) => {
        const isCollapsed = state.collapsedAvenueIds.includes(id);
        return {
          collapsedAvenueIds: isCollapsed
            ? state.collapsedAvenueIds.filter(aveId => aveId !== id)
            : [...state.collapsedAvenueIds, id]
        };
      }),

      updateProject: (data) => set((state) => {
        const updatedProject = { ...state.project, ...data };
        const activeId = state.activeProjectId || defaultInitialId;
        const currentRec = state.projects[activeId] || {
          id: activeId,
          name: "הפרויקט שלי",
          updatedAt: Date.now(),
          data: updatedProject,
        };

        const newName = (currentRec.name === "הפרויקט שלי" || currentRec.name === "פרויקט חדש" || !currentRec.name) && updatedProject.oneLiner
          ? updatedProject.oneLiner.slice(0, 30)
          : currentRec.name;

        return {
          project: updatedProject,
          projects: {
            ...state.projects,
            [activeId]: {
              ...currentRec,
              name: newName,
              updatedAt: Date.now(),
              data: updatedProject,
            },
          },
        };
      }),

      updateAvenue: (id, data) => set((state) => {
        const updatedAvenues = state.project.avenues.map((a) => a.id === id ? { ...a, ...data } : a);
        const updatedProject = { ...state.project, avenues: updatedAvenues };
        const activeId = state.activeProjectId || defaultInitialId;
        const currentRec = state.projects[activeId];

        return {
          project: updatedProject,
          projects: currentRec ? {
            ...state.projects,
            [activeId]: { ...currentRec, updatedAt: Date.now(), data: updatedProject },
          } : state.projects,
        };
      }),

      updateTask: (avenueId, taskId, data) => set((state) => {
        const updatedAvenues = state.project.avenues.map((a) => {
          if (a.id === avenueId) {
            return {
              ...a,
              tasks: a.tasks.map((t) => t.id === taskId ? { ...t, ...data } : t)
            };
          }
          return a;
        });
        const updatedProject = { ...state.project, avenues: updatedAvenues };
        const activeId = state.activeProjectId || defaultInitialId;
        const currentRec = state.projects[activeId];

        return {
          project: updatedProject,
          projects: currentRec ? {
            ...state.projects,
            [activeId]: { ...currentRec, updatedAt: Date.now(), data: updatedProject },
          } : state.projects,
        };
      }),

      addHistoricalBenchmark: (benchmark) => set((state) => {
        const newBench: HistoricalBenchmark = {
          ...benchmark,
          id: Math.random().toString(36).substring(2, 9),
        };
        const updatedBenchmarks = [newBench, ...(state.project.historicalBenchmarks || [])];
        const updatedProject = { ...state.project, historicalBenchmarks: updatedBenchmarks };
        const activeId = state.activeProjectId || defaultInitialId;
        const currentRec = state.projects[activeId];

        return {
          project: updatedProject,
          projects: currentRec ? {
            ...state.projects,
            [activeId]: { ...currentRec, updatedAt: Date.now(), data: updatedProject },
          } : state.projects,
        };
      }),

      removeHistoricalBenchmark: (id) => set((state) => {
        const updatedBenchmarks = (state.project.historicalBenchmarks || []).filter(b => b.id !== id);
        const updatedProject = { ...state.project, historicalBenchmarks: updatedBenchmarks };
        const activeId = state.activeProjectId || defaultInitialId;
        const currentRec = state.projects[activeId];

        return {
          project: updatedProject,
          projects: currentRec ? {
            ...state.projects,
            [activeId]: { ...currentRec, updatedAt: Date.now(), data: updatedProject },
          } : state.projects,
        };
      }),

      // Multi-Project Management
      createProject: (name?: string, initialData?: ProjectData) => {
        const newId = "proj-" + Math.random().toString(36).substring(2, 9);
        const data = initialData || { ...initialProjectState };
        const count = Object.keys(get().projects || {}).length + 1;
        const projectName = name || (data.oneLiner ? data.oneLiner.slice(0, 30) : `פרויקט חדש ${count}`);
        
        const newRecord: ProjectRecord = {
          id: newId,
          name: projectName,
          updatedAt: Date.now(),
          data,
        };

        set((state) => ({
          projects: { ...state.projects, [newId]: newRecord },
          activeProjectId: newId,
          project: data,
          activeStep: 1,
          stage: 1,
        }));

        return newId;
      },

      switchProject: (id: string) => {
        const target = get().projects[id];
        if (target) {
          set({
            activeProjectId: id,
            project: target.data,
            activeStep: 1,
          });
        }
      },

      renameProject: (id: string, name: string) => {
        set((state) => {
          const rec = state.projects[id];
          if (!rec) return {};
          return {
            projects: {
              ...state.projects,
              [id]: { ...rec, name, updatedAt: Date.now() },
            },
          };
        });
      },

      duplicateProject: (id: string) => {
        const target = get().projects[id];
        if (!target) return;
        const newId = "proj-" + Math.random().toString(36).substring(2, 9);
        const duplicatedRecord: ProjectRecord = {
          id: newId,
          name: `${target.name} (עותק)`,
          updatedAt: Date.now(),
          data: JSON.parse(JSON.stringify(target.data)),
        };

        set((state) => ({
          projects: { ...state.projects, [newId]: duplicatedRecord },
          activeProjectId: newId,
          project: duplicatedRecord.data,
        }));
      },

      deleteProject: (id: string) => {
        const state = get();
        const keys = Object.keys(state.projects || {});
        if (keys.length <= 1) {
          state.resetProject();
          return;
        }

        const nextProjects = { ...state.projects };
        delete nextProjects[id];
        const nextActiveId = state.activeProjectId === id 
          ? Object.keys(nextProjects)[0] 
          : state.activeProjectId;

        set({
          projects: nextProjects,
          activeProjectId: nextActiveId,
          project: nextProjects[nextActiveId].data,
        });
      },

      importProjectRecord: (record: ProjectRecord) => {
        set((state) => ({
          projects: { ...state.projects, [record.id]: record },
          activeProjectId: record.id,
          project: record.data,
          stage: 2,
        }));
      },

      getConsumedBufferDays: () => {
        const state = get();
        return (state.project?.avenues || []).reduce((acc, ave) => {
          return acc + (ave.tasks || []).reduce((tAcc, task) => tAcc + (task.delayDays || 0), 0);
        }, 0);
      },

      getBufferStatus: () => {
        const consumed = get().getConsumedBufferDays();
        const total = get().project?.totalBufferDays || 0;
        if (total === 0) return consumed > 0 ? "red" : "green";
        
        const ratio = consumed / total;
        if (ratio < 0.33) return "green";
        if (ratio <= 0.66) return "yellow";
        return "red";
      },

      getAverageOptimismBias: () => {
        const benchmarks = get().project?.historicalBenchmarks || [];
        const timedBenchmarks = benchmarks.filter(
          b => typeof b.gapPercent === 'number' && !isNaN(b.gapPercent) && b.gapPercent !== 0
        );
        if (timedBenchmarks.length === 0) {
          return get().project?.optimismGapPercent || 0;
        }
        const total = timedBenchmarks.reduce((acc, b) => acc + (b.gapPercent || 0), 0);
        return Math.round(total / timedBenchmarks.length);
      },

      getSuggestedBufferDays: () => {
        const avgBias = get().getAverageOptimismBias();
        const planned = get().project?.plannedDurationDays || 14;
        if (avgBias <= 0) return Math.ceil(planned * 0.2);
        return Math.ceil(planned * (avgBias / 100));
      },

      exportJSON: () => {
        return JSON.stringify(get().project, null, 2);
      },

      importJSON: (json: string, customName?: string) => {
        try {
          const parsed = JSON.parse(json);
          const count = Object.keys(get().projects || {}).length + 1;
          const projectName = customName || parsed.oneLiner || `פרויקט מיובא ${count}`;
          get().createProject(projectName, parsed);
          set({ stage: 2 });
        } catch (e) {
          console.error("Failed to import JSON", e);
        }
      },

      resetProject: () => {
        const activeId = get().activeProjectId || defaultInitialId;
        const newProjectData = { ...initialProjectState };
        set((state) => ({
          project: newProjectData,
          activeStep: 1,
          stage: 1,
          projects: {
            ...state.projects,
            [activeId]: {
              id: activeId,
              name: "פרויקט חדש",
              updatedAt: Date.now(),
              data: newProjectData,
            }
          }
        }));
      },
    }),
    {
      name: "project-planner-storage",
      storage: createJSONStorage(() => createDebouncedStorage(300)),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Automatic backward-compatibility migration
        if (!state.projects || Object.keys(state.projects).length === 0) {
          const p = state.project || initialProjectState;
          const id = defaultInitialId;
          const name = p.oneLiner ? p.oneLiner.slice(0, 30) : "הפרויקט שלי";
          state.projects = {
            [id]: {
              id,
              name,
              updatedAt: Date.now(),
              data: p,
            }
          };
          state.activeProjectId = id;
        } else if (!state.project && state.activeProjectId && state.projects[state.activeProjectId]) {
          state.project = state.projects[state.activeProjectId].data;
        }
      },
    }
  )
);
