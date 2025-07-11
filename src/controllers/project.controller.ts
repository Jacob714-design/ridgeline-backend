import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

export class ProjectController {
  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await prisma.project.findUnique({
        where: { id: req.params.id },
        include: {
          claim: {
            include: {
              client: true,
            },
          },
          lineItems: {
            orderBy: { createdAt: 'asc' },
          },
          documents: true,
        },
      });

      if (!project) {
        throw new AppError(404, 'Project not found');
      }

      res.json(project);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await prisma.project.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(project);
    } catch (error: any) {
      if (error.code === 'P2025') {
        next(new AppError(404, 'Project not found'));
      } else {
        next(error);
      }
    }
  }
}

export const projectController = new ProjectController();