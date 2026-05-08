/**
 * Type definitions for the Logging Middleware package
 */

/**
 * Stack type - indicates whether the log comes from backend or frontend
 */
export type Stack = 'backend' | 'frontend';

/**
 * Log level - severity level of the log
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

/**
 * Backend packages - packages that can be used in backend applications
 */
export type BackendPackage = 
  | 'cache'
  | 'controller'
  | 'cron_job'
  | 'db'
  | 'domain'
  | 'repository'
  | 'route'
  | 'service'
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

/**
 * Frontend packages - packages that can be used in frontend applications
 */
export type FrontendPackage = 
  | 'api'
  | 'component'
  | 'hook'
  | 'page'
  | 'state'
  | 'style'
  | 'auth'
  | 'config'
  | 'middleware'
  | 'utils';

/**
 * Common packages - packages that can be used in both backend and frontend
 */
export type CommonPackage = 'auth' | 'config' | 'middleware' | 'utils';

/**
 * Package type based on stack
 */
export type Package<T extends Stack = Stack> = 
  T extends 'backend' ? BackendPackage :
  T extends 'frontend' ? FrontendPackage :
  BackendPackage | FrontendPackage;

/**
 * Log request body structure
 */
export interface LogRequest {
  stack: Stack;
  level: LogLevel;
  package: string;
  message: string;
}

/**
 * Log response structure
 */
export interface LogResponse {
  logID: string;
  message: string;
}

/**
 * Logger configuration options
 */
export interface LoggerConfig {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  silentMode?: boolean;
}
