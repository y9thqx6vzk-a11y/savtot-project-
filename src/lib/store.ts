import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { ProjectData, Avenue, KnowledgeGap, Task, HistoricalBenchmark } from '../types/project';

// Debounced localStorage to prevent disk thrashing and stutter on rapid typing
function createDebouncedStorage(delayMs = 300): StateStorage {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const pendingWrites = new Map<string, string>();

  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null;
      if (pendingWrites.has(name)) {
        return pendingWrites.get(name)!;
      }
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (typeof window === 'undefined') return;
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
      if (typeof window === 'undefined') return;
      if (timeoutId) clearTimeout(timeoutId);
      pendingWrites.delete(name);
      localStorage.removeItem(name);
    },
  };
}

interface AppState {
  // Navigation & View Mode
  activeStep: number;
  stage: 1 | 2;
  focusedAvenueId: string | null; // For Focus Mode in Stage 2
  collapsedAvenueIds: string[]; // For Smart Auto-Collapse in Stage 2
  
  // Data
  project: ProjectData;

  // Actions
  setActiveStep: (step: number) => void;
  setStage: (stage: 1 | 2) => void;
  setFocusedAvenueId: (id: string | null) => void;
  toggleAvenueCollapse: (id: string) => void;
  updateProject: (data: Partial<ProjectData>) => void;
  updateAvenue: (id: string, data: Partial<Avenue>) => void;
  updateTask: (avenueId: string, taskId: string, data: Partial<Task>) => void;
  addHistoricalBenchmark: (benchmark: Omit<HistoricalBenchmark, 'id'>) => void;
  
  // Helpers
  getConsumedBufferDays: () => number;
  getBufferStatus: () => 'green' | 'yellow' | 'red';
  getAverageOptimismBias: () => number;
  getSuggestedBufferDays: () => number;
  exportJSON: () => string;
  importJSON: (json: string) => void;
  resetProject: () => void;
}

const initialProjectState: ProjectData = {
  oneLiner: '',
  problem: '',
  targetAudience: '',
  dayInTheLife: '',
  knowledgeGaps: [],
  avenues: [],
  preMortem: '',
  referenceProject: '',
  plannedDurationDays: 0,
  actualDurationDays: 0,
  optimismGapPercent: 0,
  historicalBenchmarks: [
    {
      id: 'bench-1',
      title: 'Auth & Billing Redesign',
      plannedDays: 14,
      actualDays: 20,
      gapPercent: 43,
    },
    {
      id: 'bench-2',
      title: 'Realtime Sync Engine',
      plannedDays: 30,
      actualDays: 40,
      gapPercent: 33,
    }
  ],
  totalBufferDays: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeStep: 1,
      stage: 1,
      focusedAvenueId: null,
      collapsedAvenueIds: [],
      project: initialProjectState,

      setActiveStep: (step) => set({ activeStep: step }),
      setStage: (stage) => set({ stage }),
      setFocusedAvenueId: (id) => set({ focusedAvenueId: id }),
      
      toggleAvenueCollapse: (id) => set((state) => {
        const isCollapsed = state.collapsedAvenueIds.includes(id);
        return {
          collapsedAvenueIds: isCollapsed
            ? state.collapsedAvenueIds.filter(aveId => aveId !== id)
            : [...state.collapsedAvenueIds, id]
        };
      }),

      updateProject: (data) => set((state) => ({
        project: { ...state.project, ...data }
      })),

      updateAvenue: (id, data) => set((state) => ({
        project: {
          ...state.project,
          avenues: state.project.avenues.map((a) => a.id === id ? { ...a, ...data } : a)
        }
      })),

      updateTask: (avenueId, taskId, data) => set((state) => ({
        project: {
          ...state.project,
          avenues: state.project.avenues.map((a) => {
            if (a.id === avenueId) {
              return {
                ...a,
                tasks: a.tasks.map((t) => t.id === taskId ? { ...t, ...data } : t)
              };
            }
            return a;
          })
        }
      })),

      addHistoricalBenchmark: (benchmark) => set((state) => {
        const newBench: HistoricalBenchmark = {
          ...benchmark,
          id: Math.random().toString(36).substring(2, 9),
        };
        return {
          project: {
            ...state.project,
            historicalBenchmarks: [newBench, ...(state.project.historicalBenchmarks || [])]
          }
        };
      }),

      getConsumedBufferDays: () => {
        const state = get();
        return state.project.avenues.reduce((acc, ave) => {
          return acc + ave.tasks.reduce((tAcc, task) => tAcc + (task.delayDays || 0), 0);
        }, 0);
      },

      getBufferStatus: () => {
        const consumed = get().getConsumedBufferDays();
        const total = get().project.totalBufferDays;
        if (total === 0) return consumed > 0 ? 'red' : 'green';
        
        const ratio = consumed / total;
        if (ratio < 0.33) return 'green';
        if (ratio <= 0.66) return 'yellow';
        return 'red';
      },

      getAverageOptimismBias: () => {
        const benchmarks = get().project.historicalBenchmarks || [];
        if (benchmarks.length === 0) {
          return get().project.optimismGapPercent || 0;
        }
        const total = benchmarks.reduce((acc, b) => acc + (b.gapPercent || 0), 0);
        return Math.round(total / benchmarks.length);
      },

      getSuggestedBufferDays: () => {
        const avgBias = get().getAverageOptimismBias();
        const planned = get().project.plannedDurationDays || 14;
        if (avgBias <= 0) return Math.ceil(planned * 0.2); // Default 20% safety margin
        return Math.ceil(planned * (avgBias / 100));
      },

      exportJSON: () => {
        return JSON.stringify(get().project, null, 2);
      },

      importJSON: (json) => {
        try {
          const parsed = JSON.parse(json);
          set({ project: parsed, stage: 2 }); 
        } catch (e) {
          console.error("Failed to import JSON", e);
        }
      },

      resetProject: () => set({ project: initialProjectState, activeStep: 1, stage: 1 }),
    }),
    {
      name: 'project-planner-storage',
      storage: createJSONStorage(() => createDebouncedStorage(300)),
    }
  )
);
