import { randomUUID } from 'crypto';
import { Case } from '../../domain/entities/Case';
import { ICaseRepository } from '../repositories/ICaseRepository';

export interface CreateCaseDTO {
  userId: string;
  clientId: string;
  caseNumber: string;
  court?: string;
  type: string;
  subject: string;
  status: string;
  description?: string;
  filingDate?: Date;
}

export class CreateCaseUseCase {
  constructor(private readonly caseRepository: ICaseRepository) { }

  async execute(data: CreateCaseDTO): Promise<Case> {
    if (!data.caseNumber || !data.type || !data.subject || !data.status) {
      throw new Error('Campos obrigatórios ausentes.');
    }

    const newCase = new Case(
      randomUUID(),
      data.userId,
      data.clientId,
      data.caseNumber,
      data.type,
      data.subject,
      data.status,
      data.court,
      data.description,
      data.filingDate,
      new Date(),
      new Date()
    );

    return await this.caseRepository.create(newCase);
  }
}