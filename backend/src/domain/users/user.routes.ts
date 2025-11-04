import { Router, Response } from 'express';
import { UserService } from './user.service';
import { asyncHandler } from '../../shared/asyncHandler';
import { registerSchema, loginSchema } from './user.dto';
import { authenticate, AuthRequest } from '../../shared/authMiddleware';

const router = Router();
const userService = new UserService();

// POST /api/auth/register - Register new user
router.post(
  '/register',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = registerSchema.parse(req.body);
    const result = await userService.register(dto);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result,
    });
  })
);

// POST /api/auth/login - Login user
router.post(
  '/login',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const dto = loginSchema.parse(req.body);
    const result = await userService.login(dto);

    res.json({
      status: 'success',
      message: 'Login successful',
      data: result,
    });
  })
);

// GET /api/auth/me - Get current user profile
router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await userService.getProfile(req.user!.id);

    res.json({
      status: 'success',
      data: user,
    });
  })
);

export default router;
