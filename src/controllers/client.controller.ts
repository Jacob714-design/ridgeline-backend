import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';

export class ClientController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const clients = await prisma.client.findMany({
        orderBy: { createdAt: 'desc' },
      });
      res.json(clients);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await prisma.client.findUnique({
        where: { id: req.params.id },
        include: {
          claims: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!client) {
        throw new AppError(404, 'Client not found');
      }

      res.json(client);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await prisma.client.create({
        data: req.body,
      });
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const client = await prisma.client.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(client);
    } catch (error: any) {
      if (error.code === 'P2025') {
        next(new AppError(404, 'Client not found'));
      } else {
        next(error);
      }
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await prisma.client.delete({
        where: { id: req.params.id },
      });
      res.status(204).send();
    } catch (error: any) {
      if (error.code === 'P2025') {
        next(new AppError(404, 'Client not found'));
      } else {
        next(error);
      }
    }
  }
}

export const clientController = new ClientController();