const axios = require('axios');

/**
 * Logger class - handles all logging operations
 */
class Logger {
  constructor(config = {}) {
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
   */
  async log(stack, level, pkg, message) {
    try {
      this.validateInputs(stack, level, pkg, message);

      const payload = {
        stack,
        level,
        'package': pkg,
        message,
      };

      this.logLocally(level, pkg, message, stack);

      const response = await this.client.post('', payload);
      
      return response.data;
    } catch (error) {
      this.handleError(error, { stack, level, pkg, message });
      return null;
    }
  }

  async debug(pkg, message, stack = 'backend') {
    return this.log(stack, 'debug', pkg, message);
  }

  async info(pkg, message, stack = 'backend') {
    return this.log(stack, 'info', pkg, message);
  }

  async warn(pkg, message, stack = 'backend') {
    return this.log(stack, 'warn', pkg, message);
  }

  async error(pkg, message, stack = 'backend') {
    return this.log(stack, 'error', pkg, message);
  }

  async fatal(pkg, message, stack = 'backend') {
    return this.log(stack, 'fatal', pkg, message);
  }

  validateInputs(stack, level, pkg, message) {
    const validStacks = ['backend', 'frontend'];
    const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];

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

  logLocally(level, pkg, message, stack) {
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

  handleError(error, context) {
    if (this.silentMode) return;

    if (error.response) {
      console.error(
        `[LOGGER_ERROR] Failed to send log to ${this.apiUrl}:`,
        error.message
      );
      console.error('Log context:', context);
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error instanceof Error) {
      console.error(`[LOGGER_ERROR] ${error.message}`, context);
    } else {
      console.error(`[LOGGER_ERROR] Unknown error occurred`, { error, context });
    }
  }

  setSilentMode(silent) {
    this.silentMode = silent;
  }

  setApiUrl(url) {
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

// Export singleton instance and middleware
const logger = new Logger();

module.exports = logger;
module.exports.Logger = Logger;
