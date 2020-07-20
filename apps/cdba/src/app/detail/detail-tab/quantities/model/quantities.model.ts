export class QuantitiesDetails {
  constructor(
    public pcmQuantity: number,
    public netSales: number[],
    public budgetQuantityCurrentYear: number,
    public budgetQuantitySoco: number,
    public actualQuantities: number[],
    public plannedQuantities: number[],
    public currency: string
  ) {}
}
