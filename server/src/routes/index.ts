import { Router } from 'express';
import authRoutes from './auth.routes.js';
import donationRoutes from './donation.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/donations', donationRoutes);
router.use('/users', userRoutes);

export default router;
