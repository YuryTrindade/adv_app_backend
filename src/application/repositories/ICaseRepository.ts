import { Case } from '../../domain/entities/Case';
import { CaseHistory } from '../../domain/entities/CaseHistory';

export interface ICaseRepository {
  create(caseData: Case): Promise<Case>;
  findById(id: string, userId: string): Promise<Case | null>;
  findAllByUserId(userId: string): Promise<Case[]>;
  update(id: string, userId: string, caseData: Partial<Case>): Promise<Case>;
  delete(id: string, userId: string): Promise<void>;
  addHistory(history: CaseHistory): Promise<CaseHistory>;
}