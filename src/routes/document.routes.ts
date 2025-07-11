import { Router } from 'express';
import { documentController } from '../controllers/document.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../utils/s3';

const router = Router();

router.use(authenticate);

router.post('/:id/documents', upload.single('file'), documentController.uploadDocument);
router.get('/:id/documents', documentController.getDocuments);

export default router;