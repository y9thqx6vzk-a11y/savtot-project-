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

export interface HistoricalBenchmark {
  id: string;
  title: string;
  plannedDays: number;
  actualDays: number;
  gapPercent: number;
}

export interface ProjectData {
  // Step 1: הסיפור
  oneLiner: string;
  problem: string;
  targetAudience: string;
  dayInTheLife: string;

  // Step 2: פערי ידע
  knowledgeGaps: KnowledgeGap[];

  // Step 3: אפיקים ופרה-מורטם
  avenues: Avenue[];
  preMortem: string;

  // Step 4: מבט מבחוץ
  referenceProject: string;
  plannedDurationDays: number;
  actualDurationDays: number;
  optimismGapPercent: number;
  historicalBenchmarks: HistoricalBenchmark[];

  // Step 6: חוצצים
  totalBufferDays: number;
}
