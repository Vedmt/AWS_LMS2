import { z } from 'zod';

// Jira API specific types (raw responses from Jira)
export interface JiraUser {
  accountId: string;
  emailAddress: string;
  displayName: string;
  active: boolean;
  timeZone?: string;
  avatarUrls: {
    '16x16': string;
    '24x24': string;
    '32x32': string;
    '48x48': string;
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  projectTypeKey: string;
  lead?: JiraUser;
  avatarUrls: {
    '16x16': string;
    '24x24': string;
    '32x32': string;
    '48x48': string;
  };
}

export interface JiraIssueType {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  subtask: boolean;
}

export interface JiraStatus {
  id: string;
  name: string;
  description: string;
  statusCategory: {
    id: string;
    key: string;
    colorName: string;
    name: string;
  };
}

export interface JiraPriority {
  id: string;
  name: string;
  iconUrl: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description?: {
      type: string;
      version: number;
      content: any[];
    };
    issuetype: JiraIssueType;
    status: JiraStatus;
    priority?: JiraPriority;
    assignee?: JiraUser;
    reporter?: JiraUser;
    project: JiraProject;
    created: string;
    updated: string;
  };
}

export interface JiraWorklog {
  id: string;
  issueId: string;
  author: JiraUser;
  timeSpent: string; // e.g., "2h 30m"
  timeSpentSeconds: number;
  description?: string;
  started: string; // ISO date string
  created: string;
  updated: string;
}

export interface JiraWorklogSearchResult {
  worklogs: JiraWorklog[];
  total: number;
  maxResults: number;
  startAt: number;
}

export interface JiraProjectSearchResult {
  projects: JiraProject[];
  total: number;
  maxResults: number;
  startAt: number;
}

export interface JiraUserSearchResult {
  users: JiraUser[];
  total: number;
  maxResults: number;
  startAt: number;
}

// Jira API configuration
export interface JiraApiConfig {
  baseUrl: string;
  email: string;
  apiToken: string;
  maxRetries: number;
  retryDelay: number;
  requestTimeout: number;
  maxConcurrentRequests: number;
}

// Jira API error types
export interface JiraApiError {
  errorMessages: string[];
  errors: Record<string, string>;
  status: number;
}

// Validation schemas
export const JiraUserSchema = z.object({
  accountId: z.string(),
  emailAddress: z.string().email(),
  displayName: z.string(),
  active: z.boolean(),
  timeZone: z.string().optional(),
  avatarUrls: z.object({
    '16x16': z.string().url(),
    '24x24': z.string().url(),
    '32x32': z.string().url(),
    '48x48': z.string().url(),
  }),
});

export const JiraProjectSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  projectTypeKey: z.string(),
  lead: JiraUserSchema.optional(),
  avatarUrls: z.object({
    '16x16': z.string().url(),
    '24x24': z.string().url(),
    '32x32': z.string().url(),
    '48x48': z.string().url(),
  }),
});

export const JiraIssueTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  iconUrl: z.string().url(),
  subtask: z.boolean(),
});

export const JiraStatusSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  statusCategory: z.object({
    id: z.string(),
    key: z.string(),
    colorName: z.string(),
    name: z.string(),
  }),
});

export const JiraPrioritySchema = z.object({
  id: z.string(),
  name: z.string(),
  iconUrl: z.string().url(),
});

export const JiraIssueSchema = z.object({
  id: z.string(),
  key: z.string(),
  fields: z.object({
    summary: z.string(),
    description: z.object({
      type: z.string(),
      version: z.number(),
      content: z.array(z.any()),
    }).optional(),
    issuetype: JiraIssueTypeSchema,
    status: JiraStatusSchema,
    priority: JiraPrioritySchema.optional(),
    assignee: JiraUserSchema.optional(),
    reporter: JiraUserSchema.optional(),
    project: JiraProjectSchema,
    created: z.string(),
    updated: z.string(),
  }),
});

export const JiraWorklogSchema = z.object({
  id: z.string(),
  issueId: z.string(),
  author: JiraUserSchema,
  timeSpent: z.string(),
  timeSpentSeconds: z.number().positive(),
  description: z.string().optional(),
  started: z.string(),
  created: z.string(),
  updated: z.string(),
});

// Type guards
export const isJiraUser = (obj: unknown): obj is JiraUser => {
  return JiraUserSchema.safeParse(obj).success;
};

export const isJiraProject = (obj: unknown): obj is JiraProject => {
  return JiraProjectSchema.safeParse(obj).success;
};

export const isJiraWorklog = (obj: unknown): obj is JiraWorklog => {
  return JiraWorklogSchema.safeParse(obj).success;
};

export const isJiraIssue = (obj: unknown): obj is JiraIssue => {
  return JiraIssueSchema.safeParse(obj).success;
};

// Helper functions for Jira data transformation
export const parseJiraTimeSpent = (timeSpent: string): number => {
  // Convert Jira time format (e.g., "2h 30m", "1d 3h") to hours
  const dayMatch = timeSpent.match(/(\d+)d/);
  const hourMatch = timeSpent.match(/(\d+)h/);
  const minuteMatch = timeSpent.match(/(\d+)m/);
  
  const days = dayMatch ? parseInt(dayMatch[1], 10) : 0;
  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  
  return (days * 8) + hours + (minutes / 60); // Assuming 8-hour work days
};

export const formatHoursAsJiraTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  
  if (wholeHours === 0 && minutes === 0) {
    return '0m';
  }
  
  const parts: string[] = [];
  if (wholeHours > 0) {
    parts.push(`${wholeHours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  return parts.join(' ');
};