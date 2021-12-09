export class ProductCostAnalysis {
  id: string;
  sqvMargin: number;
  gpcMargin: number;

  constructor(
    public materialDesignation: string,
    public averagePrice: number,
    public sqvCosts: number,
    public gpcCosts: number
  ) {
    // add random number to mat.-designation to create a local/temporary id
    this.id = `${materialDesignation
      .toString()
      .replace(/\./g, '')}_${Math.floor(
      100_000 + Math.random() * 900_000
    ).toString()}`;

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
