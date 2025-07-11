import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { aiService } from '../services/ai.service';
import { Decimal } from '@prisma/client/runtime/library';

export class EstimateController {
  async generateEstimate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = req.params.id;
      
      // Verify project exists
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        throw new AppError(404, 'Project not found');
      }

      // Generate estimate using AI service
      const estimateLines = await aiService.generateEstimate(req.body);

      // Save estimate lines to database
      const createdLines = await prisma.estimateLineItem.createMany({
        data: estimateLines.map(line => ({
          projectId,
          description: line.description,
          unitPrice: new Decimal(line.unitPrice),
          quantity: new Decimal(line.quantity),
          total: new Decimal(line.unitPrice * line.quantity),
          codeRef: line.codeRef,
          manufacturerRef: line.manufacturerRef,
          approvalProbability: line.approvalProbability,
        })),
      });

      // Fetch created lines
      const lines = await prisma.estimateLineItem.findMany({
        where: { projectId },
        orderBy: { createdAt: 'asc' },
      });

      res.status(201).json({ lines, count: createdLines.count });
    } catch (error) {
      next(error);
    }
  }

  async getEstimate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lines = await prisma.estimateLineItem.findMany({
        where: { projectId: req.params.id },
        orderBy: { createdAt: 'asc' },
      });

      const total = lines.reduce((sum, line) => sum + Number(line.total), 0);

      res.json({ lines, total });
    } catch (error) {
      next(error);
    }
  }

  async updateLineItem(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updates: any = { ...req.body };
      
      // Recalculate total if price or quantity changed
      if (updates.unitPrice !== undefined || updates.quantity !== undefined) {
        const existing = await prisma.estimateLineItem.findUnique({
          where: { id: req.params.lineId },
        });

        if (!existing) {
          throw new AppError(404, 'Line item not found');
        }

        const unitPrice = updates.unitPrice ?? Number(existing.unitPrice);
        const quantity = updates.quantity ?? Number(existing.quantity);
        updates.total = new Decimal(unitPrice * quantity);
      }

      // Convert numbers to Decimal
      if (updates.unitPrice) updates.unitPrice = new Decimal(updates.unitPrice);
      if (updates.quantity) updates.quantity = new Decimal(updates.quantity);

      const lineItem = await prisma.estimateLineItem.update({
        where: { id: req.params.lineId },
        data: updates,
      });

      res.json(lineItem);
    } catch (error: any) {
      if (error.code === 'P2025') {
        next(new AppError(404, 'Line item not found'));
      } else {
        next(error);
      }
    }
  }
}

export const estimateController = new EstimateController();