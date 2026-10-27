import { Request, Response } from 'express';
import { AuthUseCases } from '../../application/use-cases/AuthUseCases';
import { AuthRequest } from '../middlewares/authMiddleware';

export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) { }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.authUseCases.login(req.body);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const result = await this.authUseCases.getProfile(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }
}