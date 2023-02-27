export class AggregationStatusBar {
  public constructor(
    public isVisible: boolean,
    public showFullModel: boolean,
    public data: AggregationStatusBarData,
    public average: number,
    public count: number,
    public min: number,
    public max: number,
    public sum: number
  ) {}
}

export class AggregationStatusBarData {
  public constructor(
    public numberCells: Map<string, number>,
    public stringCells: Map<string, string>
  ) {}
}
