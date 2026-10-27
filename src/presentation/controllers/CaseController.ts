import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { ICaseRepository } from '../../application/repositories/ICaseRepository';
import { AddCaseHistoryUseCase } from '../../application/use-cases/AddCaseHistoryUseCase';
import { CreateCaseUseCase } from '../../application/use-cases/CreateCaseUseCase';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export class CaseController {
  constructor(
    private readonly createCaseUseCase: CreateCaseUseCase,
    private readonly addCaseHistoryUseCase: AddCaseHistoryUseCase,
    private readonly caseRepository: ICaseRepository
  ) { }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const caseData = await this.createCaseUseCase.execute({ ...req.body, userId });
      res.status(201).json(caseData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const cases = await prisma.case.findMany({
        where: {
          userId: req.userId!,
          ...(search ? {
            OR: [
              { caseNumber: { contains: String(search), mode: 'insensitive' } },
              { subject: { contains: String(search), mode: 'insensitive' } },
              { court: { contains: String(search), mode: 'insensitive' } },
              { type: { contains: String(search), mode: 'insensitive' } },
              { status: { contains: String(search), mode: 'insensitive' } }
            ]
          } : {})
        },
        include: { client: true },
        orderBy: { createdAt: 'desc' }
      });

      const formatted = cases.map(c => ({ ...c, clients: c.client }));
      res.status(200).json(formatted);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar processos.' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const foundCase = await prisma.case.findFirst({
        where: { id: req.params.id, userId: req.userId! },
        include: { client: true, history: { orderBy: { date: 'desc' } } }
      });

      if (!foundCase) {
        res.status(404).json({ error: 'Processo não encontrado.' });
        return;
      }

      res.status(200).json({ ...foundCase, clients: foundCase.client });
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar processo.' });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const updated = await this.caseRepository.update(req.params.id, req.userId!, req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao atualizar processo.' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await this.caseRepository.delete(req.params.id, req.userId!);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao excluir processo.' });
    }
  }

  async addHistory(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { id: caseId } = req.params;
      const historyData = await this.addCaseHistoryUseCase.execute({ ...req.body, userId, caseId });
      res.status(201).json(historyData);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}