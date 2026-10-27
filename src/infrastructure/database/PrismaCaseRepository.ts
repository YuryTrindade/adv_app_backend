import { PrismaClient } from '@prisma/client';
import { ICaseRepository } from '../../application/repositories/ICaseRepository';
import { Case } from '../../domain/entities/Case';
import { CaseHistory } from '../../domain/entities/CaseHistory';

const prisma = new PrismaClient();

export class PrismaCaseRepository implements ICaseRepository {
  async create(caseData: Case): Promise<Case> {
    const created = await prisma.case.create({
      data: {
        id: caseData.id,
        userId: caseData.userId,
        clientId: caseData.clientId,
        caseNumber: caseData.caseNumber,
        type: caseData.type,
        subject: caseData.subject,
        status: caseData.status,
        court: caseData.court,
        description: caseData.description,
        filingDate: caseData.filingDate,
      },
      include: {
        history: true,
      },
    });

    return this.mapToDomain(created);
  }

  async findById(id: string, userId: string): Promise<Case | null> {
    const found = await prisma.case.findFirst({
      where: { id, userId },
      include: {
        history: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!found) return null;
    return this.mapToDomain(found);
  }

  async findAllByUserId(userId: string): Promise<Case[]> {
    const cases = await prisma.case.findMany({
      where: { userId },
      include: {
        history: {
          orderBy: { date: 'desc' },
          take: 1, // Traz apenas o último andamento para a listagem
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return cases.map((c) => this.mapToDomain(c));
  }

  async update(id: string, userId: string, caseData: Partial<Case>): Promise<Case> {
    const updated = await prisma.case.update({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
      data: {
        clientId: caseData.clientId,
        caseNumber: caseData.caseNumber,
        type: caseData.type,
        subject: caseData.subject,
        status: caseData.status,
        court: caseData.court,
        description: caseData.description,
        filingDate: caseData.filingDate,
      },
      include: {
        history: true,
      },
    });

    return this.mapToDomain(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    await prisma.case.delete({
      where: {
        id_userId: {
          id,
          userId,
        },
      },
    });
  }

  async addHistory(history: CaseHistory): Promise<CaseHistory> {
    const created = await prisma.caseHistory.create({
      data: {
        id: history.id,
        caseId: history.caseId,
        action: history.action,
        provision: history.provision,
        date: history.date,
      },
    });

    return new CaseHistory(
      created.id,
      created.caseId,
      created.action,
      created.provision,
      created.date
    );
  }

  private mapToDomain(prismaCase: any): Case {
    const domainCase = new Case(
      prismaCase.id,
      prismaCase.userId,
      prismaCase.clientId,
      prismaCase.caseNumber,
      prismaCase.type,
      prismaCase.subject,
      prismaCase.status,
      prismaCase.court,
      prismaCase.description,
      prismaCase.filingDate,
      prismaCase.createdAt,
      prismaCase.updatedAt
    );

    if (prismaCase.history) {
      domainCase.history = prismaCase.history.map(
        (h: any) => new CaseHistory(h.id, h.caseId, h.action, h.provision, h.date)
      );
    }

    return domainCase;
  }
}