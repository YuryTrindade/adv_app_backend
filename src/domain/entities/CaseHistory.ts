export class CaseHistory {
  constructor(
    public readonly id: string,
    public readonly caseId: string,
    public action: string,
    public provision: string,
    public readonly date: Date
  ) { }
}