export class ProductionDetails {
  constructor(
    public procurementType: string,
    public plant: string,
    public saleableItem: boolean,
    public productionTechnology: string,
    public manufacturingProcess: string,
    public specialProcurement: string,
    public purchasePriceValidFrom: number,
    public purchasePriceValidUntil: number,
    public supplier: string
  ) {}
}
