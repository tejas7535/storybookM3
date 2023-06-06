export class FluctuationKpi {
  public constructor(
    public fluctuationRate: string,
    public unforcedFluctuationRate: string,
    public name: string,
    public realEmployeesCount: number
  ) {}
}
