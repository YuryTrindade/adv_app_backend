import { randomUUID } from 'crypto';
import { CaseHistory } from '../../domain/entities/CaseHistory';
import { ICaseRepository } from '../repositories/ICaseRepository';

export interface AddCaseHistoryDTO {
  userId: string;
  caseId: string;
  action: string;
  provision: string;
}

export class AddCaseHistoryUseCase {
  constructor(private readonly caseRepository: ICaseRepository) { }

  async execute(data: AddCaseHistoryDTO): Promise<CaseHistory> {
    const existingCase = await this.caseRepository.findById(data.caseId, data.userId);

    if (!existingCase) {
      throw new Error('Processo não encontrado ou acesso negado.');
    }

    const newHistory = new CaseHistory(
      randomUUID(),
      data.caseId,
      data.action,
      data.provision,
      new Date()
    );

    return await this.caseRepository.addHistory(newHistory);
  }
}