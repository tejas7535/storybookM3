export class ProductCostAnalysis {
  sqvMargin: number;
  gpcMargin: number;

  constructor(
    public materialDesignation: string,
    public averagePrice: number,
    public sqvCosts: number,
    public gpcCosts: number,
    public id: string
  ) {
    // calculate margins
    this.sqvMargin =
      sqvCosts && averagePrice
        ? (averagePrice - sqvCosts) / averagePrice
        : undefined;

    this.gpcMargin =
      gpcCosts && averagePrice
        ? (averagePrice - gpcCosts) / averagePrice
        : undefined;
  }
}
