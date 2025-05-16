declare module 'tesseract.js' {
  interface LoggerMessage {
    progress?: number;
    status?: string;
    [key: string]: any;
  }

  interface Worker {
    recognize(image: string | HTMLImageElement | HTMLCanvasElement): Promise<{
      data: {
        text: string;
        confidence: number;
        [key: string]: any;
      }
    }>;
    logger?: (m: LoggerMessage) => void;
    loadLanguage(lang: string): Promise<void>;
    initialize(lang: string): Promise<void>;
    terminate(): Promise<void>;
    reinitialize(lang: string, oem?: number): Promise<void>;
  }

  export function createWorker(options?: any): Promise<Worker>;
} 