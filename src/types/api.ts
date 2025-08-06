import { z } from 'zod';
import { FilterState, GroupingConfig } from './filtering';
import { TimesheetEntry, Project, User } from './core';

// API Request types
export interface AuthenticationRequest {
  jiraUrl: string;
  email: string;
  apiToken: string;
}

export interface RefreshDataRequest {
  forceFullSync?: boolean;
  projectIds?: string[];
}

export interface TimesheetsRequest {
  filters: FilterState;
  grouping: GroupingConfig;
  page?: number;
  limit?: number;
  includeIssueDetails?: boolean;
}

export interface ProjectConfigRequest {
  selectedProjectIds: string[];
}

export interface ExportRequest {
  filters: FilterState;
  grouping: GroupingConfig;
  format: 'csv' | 'excel' | 'pdf';
  includeDetails: boolean;
  fileName?: string;
}

// API Response types
export interface AuthenticationResponse {
  success: boolean;
  user?: User;
  availableProjects?: Project[];
  error?: string;
}

export interface TimesheetsResponse {
  entries: TimesheetEntry[];
  totalEntries: number;
  totalHours: number;
  groupedData?: any; // Will be properly typed based on grouping structure
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: FilterState;
  grouping: GroupingConfig;
  lastSyncedAt?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  totalProjects: number;
  lastSyncedAt?: string;
}

export interface UsersResponse {
  users: User[];
  totalUsers: number;
}

export interface RefreshDataResponse {
  success: boolean;
  syncedProjects: string[];
  newEntries: number;
  updatedEntries: number;
  totalEntries: number;
  syncStartedAt: string;
  syncCompletedAt: string;
  errors?: string[];
}

export interface ExportResponse {
  downloadUrl: string;
  fileName: string;
  fileSize: number;
  expiresAt: string;
}

export interface SummaryResponse {
  totalHours: number;
  totalEntries: number;
  dateRange: {
    start: string;
    end: string;
  };
  projectBreakdown: Array<{
    projectId: string;
    projectName: string;
    hours: number;
    entries: number;
  }>;
  userBreakdown: Array<{
    userId: string;
    userName: string;
    hours: number;
    entries: number;
  }>;
  dailyBreakdown: Array<{
    date: string;
    hours: number;
    entries: number;
  }>;
}

// Error response type
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  details?: Record<string, any>;
}

// Validation schemas
export const AuthenticationRequestSchema = z.object({
  jiraUrl: z.string().url(),
  email: z.string().email(),
  apiToken: z.string().min(1),
});

export const RefreshDataRequestSchema = z.object({
  forceFullSync: z.boolean().optional(),
  projectIds: z.array(z.string()).optional(),
});

export const TimesheetsRequestSchema = z.object({
  filters: z.any(), // Will use FilterStateSchema from filtering.ts
  grouping: z.any(), // Will use GroupingConfigSchema from grouping.ts
  page: z.number().positive().optional(),
  limit: z.number().positive().max(1000).optional(),
  includeIssueDetails: z.boolean().optional(),
});

export const ProjectConfigRequestSchema = z.object({
  selectedProjectIds: z.array(z.string()),
});

export const ExportRequestSchema = z.object({
  filters: z.any(), // Will use FilterStateSchema from filtering.ts
  grouping: z.any(), // Will use GroupingConfigSchema from grouping.ts
  format: z.enum(['csv', 'excel', 'pdf']),
  includeDetails: z.boolean(),
  fileName: z.string().optional(),
});

// Type guards
export const isAuthenticationRequest = (obj: unknown): obj is AuthenticationRequest => {
  return AuthenticationRequestSchema.safeParse(obj).success;
};

export const isRefreshDataRequest = (obj: unknown): obj is RefreshDataRequest => {
  return RefreshDataRequestSchema.safeParse(obj).success;
};

export const isTimesheetsRequest = (obj: unknown): obj is TimesheetsRequest => {
  return TimesheetsRequestSchema.safeParse(obj).success;
};

export const isProjectConfigRequest = (obj: unknown): obj is ProjectConfigRequest => {
  return ProjectConfigRequestSchema.safeParse(obj).success;
};

export const isExportRequest = (obj: unknown): obj is ExportRequest => {
  return ExportRequestSchema.safeParse(obj).success;
};

// API endpoint constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    STATUS: '/api/auth/status',
  },
  PROJECTS: {
    LIST: '/api/projects',
    CONFIG: '/api/projects/config',
    SYNC: '/api/projects/sync',
  },
  TIMESHEETS: {
    LIST: '/api/timesheets',
    REFRESH: '/api/timesheets/refresh',
    SUMMARY: '/api/timesheets/summary',
  },
  EXPORT: {
    CSV: '/api/export/csv',
    EXCEL: '/api/export/excel',
    PDF: '/api/export/pdf',
  },
  USERS: {
    LIST: '/api/users',
  },
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;