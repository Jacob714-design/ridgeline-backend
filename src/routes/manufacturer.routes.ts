import { Router } from 'express';
import { prisma } from '../server';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const manufacturers = await prisma.manufacturerSpec.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(manufacturers);
  } catch (error) {
    next(error);
  }
});

export default router;