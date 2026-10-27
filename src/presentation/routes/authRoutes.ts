import { Router } from 'express';
import { AuthUseCases } from '../../application/use-cases/AuthUseCases';
import { PrismaUserRepository } from '../../infrastructure/database/PrismaUserRepository';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/authMiddleware';

const authRoutes = Router();

const userRepository = new PrismaUserRepository();
const authUseCases = new AuthUseCases(userRepository);
const authController = new AuthController(authUseCases);

authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.get('/me', authMiddleware, (req, res) => authController.me(req, res));

export { authRoutes };
