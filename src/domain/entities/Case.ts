import { CaseHistory } from './CaseHistory';

export class Case {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly clientId: string,
    public caseNumber: string,
    public type: string,
    public subject: string,
    public status: string,
    public court?: string | null,
    public description?: string | null,
    public filingDate?: Date | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public history: CaseHistory[] = []
  ) { }

  public addHistory(history: CaseHistory): void {
    this.history.push(history);
  }
}