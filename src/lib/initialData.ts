import { ProjectData } from '../types/project';

export const sampleProject: ProjectData = {
  oneLiner: "A cognitive-load-reducing project planning tool",
  problem: "Traditional tools like Jira are too noisy and distract from the actual work.",
  targetAudience: "Solo founders, indie hackers, and small agile teams.",
  dayInTheLife: "Users can plan a project in 10 minutes and track it effortlessly without getting lost in nested menus.",
  knowledgeGaps: [
    {
      id: "kg-1",
      description: "How to perfectly animate height auto in Framer Motion",
      category: "tech",
      mitigation: "Build a small CodeSandbox prototype first"
    }
  ],
  avenues: [
    {
      id: "ave-1",
      title: "Core Architecture",
      isCriticalPath: true,
      tasks: [
        {
          id: "t-1",
          title: "Setup Next.js & Tailwind",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: true,
          okr: { metric: "Setup Time", current: 0, target: 1, unit: "days" }
        },
        {
          id: "t-2",
          title: "Implement Zustand Persistence",
          isEssential: true,
          isBottleneck: true,
          delayDays: 1,
          completed: false,
          okr: { metric: "State Bugs", current: 0, target: 0, unit: "bugs" }
        }
      ]
    },
    {
      id: "ave-2",
      title: "Stage 2 Dashboard",
      isCriticalPath: false,
      tasks: [
        {
          id: "t-3",
          title: "Build Traffic Light UI",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "Render Time", current: 50, target: 16, unit: "ms" }
        },
        {
          id: "t-4",
          title: "Export to Markdown feature",
          isEssential: false,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "Lines of Code", current: 0, target: 50, unit: "lines max" }
        }
      ]
    }
  ],
  preMortem: "Project failed because the UI became too complex, defeating the original purpose of cognitive ease.",
  referenceProject: "Minimalist Todo App",
  plannedDurationDays: 14,
  actualDurationDays: 21,
  optimismGapPercent: 50,
  totalBufferDays: 7,
};
