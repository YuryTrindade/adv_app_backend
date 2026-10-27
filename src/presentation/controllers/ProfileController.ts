import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export class ProfileController {
  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await prisma.user.update({
        where: { id: req.userId! },
        data: req.body
      });
      const { passwordHash, ...profile } = user;
      res.status(200).json(profile);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao atualizar perfil.' });
    }
  }

  async uploadAvatar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'Nenhum ficheiro enviado.' });
        return;
      }

      const fileUrl = `/uploads/avatars/${file.filename}`;
      await prisma.user.update({
        where: { id: req.userId! },
        data: { avatarUrl: fileUrl }
      });

      res.status(200).json({ url: fileUrl });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao processar o upload do avatar.' });
    }
  }
}