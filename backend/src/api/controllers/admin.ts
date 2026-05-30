import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../types';
import { Company, User, SearchQuery, CollectionLog, StateInfo } from '../../models';

export async function getDashboardStats(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const [totalCompanies, pendingCount, approvedCount, rejectedCount, totalUsers, totalSearches] =
      await Promise.all([
        Company.countDocuments(),
        Company.countDocuments({ status: 'PENDING' }),
        Company.countDocuments({ status: 'APPROVED' }),
        Company.countDocuments({ status: 'REJECTED' }),
        User.countDocuments(),
        SearchQuery.countDocuments(),
      ]);

    const stateDistribution = await Company.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { state: '$_id', _id: 0, count: 1 } },
    ]);

    const industryDistribution = await Company.aggregate([
      { $group: { _id: '$industry', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { industry: '$_id', _id: 0, count: 1 } },
    ]);

    const recentLogs = await CollectionLog.find()
      .sort({ startedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        overview: {
          totalCompanies,
          pendingCount,
          approvedCount,
          rejectedCount,
          totalUsers,
          totalSearches,
        },
        stateDistribution: stateDistribution.map((s) => ({ state: s.state, _count: { id: s.count } })),
        industryDistribution: industryDistribution.map((s) => ({ industry: s.industry, _count: { id: s.count } })),
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCollectionLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string || '20', 10)));
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      CollectionLog.find().sort({ startedAt: -1 }).skip(skip).limit(limit),
      CollectionLog.countDocuments(),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

export async function getStatesList(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const states = await StateInfo.find().sort({ name: 1 });
    res.json({ success: true, data: states });
  } catch (error) {
    next(error);
  }
}

let _collector: any;
async function getCollector() {
  if (!_collector) {
    try {
      const mod = await import('../../services/ai-collector');
      _collector = mod.aiCollector;
    } catch {
      return null;
    }
  }
  return _collector;
}

export async function triggerCollection(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const collector = await getCollector();
    if (!collector) {
      return res.status(503).json({ success: false, error: 'AI Collector not available in this environment' });
    }
    const { states } = req.body || {};
    const result = await collector.triggerManualScan(states || undefined);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getCollectorStatus(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const collector = await getCollector();
    if (!collector) {
      return res.json({ success: true, data: { isRunning: false, collectorEnabled: false, aiAvailable: false, lastRun: null } });
    }
    const status = collector.getStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
}
