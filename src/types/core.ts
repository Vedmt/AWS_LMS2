import { z } from 'zod';

// Core entity interfaces
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  accountId: string; // Jira account ID
  timeZone?: string;
  active: boolean;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead?: User;
  projectTypeKey: string;
  avatarUrls?: {
    '16x16'?: string;
    '24x24'?: string;
    '32x32'?: string;
    '48x48'?: string;
  };
  isSelected: boolean;
  lastSyncedAt?: string;
}

export interface Issue {
  id: string;
  key: string;
  summary: string;
  description?: string;
  issueType: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  status: {
    id: string;
    name: string;
    statusCategory: {
      id: string;
      name: string;
      colorName: string;
    };
  };
  priority?: {
    id: string;
    name: string;
    iconUrl?: string;
  };
  assignee?: User;
  reporter?: User;
  project: Pick<Project, 'id' | 'key' | 'name'>;
  created: string;
  updated: string;
}

export interface TimesheetEntry {
  id: string;
  issueId: string;
  issue: Issue;
  author: User;
  timeSpentSeconds: number;
  timeSpentHours: number;
  description?: string;
  started: string; // ISO date string
  created: string; // ISO date string
  updated: string; // ISO date string
  project: Pick<Project, 'id' | 'key' | 'name'>;
  worklogId: string; // Jira worklog ID for sync tracking
}

// Validation schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  avatarUrl: z.string().url().optional(),
  accountId: z.string(),
  timeZone: z.string().optional(),
  active: z.boolean(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  lead: UserSchema.optional(),
  projectTypeKey: z.string(),
  avatarUrls: z.object({
    '16x16': z.string().url().optional(),
    '24x24': z.string().url().optional(),
    '32x32': z.string().url().optional(),
    '48x48': z.string().url().optional(),
  }).optional(),
  isSelected: z.boolean(),
  lastSyncedAt: z.string().optional(),
});

export const IssueSchema = z.object({
  id: z.string(),
  key: z.string(),
  summary: z.string(),
  description: z.string().optional(),
  issueType: z.object({
    id: z.string(),
    name: z.string(),
    iconUrl: z.string().url().optional(),
  }),
  status: z.object({
    id: z.string(),
    name: z.string(),
    statusCategory: z.object({
      id: z.string(),
      name: z.string(),
      colorName: z.string(),
    }),
  }),
  priority: z.object({
    id: z.string(),
    name: z.string(),
    iconUrl: z.string().url().optional(),
  }).optional(),
  assignee: UserSchema.optional(),
  reporter: UserSchema.optional(),
  project: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  created: z.string(),
  updated: z.string(),
});

export const TimesheetEntrySchema = z.object({
  id: z.string(),
  issueId: z.string(),
  issue: IssueSchema,
  author: UserSchema,
  timeSpentSeconds: z.number().positive(),
  timeSpentHours: z.number().positive(),
  description: z.string().optional(),
  started: z.string(),
  created: z.string(),
  updated: z.string(),
  project: z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
  }),
  worklogId: z.string(),
});

// Type guards
export const isUser = (obj: unknown): obj is User => {
  return UserSchema.safeParse(obj).success;
};

export const isProject = (obj: unknown): obj is Project => {
  return ProjectSchema.safeParse(obj).success;
};

export const isIssue = (obj: unknown): obj is Issue => {
  return IssueSchema.safeParse(obj).success;
};

export const isTimesheetEntry = (obj: unknown): obj is TimesheetEntry => {
  return TimesheetEntrySchema.safeParse(obj).success;
};