import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export class HearingController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const hearing = await prisma.hearing.create({
        data: { ...req.body, userId: req.userId! }
      });
      res.status(201).json(hearing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const hearings = await prisma.hearing.findMany({
        where: { userId: req.userId! },
        include: {
          case: {
            include: { client: true }
          }
        },
        orderBy: { date: 'asc' }
      });

      const formatted = hearings.map(h => ({
        ...h,
        cases: { ...h.case, clients: h.case?.client }
      }));

      res.status(200).json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar audiências.' });
    }
  }

  async getUpcoming(req: AuthRequest, res: Response): Promise<void> {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + days);

      const hearings = await prisma.hearing.findMany({
        where: {
          userId: req.userId!,
          date: { gte: today, lte: endDate }
        },
        include: {
          case: { include: { client: true } }
        },
        orderBy: { date: 'asc' }
      });

      const formatted = hearings.map(h => ({
        ...h,
        cases: { ...h.case, clients: h.case?.client }
      }));

      res.status(200).json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar próximas audiências.' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const hearing = await prisma.hearing.findFirst({
        where: { id: req.params.id, userId: req.userId! },
        include: {
          case: { include: { client: true } }
        }
      });

      if (!hearing) {
        res.status(404).json({ error: 'Audiência não encontrada.' });
        return;
      }

      res.status(200).json({
        ...hearing,
        cases: { ...hearing.case, clients: hearing.case?.client }
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar audiência.' });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const hearing = await prisma.hearing.update({
        where: { id: req.params.id, userId: req.userId! },
        data: req.body
      });
      res.status(200).json(hearing);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao atualizar audiência.' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await prisma.hearing.delete({
        where: { id: req.params.id, userId: req.userId! }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao excluir audiência.' });
    }
  }
}