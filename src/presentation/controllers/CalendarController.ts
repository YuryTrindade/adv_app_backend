import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export class CalendarController {
  async getAuthUrl(req: AuthRequest, res: Response): Promise<void> {
    // Simulação: Retorna um link genérico ou URL gerado pela biblioteca googleapis
    const mockAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=MOCK&redirect_uri=MOCK';
    res.status(200).json({ url: mockAuthUrl });
  }

  async callback(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Simulação: Receberia o code, faria fetch dos tokens e guardaria
      await prisma.user.update({
        where: { id: req.userId! },
        data: {
          googleCalendarConnected: true,
          googleRefreshToken: 'mock-refresh-token',
          googleCalendarId: 'primary'
        }
      });
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao processar callback do calendário.' });
    }
  }

  async disconnect(req: AuthRequest, res: Response): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: req.userId! },
        data: {
          googleCalendarConnected: false,
          googleRefreshToken: null,
          googleCalendarId: null
        }
      });
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao desconectar calendário.' });
    }
  }
}