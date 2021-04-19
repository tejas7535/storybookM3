export class BomIdentifier {
  public constructor(
    public bomCostingDate: string,
    public bomCostingNumber: string,
    public bomCostingType: string,
    public bomCostingVersion: string,
    public bomEnteredManually: string,
    public bomReferenceObject: string,
    public bomValuationVariant: string
  ) {}
}
