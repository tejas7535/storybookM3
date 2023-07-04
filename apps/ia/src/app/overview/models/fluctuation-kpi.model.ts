export class FluctuationKpi {
  public constructor(
    public fluctuationRate: string,
    public unforcedFluctuationRate: string,
    public name: string,
    public realTotalLeaversCount?: number,
    public realUnforcedLeaversCount?: number
  ) {}
}
