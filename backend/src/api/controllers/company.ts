import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, CompanyQueryParams } from '../../types';
import { AppError } from '../middleware/errorHandler';
import { parsePagination, generateSlug } from '../../utils/helpers';
import logger from '../../utils/logger';
import { Company, AuditLog, SearchQuery } from '../../models';

export async function getCompanies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as CompanyQueryParams;
    const { page, limit, skip } = parsePagination(query);

    const filter: Record<string, any> = {};

    if (query.state) {
      filter.state = { $regex: query.state, $options: 'i' };
    }
    if (query.industry) {
      filter.industry = { $regex: query.industry, $options: 'i' };
    }
    if (query.city) {
      filter.city = { $regex: query.city, $options: 'i' };
    }
    if (query.department) {
      filter.departments = { $in: [new RegExp(query.department, 'i')] };
    }
    if (query.internshipType) {
      filter.internshipType = query.internshipType;
    }
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { industry: { $regex: query.search, $options: 'i' } },
        { city: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN') {
      if (query.status) {
        filter.status = query.status;
      }
      if (query.verificationStatus) {
        filter.verificationStatus = query.verificationStatus;
      }
    } else {
      filter.status = 'APPROVED';
    }

    const sortBy = query.sortBy || 'name';
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('name slug industry state city address email website phone departments internshipAvailable internshipType description verificationStatus status collectedAt'),
      Company.countDocuments(filter),
    ]);

    if (query.search) {
      await SearchQuery.create({
        query: query.search,
        state: query.state,
        industry: query.industry,
        department: query.department,
        results: companies.length,
      });
    }

    res.json({
      success: true,
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const isAdmin = req.user?.role === 'ADMIN' || req.user?.role === 'SUPER_ADMIN';

    // Try to look up by slug first, fall back to _id if id looks like an ObjectId
    let company = await Company.findOne({
      slug: id,
      ...(isAdmin ? {} : { status: 'APPROVED' }),
    });

    if (!company && /^[a-f\d]{24}$/i.test(id)) {
      company = await Company.findOne({
        _id: id,
        ...(isAdmin ? {} : { status: 'APPROVED' }),
      });
    }

    if (!company) {
      throw new AppError(404, 'Company not found');
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}

export async function createCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const data = req.body;
    const slug = generateSlug(data.name);

    const company = await Company.create({
      ...data,
      slug,
      source: 'MANUAL',
      status: 'PENDING',
      departments: data.departments || [],
      collectedBy: req.user!.userId,
    });

    await AuditLog.create({
      userId: req.user!.userId,
      action: 'CREATE',
      entity: 'Company',
      entityId: company._id.toString(),
      newValue: { name: company.name, state: company.state },
    });

    logger.info(`Company created manually: ${company.name}`);

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}

export async function updateCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await Company.findById(id);
    if (!existing) {
      throw new AppError(404, 'Company not found');
    }

    const company = await Company.findByIdAndUpdate(id, data, { new: true });

    await AuditLog.create({
      userId: req.user!.userId,
      action: 'UPDATE',
      entity: 'Company',
      entityId: id,
      oldValue: { name: existing.name, state: existing.state },
      newValue: { name: company!.name, state: company!.state },
    });

    logger.info(`Company updated: ${company!.name}`);

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}

export async function deleteCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existing = await Company.findById(id);
    if (!existing) {
      throw new AppError(404, 'Company not found');
    }

    await Company.findByIdAndDelete(id);

    await AuditLog.create({
      userId: req.user!.userId,
      action: 'DELETE',
      entity: 'Company',
      entityId: id,
      oldValue: { name: existing.name },
    });

    logger.info(`Company deleted: ${existing.name}`);

    res.json({ success: true, message: 'Company deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function approveCompany(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, verificationStatus } = req.body;

    const company = await Company.findByIdAndUpdate(
      id,
      {
        status: status || 'APPROVED',
        verificationStatus: verificationStatus || 'VERIFIED',
        approvedById: req.user!.userId,
        approvedAt: new Date(),
      },
      { new: true }
    );

    if (!company) {
      throw new AppError(404, 'Company not found');
    }

    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
}

export async function bulkCreateCompanies(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { companies } = req.body;

    if (!Array.isArray(companies) || companies.length === 0) {
      throw new AppError(400, 'Companies array is required');
    }

    const results = { created: 0, errors: 0, errorDetails: [] as string[] };

    for (const data of companies) {
      try {
        const slug = generateSlug(data.name);
        await Company.create({
          ...data,
          slug,
          source: 'BULK_UPLOAD',
          status: 'PENDING',
          departments: data.departments || [],
          collectedBy: req.user!.userId,
        });
        results.created++;
      } catch (err: any) {
        results.errors++;
        results.errorDetails.push(`${data.name}: ${err.message}`);
      }
    }

    logger.info(`Bulk upload: ${results.created} created, ${results.errors} errors`);

    res.status(201).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
}
