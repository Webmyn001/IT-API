import { Router } from 'express';
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  approveCompany,
  bulkCreateCompanies,
} from '../controllers/company';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCompanySchema, updateCompanySchema, companyQuerySchema } from '../validators/company';

const router = Router();

router.get('/', validate(companyQuerySchema), getCompanies);
router.get('/:id', getCompany);

router.post('/', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), validate(createCompanySchema), createCompany);
router.put('/:id', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), validate(updateCompanySchema), updateCompany);
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), deleteCompany);

router.patch('/:id/approve', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), approveCompany);
router.post('/bulk', authenticate, requireRole('ADMIN', 'SUPER_ADMIN'), bulkCreateCompanies);

export default router;
