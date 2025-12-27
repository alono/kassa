import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';

const router = Router();

router.get('/summary/:username', userController.getSummary);

export default router;
