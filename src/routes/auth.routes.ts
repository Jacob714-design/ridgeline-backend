import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { signupSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);

export default router;