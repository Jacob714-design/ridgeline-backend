import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { updateProjectSchema } from '../schemas/project.schema';

const router = Router();

router.use(authenticate);

router.get('/:id', projectController.getById);
router.put('/:id', validate(updateProjectSchema), projectController.update);

export default router;