import { z } from 'zod';

// Filter types
export type DateRangeFilter = {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  type: 'custom' | 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';
};

export type ProjectFilter = {
  selectedProjectIds: string[];
  includeInactive: boolean;
};

export type UserFilter = {
  selectedUserIds: string[];
  includeInactive: boolean;
};

export type IssueTypeFilter = {
  selectedIssueTypeIds: string[];
};

export type StatusFilter = {
  selectedStatusIds: string[];
  includeResolved: boolean;
};

export type TextFilter = {
  searchText: string;
  searchInDescription: boolean;
  searchInIssueSummary: boolean;
  searchInIssueKey: boolean;
  caseSensitive: boolean;
};

export interface FilterState {
  dateRange: DateRangeFilter;
  projects: ProjectFilter;
  users: UserFilter;
  issueTypes: IssueTypeFilter;
  statuses: StatusFilter;
  textSearch: TextFilter;
  minHours?: number;
  maxHours?: number;
}

// Validation schemas for filters
export const DateRangeFilterSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(['custom', 'today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth']),
});

export const ProjectFilterSchema = z.object({
  selectedProjectIds: z.array(z.string()),
  includeInactive: z.boolean(),
});

export const UserFilterSchema = z.object({
  selectedUserIds: z.array(z.string()),
  includeInactive: z.boolean(),
});

export const IssueTypeFilterSchema = z.object({
  selectedIssueTypeIds: z.array(z.string()),
});

export const StatusFilterSchema = z.object({
  selectedStatusIds: z.array(z.string()),
  includeResolved: z.boolean(),
});

export const TextFilterSchema = z.object({
  searchText: z.string(),
  searchInDescription: z.boolean(),
  searchInIssueSummary: z.boolean(),
  searchInIssueKey: z.boolean(),
  caseSensitive: z.boolean(),
});

export const FilterStateSchema = z.object({
  dateRange: DateRangeFilterSchema,
  projects: ProjectFilterSchema,
  users: UserFilterSchema,
  issueTypes: IssueTypeFilterSchema,
  statuses: StatusFilterSchema,
  textSearch: TextFilterSchema,
  minHours: z.number().positive().optional(),
  maxHours: z.number().positive().optional(),
});

// Type guard
export const isFilterState = (obj: unknown): obj is FilterState => {
  return FilterStateSchema.safeParse(obj).success;
};

// Default filter state
export const createDefaultFilterState = (): FilterState => ({
  dateRange: {
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    type: 'today',
  },
  projects: {
    selectedProjectIds: [],
    includeInactive: false,
  },
  users: {
    selectedUserIds: [],
    includeInactive: false,
  },
  issueTypes: {
    selectedIssueTypeIds: [],
  },
  statuses: {
    selectedStatusIds: [],
    includeResolved: true,
  },
  textSearch: {
    searchText: '',
    searchInDescription: true,
    searchInIssueSummary: true,
    searchInIssueKey: true,
    caseSensitive: false,
  },
});