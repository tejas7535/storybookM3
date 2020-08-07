export class ReferenceTypeIdentifier {
  public constructor(
    public materialNumber: string,
    public plant: string,
    public rfq?: string,
    public pcmCalculationDate?: number,
    public pcmQuantity?: number
  ) {}
}
