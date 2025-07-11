import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

export class ClaimController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const where: any = {};
      
      // Filter by role
      if (req.user?.role === 'CONTRACTOR') {
        where.userId = req.user.userId;
      }

      const claims = await prisma.claim.findMany({
        where,
        include: {
          client: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(claims);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const claim = await prisma.claim.findUnique({
        where: { id: req.params.id },
        include: {
          client: true,
          projects: {
            orderBy: { createdAt: 'desc' },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!claim) {
        throw new AppError(404, 'Claim not found');
      }

      res.json(claim);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const claim = await prisma.claim.create({
        data: {
          ...req.body,
          userId: req.user?.userId,
        },
        include: {
          client: true,
        },
      });
      res.status(201).json(claim);
    } catch (error: any) {
      if (error.code === 'P2002') {
        next(new AppError(409, 'Claim number already exists'));
      } else {
        next(error);
      }
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const claim = await prisma.claim.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
          client: true,
        },
      });
      res.json(claim);
    } catch (error: any) {
      if (error.code === 'P2025') {
        next(new AppError(404, 'Claim not found'));
      } else {
        next(error);
      }
    }
  }

  async createProject(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await prisma.project.create({
        data: {
          ...req.body,
          claimId: req.params.id,
          userId: req.user?.userId,
        },
      });
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }
}

export const claimController = new ClaimController();