export class ProductionDetails {
  constructor(
    public procurementType: string,
    public plant: string,
    public saleableItem: boolean,
    public specialProcurement: string,
    public purchasePriceValidFrom: number,
    public purchasePriceValidUntil: number,
    public supplier: string
  ) {}
}
