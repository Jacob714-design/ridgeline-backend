import { Router } from 'express';
import { prisma } from '../server';
import { authenticate } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const { zip } = req.query;
    
    if (!zip || typeof zip !== 'string') {
      throw new AppError(400, 'ZIP code is required');
    }

    // In production, this would map ZIP to jurisdiction
    const jurisdiction = `CITY_${zip.slice(0, 3)}`;

    const codes = await prisma.codeLookup.findMany({
      where: { jurisdiction },
      orderBy: { codeText: 'asc' },
    });

    res.json(codes);
  } catch (error) {
    next(error);
  }
});

export default router;