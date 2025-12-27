import { Router } from 'express';
import * as donationController from '../controllers/donation.controller.js';

const router = Router();

router.post('/', donationController.createDonation);

export default router;
