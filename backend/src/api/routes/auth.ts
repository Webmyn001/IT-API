import { Router } from 'express';
import { login, createAdmin, getProfile } from '../controllers/auth';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, createAdminSchema } from '../validators/auth';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(createAdminSchema), createAdmin);

router.get('/profile', authenticate, getProfile);

export default router;
