export class QuotationDetails {
  constructor(
    public materialNumbers: string,
    public materialDescriptions: string,
    public quantities: number,
    public customerNumber: string,
    public customerName: string,
    public region: string,
    public sector: string,
    public subSector: string
  ) {}
}
