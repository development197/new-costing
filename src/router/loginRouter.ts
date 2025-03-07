import { Router } from 'express';
import { login } from '../controllers/loginController';

const router = Router();

// Login endpoint
router.post('/login', login);

export default router;
