import Tesseract from 'tesseract.js';
import { logger } from './logger';

export const performOCR = async (imageUrl: string): Promise<string> => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imageUrl,
      'eng',
      {
        logger: m => logger.debug(m),
      }
    );
    return text;
  } catch (error) {
    logger.error('OCR failed:', error);
    throw new Error('OCR processing failed');
  }
};

export const extractStructuredData = (ocrText: string): Record<string, any> => {
  // Placeholder for structured data extraction logic
  // In production, this would parse the OCR text for specific patterns
  return {
    rawText: ocrText,
    extractedAt: new Date().toISOString(),
    // Add pattern matching for insurance forms, estimates, etc.
  };
};