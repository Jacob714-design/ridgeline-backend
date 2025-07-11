import { Router } from 'express';
import { clientController } from '../controllers/client.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema';

const router = Router();

router.use(authenticate);

router.get('/', clientController.getAll);
router.get('/:id', clientController.getById);
router.post('/', validate(createClientSchema), clientController.create);
router.put('/:id', validate(updateClientSchema), clientController.update);
router.delete('/:id', authorize('ADMIN'), clientController.delete);

export default router;