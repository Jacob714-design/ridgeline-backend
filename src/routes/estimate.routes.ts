import { Router } from 'express';
import { estimateController } from '../controllers/estimate.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { generateEstimateSchema, updateLineItemSchema } from '../schemas/estimate.schema';

const router = Router();

router.use(authenticate);

router.post('/:id/estimate', validate(generateEstimateSchema), estimateController.generateEstimate);
router.get('/:id/estimate', estimateController.getEstimate);
router.put('/estimate-lines/:lineId', validate(updateLineItemSchema), estimateController.updateLineItem);

export default router;