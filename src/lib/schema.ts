import { z } from 'zod';

export const storySchema = z.object({
  oneLiner: z.string().min(5, "Must be at least 5 characters"),
  problem: z.string().min(10, "Must be at least 10 characters"),
  targetAudience: z.string().min(3, "Required"),
  dayInTheLife: z.string().min(10, "Required"),
});

export const knowledgeGapSchema = z.object({
  id: z.string(),
  description: z.string().min(3, "Required"),
  category: z.enum(['tech', 'market', 'execution']),
  mitigation: z.string().min(3, "Required"),
});

export const taskOKRSchema = z.object({
  metric: z.string().min(1, "Metric name is required"),
  target: z.number().min(0, "Must be a number"),
  current: z.number().min(0),
  unit: z.string().min(1, "Unit is required"),
});

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Task title is required"),
  isEssential: z.boolean(),
  isBottleneck: z.boolean(),
  delayDays: z.number().min(0),
  okr: taskOKRSchema,
  completed: z.boolean(),
});

export const avenueSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Avenue title required"),
  isCriticalPath: z.boolean(),
  tasks: z.array(taskSchema),
});

export const preMortemSchema = z.object({
  preMortem: z.string().min(10, "Required"),
});

export const outsideViewSchema = z.object({
  referenceProject: z.string().min(3, "Required"),
  plannedDurationDays: z.number().min(1, "Required"),
  actualDurationDays: z.number().min(1, "Required"),
  optimismGapPercent: z.number(),
});

export const buffersSchema = z.object({
  totalBufferDays: z.number().min(0),
});
