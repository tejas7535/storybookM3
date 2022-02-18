export class ProductionDetails {
  constructor(
    public procurementType: string,
    public plant: string,
    public specialProcurement: string,
    public purchasePriceValidFrom: string,
    public purchasePriceValidUntil: string,
    public supplier: string
  ) {}
}
