import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

export class ClientController {
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await prisma.client.create({
        data: { ...req.body, userId: req.userId! }
      });
      res.status(201).json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { search } = req.query;
      const clients = await prisma.client.findMany({
        where: {
          userId: req.userId!,
          ...(search ? {
            OR: [
              { name: { contains: String(search), mode: 'insensitive' } },
              { email: { contains: String(search), mode: 'insensitive' } },
              { cpfCnpj: { contains: String(search), mode: 'insensitive' } }
            ]
          } : {})
        },
        orderBy: { name: 'asc' }
      });
      res.status(200).json(clients);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar clientes.' });
    }
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await prisma.client.findFirst({
        where: { id: req.params.id, userId: req.userId! }
      });
      if (!client) {
        res.status(404).json({ error: 'Cliente não encontrado.' });
        return;
      }
      res.status(200).json(client);
    } catch (error: any) {
      res.status(500).json({ error: 'Erro ao buscar cliente.' });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const client = await prisma.client.update({
        where: { id: req.params.id, userId: req.userId! },
        data: req.body
      });
      res.status(200).json(client);
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao atualizar cliente.' });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      await prisma.client.delete({
        where: { id: req.params.id, userId: req.userId! }
      });
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: 'Erro ao excluir cliente.' });
    }
  }
}