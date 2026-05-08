import axios, { AxiosInstance, AxiosError } from 'axios';
import { LogRequest, LogResponse, Stack, LogLevel, Package, LoggerConfig } from './types';

/**
 * Logger class - handles all logging operations
 */
export class Logger {
  private client: AxiosInstance;
  private apiUrl: string;
  private silentMode: boolean;

  constructor(config: LoggerConfig = {}) {
    this.apiUrl = config.apiUrl || 'http://4.224.186.213/evaluation-service/logs';
    this.silentMode = config.silentMode || false;

    this.client = axios.create({
      baseURL: this.apiUrl,
      timeout: config.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Main logging function - creates and sends log to the test server
   * @param stack - 'backend' or 'frontend'
   * @param level - 'debug', 'info', 'warn', 'error', 'fatal'
   * @param pkg - package name (e.g., 'controller', 'service', 'handler')
   * @param message - descriptive log message
   * @returns Promise with log ID
   */
  async log(
    stack: Stack,
    level: LogLevel,
    pkg: string,
    message: string
  ): Promise<LogResponse | null> {
    try {
      // Validate inputs
      this.validateInputs(stack, level, pkg, message);

      const payload: LogRequest = {
        stack,
        level,
        'package': pkg,
        message,
      };

      // Log locally first (for debugging)
      this.logLocally(level, pkg, message, stack);

      // Send to remote server
      const response = await this.client.post<LogResponse>('', payload);
      
      return response.data;
    } catch (error) {
      this.handleError(error, { stack, level, pkg, message });
      return null;
    }
  }

  /**
   * Debug level logging
   */
  async debug(pkg: string, message: string, stack: Stack = 'backend'): Promise<LogResponse | null> {
    return this.log(stack, 'debug', pkg, message);
  }

  /**
   * Info level logging
   */
  async info(pkg: string, message: string, stack: Stack = 'backend'): Promise<LogResponse | null> {
    return this.log(stack, 'info', pkg, message);
  }

  /**
   * Warning level logging
   */
  async warn(pkg: string, message: string, stack: Stack = 'backend'): Promise<LogResponse | null> {
    return this.log(stack, 'warn', pkg, message);
  }

  /**
   * Error level logging
   */
  async error(pkg: string, message: string, stack: Stack = 'backend'): Promise<LogResponse | null> {
    return this.log(stack, 'error', pkg, message);
  }

  /**
   * Fatal level logging
   */
  async fatal(pkg: string, message: string, stack: Stack = 'backend'): Promise<LogResponse | null> {
    return this.log(stack, 'fatal', pkg, message);
  }

  /**
   * Validate input parameters
   */
  private validateInputs(stack: Stack, level: LogLevel, pkg: string, message: string): void {
    const validStacks: Stack[] = ['backend', 'frontend'];
    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];

    if (!validStacks.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}. Must be 'backend' or 'frontend'`);
    }

    if (!validLevels.includes(level)) {
      throw new Error(`Invalid level: ${level}. Must be one of: ${validLevels.join(', ')}`);
    }

    if (!pkg || pkg.trim() === '') {
      throw new Error('Package name cannot be empty');
    }

    if (!message || message.trim() === '') {
      throw new Error('Message cannot be empty');
    }
  }

  /**
   * Log locally to console (for development/debugging)
   */
  private logLocally(level: LogLevel, pkg: string, message: string, stack: Stack): void {
    if (this.silentMode) return;

    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${stack.toUpperCase()}] [${level.toUpperCase()}] [${pkg}] ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logEntry);
        break;
      case 'info':
        console.info(logEntry);
        break;
      case 'warn':
        console.warn(logEntry);
        break;
      case 'error':
        console.error(logEntry);
        break;
      case 'fatal':
        console.error(logEntry);
        break;
      default:
        console.log(logEntry);
    }
  }

  /**
   * Handle logging errors
   */
  private handleError(error: unknown, context: any): void {
    if (this.silentMode) return;

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        `[LOGGER_ERROR] Failed to send log to ${this.apiUrl}:`,
        axiosError.message
      );
      console.error('Log context:', context);
      console.error('Response status:', axiosError.response?.status);
      console.error('Response data:', axiosError.response?.data);
    } else if (error instanceof Error) {
      console.error(`[LOGGER_ERROR] ${error.message}`, context);
    } else {
      console.error(`[LOGGER_ERROR] Unknown error occurred`, { error, context });
    }
  }

  /**
   * Set silent mode (disable local logging)
   */
  setSilentMode(silent: boolean): void {
    this.silentMode = silent;
  }

  /**
   * Update API URL
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
    this.client = axios.create({
      baseURL: url,
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// Export singleton instance
export const logger = new Logger();
