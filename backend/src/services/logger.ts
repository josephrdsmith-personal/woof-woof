interface LogMetadata {
    [key: string]: any;
  }
  
  export class Logger {
    private static instance: Logger;
  
    private constructor() {}
  
    static getInstance(): Logger {
      if (!Logger.instance) {
        Logger.instance = new Logger();
      }
      return Logger.instance;
    }
  
    info(message: string, metadata?: LogMetadata): void {
      this.log('INFO', message, metadata);
    }
  
    error(message: string, metadata?: LogMetadata): void {
      this.log('ERROR', message, metadata);
    }
  
    warn(message: string, metadata?: LogMetadata): void {
      this.log('WARN', message, metadata);
    }
  
    debug(message: string, metadata?: LogMetadata): void {
      if (process.env.NODE_ENV !== 'production') {
        this.log('DEBUG', message, metadata);
      }
    }
  
    private log(level: string, message: string, metadata?: LogMetadata): void {
      const timestamp = new Date().toISOString();
      const logData = {
        timestamp,
        level,
        message,
        ...metadata,
      };
  
      // In production, you might want to use a proper logging service
      // For now, we'll just use console.log with proper formatting
      if (level === 'ERROR') {
        console.error(JSON.stringify(logData, null, 2));
      } else {
        console.log(JSON.stringify(logData, null, 2));
      }
    }
  }