import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ProjectData, Avenue, KnowledgeGap, Task } from '../types/project';

interface AppState {
  // Navigation
  activeStep: number;
  stage: 1 | 2;
  
  // Data
  project: ProjectData;

  // Actions
  setActiveStep: (step: number) => void;
  setStage: (stage: 1 | 2) => void;
  updateProject: (data: Partial<ProjectData>) => void;
  updateAvenue: (id: string, data: Partial<Avenue>) => void;
  updateTask: (avenueId: string, taskId: string, data: Partial<Task>) => void;
  
  // Helpers
  getConsumedBufferDays: () => number;
  getBufferStatus: () => 'green' | 'yellow' | 'red';
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
  totalBufferDays: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeStep: 1,
      stage: 1,
      project: initialProjectState,

      setActiveStep: (step) => set({ activeStep: step }),
      setStage: (stage) => set({ stage }),
      
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

      exportJSON: () => {
        return JSON.stringify(get().project, null, 2);
      },

      importJSON: (json) => {
        try {
          const parsed = JSON.parse(json);
          // Could add Zod validation here
          set({ project: parsed, stage: 2 }); 
        } catch (e) {
          console.error("Failed to import JSON", e);
        }
      },

      resetProject: () => set({ project: initialProjectState, activeStep: 1, stage: 1 }),
    }),
    {
      name: 'project-planner-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
