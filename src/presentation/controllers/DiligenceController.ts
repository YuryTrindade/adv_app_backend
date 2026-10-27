import { Prisma, PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export class DiligenceController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const diligence = await prisma.diligence.create({
        data: { ...req.body, userId: req.userId! }
      });
      res.status(201).json(diligence);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const diligences = await prisma.diligence.findMany({
        where: { userId: req.userId! },
        include: { case: { include: { client: true } } },
        orderBy: { date: 'asc' }
      });

      const formatted = diligences.map(d => ({
        ...d,
        cases: d.case ? { ...d.case, clients: d.case.client } : null
      }));

      res.status(200).json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar diligências.' });
    }
  }

  async getPending(req: AuthRequest, res: Response): Promise<void> {
    try {
      const today = new Date();
      const diligences = await prisma.diligence.findMany({
        where: {
          userId: req.userId!,
          status: { in: ['agendada', 'em_andamento'] },
          date: { gte: today }
        },
        include: { case: { include: { client: true } } },
        orderBy: { date: 'asc' }
      });

      const formatted = diligences.map(d => ({
        ...d,
        cases: d.case ? { ...d.case, clients: d.case.client } : null
      }));

      res.status(200).json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar diligências pendentes.' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const diligence = await prisma.diligence.findFirst({
        where: { id: req.params.id, userId: req.userId! },
        include: { case: { include: { client: true } } }
      });

      if (!diligence) {
        res.status(404).json({ error: 'Diligência não encontrada.' });
        return;
      }

      res.status(200).json({
        ...diligence,
        cases: diligence.case ? { ...diligence.case, clients: diligence.case.client } : null
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar diligência.' });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const diligence = await prisma.diligence.update({
        where: { id: req.params.id, userId: req.userId! },
        data: req.body
      });
      res.status(200).json(diligence);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao atualizar diligência.' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await prisma.diligence.delete({
        where: { id: req.params.id, userId: req.userId! }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao excluir diligência.' });
    }
  }

  async uploadDocument(req: AuthRequest, res: Response): Promise<void> {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'Nenhum documento enviado.' });
        return;
      }

      const fileUrl = `/uploads/diligences/${file.filename}`;
      const diligenceId = req.params.id;

      const diligence = await prisma.diligence.findFirst({
        where: { id: diligenceId, userId: req.userId! }
      });

      if (!diligence) {
        res.status(404).json({ error: 'Diligência não encontrada.' });
        return;
      }

      const currentDocs = (diligence.documents as Prisma.JsonArray) || [];
      const newDoc = {
        name: file.originalname,
        path: file.path,
        url: fileUrl,
        uploaded_at: new Date().toISOString()
      };

      await prisma.diligence.update({
        where: { id: diligenceId },
        data: { documents: [...currentDocs, newDoc] }
      });

      res.status(200).json({ url: fileUrl });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao processar o upload do documento.' });
    }
  }
}