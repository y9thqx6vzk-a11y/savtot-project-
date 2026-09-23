export type GapCategory = 'tech' | 'market' | 'execution';

export interface KnowledgeGap {
  id: string;
  description: string;
  category: GapCategory;
  mitigation: string;
}

export interface TaskOKR {
  metric: string;
  target: number;
  current: number;
  unit: string;
}

export interface Task {
  id: string;
  title: string;
  isEssential: boolean;
  isBottleneck: boolean;
  delayDays: number;
  okr: TaskOKR;
  completed: boolean;
}

export interface Avenue {
  id: string;
  title: string;
  isCriticalPath: boolean;
  tasks: Task[];
}

export interface ProjectData {
  // Step 1
  oneLiner: string;
  problem: string;
  targetAudience: string;
  dayInTheLife: string;

  // Step 2
  knowledgeGaps: KnowledgeGap[];

  // Step 3
  avenues: Avenue[];
  preMortem: string;

  // Step 4
  referenceProject: string;
  plannedDurationDays: number;
  actualDurationDays: number;
  optimismGapPercent: number;

  // Step 6
  totalBufferDays: number;
}
