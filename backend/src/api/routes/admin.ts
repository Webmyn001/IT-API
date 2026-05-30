import { Router } from 'express';
import { getDashboardStats, getCollectionLogs, getStatesList, triggerCollection, getCollectorStatus } from '../controllers/admin';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), getDashboardStats);
router.get('/logs', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), getCollectionLogs);
router.get('/states', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), getStatesList);
router.post('/collector/trigger', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), triggerCollection);
router.get('/collector/status', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), getCollectorStatus);

export default router;
