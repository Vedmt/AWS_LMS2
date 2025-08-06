import { z } from 'zod';

// Grouping configuration types
export type GroupingDimension = 'project' | 'user' | 'issueType' | 'status' | 'date' | 'issue';

export type DateGroupingType = 'day' | 'week' | 'month' | 'quarter' | 'year';

export type SortOrder = 'asc' | 'desc';

export type SortBy = 'name' | 'hours' | 'count' | 'date';

export interface GroupingLevel {
  dimension: GroupingDimension;
  sortBy: SortBy;
  sortOrder: SortOrder;
  dateGroupingType?: DateGroupingType; // Only used when dimension is 'date'
  expanded: boolean;
}

export interface GroupingConfig {
  levels: GroupingLevel[];
  showSubtotals: boolean;
  showGrandTotal: boolean;
  collapseEmptyGroups: boolean;
}

// Grouped data structure
export interface GroupNode {
  id: string;
  dimension: GroupingDimension;
  value: string; // The actual grouping value (project name, user name, etc.)
  displayName: string;
  level: number;
  totalHours: number;
  entryCount: number;
  children: GroupNode[];
  entries: string[]; // IDs of timesheet entries in this group
  isExpanded: boolean;
  metadata?: {
    projectKey?: string;
    userId?: string;
    issueTypeId?: string;
    statusId?: string;
    dateRange?: {
      start: string;
      end: string;
    };
    issueId?: string;
  };
}

// Validation schemas
export const GroupingDimensionSchema = z.enum(['project', 'user', 'issueType', 'status', 'date', 'issue']);

export const DateGroupingTypeSchema = z.enum(['day', 'week', 'month', 'quarter', 'year']);

export const SortOrderSchema = z.enum(['asc', 'desc']);

export const SortBySchema = z.enum(['name', 'hours', 'count', 'date']);

export const GroupingLevelSchema = z.object({
  dimension: GroupingDimensionSchema,
  sortBy: SortBySchema,
  sortOrder: SortOrderSchema,
  dateGroupingType: DateGroupingTypeSchema.optional(),
  expanded: z.boolean(),
});

export const GroupingConfigSchema = z.object({
  levels: z.array(GroupingLevelSchema),
  showSubtotals: z.boolean(),
  showGrandTotal: z.boolean(),
  collapseEmptyGroups: z.boolean(),
});

export const GroupNodeSchema: z.ZodType<GroupNode> = z.lazy(() => z.object({
  id: z.string(),
  dimension: GroupingDimensionSchema,
  value: z.string(),
  displayName: z.string(),
  level: z.number(),
  totalHours: z.number(),
  entryCount: z.number(),
  children: z.array(GroupNodeSchema),
  entries: z.array(z.string()),
  isExpanded: z.boolean(),
  metadata: z.object({
    projectKey: z.string().optional(),
    userId: z.string().optional(),
    issueTypeId: z.string().optional(),
    statusId: z.string().optional(),
    dateRange: z.object({
      start: z.string(),
      end: z.string(),
    }).optional(),
    issueId: z.string().optional(),
  }).optional(),
}));

// Type guards
export const isGroupingConfig = (obj: unknown): obj is GroupingConfig => {
  return GroupingConfigSchema.safeParse(obj).success;
};

export const isGroupNode = (obj: unknown): obj is GroupNode => {
  return GroupNodeSchema.safeParse(obj).success;
};

// Default grouping configuration
export const createDefaultGroupingConfig = (): GroupingConfig => ({
  levels: [
    {
      dimension: 'project',
      sortBy: 'name',
      sortOrder: 'asc',
      expanded: true,
    },
  ],
  showSubtotals: true,
  showGrandTotal: true,
  collapseEmptyGroups: true,
});

// Helper functions for grouping dimension labels
export const getGroupingDimensionLabel = (dimension: GroupingDimension): string => {
  const labels: Record<GroupingDimension, string> = {
    project: 'Project',
    user: 'User',
    issueType: 'Issue Type',
    status: 'Status',
    date: 'Date',
    issue: 'Issue',
  };
  return labels[dimension];
};

export const getDateGroupingTypeLabel = (type: DateGroupingType): string => {
  const labels: Record<DateGroupingType, string> = {
    day: 'Daily',
    week: 'Weekly',
    month: 'Monthly',
    quarter: 'Quarterly',
    year: 'Yearly',
  };
  return labels[type];
};