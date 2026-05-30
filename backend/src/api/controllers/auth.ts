import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../../types';
import { AppError } from '../middleware/errorHandler';
import logger from '../../utils/logger';
import { User, AuditLog } from '../../models';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function login(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.active) {
      throw new AppError(401, 'Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );

    await AuditLog.create({
      userId: user._id.toString(),
      action: 'LOGIN',
      entity: 'User',
      entityId: user._id.toString(),
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      throw new AppError(409, 'Email already registered');
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role || 'ADMIN',
    });

    logger.info(`Admin created: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.userId).select('_id email name role createdAt');

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
