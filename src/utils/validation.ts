import { z } from 'zod';
import {
  FilterStateSchema,
  GroupingConfigSchema,
  TimesheetEntrySchema,
  UserSchema,
  ProjectSchema,
  IssueSchema,
} from '../types';

// Generic validation function
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage?: string
): T => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errorDetails = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    
    throw new Error(
      errorMessage 
        ? `${errorMessage}: ${errorDetails}`
        : `Validation failed: ${errorDetails}`
    );
  }
  
  return result.data;
};

// Specific validation functions for common use cases
export const validateFilterState = (data: unknown) => {
  return validateData(FilterStateSchema, data, 'Invalid filter state');
};

export const validateGroupingConfig = (data: unknown) => {
  return validateData(GroupingConfigSchema, data, 'Invalid grouping configuration');
};

export const validateTimesheetEntry = (data: unknown) => {
  return validateData(TimesheetEntrySchema, data, 'Invalid timesheet entry');
};

export const validateUser = (data: unknown) => {
  return validateData(UserSchema, data, 'Invalid user data');
};

export const validateProject = (data: unknown) => {
  return validateData(ProjectSchema, data, 'Invalid project data');
};

export const validateIssue = (data: unknown) => {
  return validateData(IssueSchema, data, 'Invalid issue data');
};

// Array validation functions
export const validateTimesheetEntries = (data: unknown) => {
  return validateData(z.array(TimesheetEntrySchema), data, 'Invalid timesheet entries array');
};

export const validateUsers = (data: unknown) => {
  return validateData(z.array(UserSchema), data, 'Invalid users array');
};

export const validateProjects = (data: unknown) => {
  return validateData(z.array(ProjectSchema), data, 'Invalid projects array');
};

// Partial validation for updates
export const validatePartialFilterState = (data: unknown) => {
  return validateData(FilterStateSchema.partial(), data, 'Invalid partial filter state');
};

export const validatePartialGroupingConfig = (data: unknown) => {
  return validateData(GroupingConfigSchema.partial(), data, 'Invalid partial grouping configuration');
};

// Date validation helpers
export const isValidDateString = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === date.toISOString().split('T')[0];
};

export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  if (!isValidDateString(startDate) || !isValidDateString(endDate)) {
    return false;
  }
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return start <= end;
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  return z.string().url().safeParse(url).success;
};

// Sanitization functions
export const sanitizeSearchText = (text: string): string => {
  return text.trim().replace(/[<>]/g, '');
};

export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
};

// Type assertion helpers with validation
export const assertIsFilterState = (data: unknown): asserts data is import('../types').FilterState => {
  validateFilterState(data);
};

export const assertIsGroupingConfig = (data: unknown): asserts data is import('../types').GroupingConfig => {
  validateGroupingConfig(data);
};

export const assertIsTimesheetEntry = (data: unknown): asserts data is import('../types').TimesheetEntry => {
  validateTimesheetEntry(data);
};