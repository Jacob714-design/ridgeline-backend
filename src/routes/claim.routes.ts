import { Router } from 'express';
import { claimController } from '../controllers/claim.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createClaimSchema, updateClaimSchema } from '../schemas/claim.schema';
import { createProjectSchema } from '../schemas/project.schema';

const router = Router();

router.use(authenticate);

router.get('/', claimController.getAll);
router.get('/:id', claimController.getById);
router.post('/', validate(createClaimSchema), claimController.create);
router.put('/:id', validate(updateClaimSchema), claimController.update);
router.post('/:id/projects', validate(createProjectSchema), claimController.createProject);

export default router;