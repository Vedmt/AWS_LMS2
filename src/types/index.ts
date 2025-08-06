// Central exports for all types
export * from './core';
export * from './filtering';
export * from './grouping';
export * from './api';
export * from './jira';

// Re-export commonly used types for convenience
export type {
  User,
  Project,
  Issue,
  TimesheetEntry,
  FilterState,
  GroupingConfig,
  GroupNode,
  TimesheetsRequest,
  TimesheetsResponse,
  AuthenticationRequest,
  AuthenticationResponse,
} from './core';

export type {
  DateRangeFilter,
  ProjectFilter,
  UserFilter,
  IssueTypeFilter,
  StatusFilter,
  TextFilter,
} from './filtering';

export type {
  GroupingDimension,
  GroupingLevel,
  DateGroupingType,
  SortOrder,
  SortBy,
} from './grouping';

export type {
  JiraUser,
  JiraProject,
  JiraIssue,
  JiraWorklog,
  JiraApiConfig,
} from './jira';

// Utility type for API responses
export type ApiResponse<T> = {
  data: T;
  success: true;
} | {
  error: string;
  message: string;
  success: false;
  statusCode?: number;
};

// Common pagination type
export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginationResponse = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// Loading state type for UI components
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic form field error type
export type FieldError = {
  field: string;
  message: string;
};

// Configuration types for the application
export interface AppConfig {
  apiBaseUrl: string;
  jiraBaseUrl?: string;
  enableMockData: boolean;
  defaultPageSize: number;
  maxExportRows: number;
  syncIntervalMinutes: number;
  sessionTimeoutMinutes: number;
  features: {
    enableExport: boolean;
    enableGrouping: boolean;
    enableFiltering: boolean;
    enableRealTimeSync: boolean;
  };
}