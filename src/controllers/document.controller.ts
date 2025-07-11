import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { getSignedDownloadUrl } from '../utils/s3';
import { performOCR, extractStructuredData } from '../utils/ocr';

interface MulterRequest extends AuthRequest {
  file?: Express.MulterS3.File;
}

export class DocumentController {
  async uploadDocument(req: MulterRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError(400, 'No file uploaded');
      }

      const projectId = req.params.id;

      // Verify project exists
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new AppError(404, 'Project not found');
      }

      // Perform OCR if it's an image
      let ocrData = null;
      if (req.file.mimetype.startsWith('image/')) {
        const signedUrl = await getSignedDownloadUrl(req.file.key);
        const ocrText = await performOCR(signedUrl);
        ocrData = extractStructuredData(ocrText);
      }

      // Save document record
      const document = await prisma.document.create({
        data: {
          entityType: 'PROJECT',
          entityId: projectId,
          fileUrl: req.file.key,
          ocrData,
        },
      });

      res.status(201).json({
        id: document.id,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        ocrData,
        createdAt: document.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDocuments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const documents = await prisma.document.findMany({
        where: {
          entityType: 'PROJECT',
          entityId: req.params.id,
        },
        orderBy: { createdAt: 'desc' },
      });

      // Generate signed URLs for download
      const documentsWithUrls = await Promise.all(
        documents.map(async (doc) => ({
          ...doc,
          downloadUrl: await getSignedDownloadUrl(doc.fileUrl),
        }))
      );

      res.json(documentsWithUrls);
    } catch (error) {
      next(error);
    }
  }
}

export const documentController = new DocumentController();