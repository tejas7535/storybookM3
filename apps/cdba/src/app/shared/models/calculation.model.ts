export class Calculation {
  constructor(
    public plant: string,
    public quantity: number,
    public calculationDate: string,
    public costType: string,
    public price: number,
    public currency: string,
    public priceUnit: number,
    public materialNumber: string,
    public lotSize: number,
    public quotationNumber: string,
    public rfqNumber: string,
    public bomCostingDate: string,
    public bomCostingNumber: string,
    public bomCostingType: string,
    public bomCostingVersion: string,
    public bomEnteredManually: boolean,
    public bomReferenceObject: string,
    public bomValuationVariant: string
  ) {}
}
