export class PriceDetails {
  constructor(
    public pcmSqv: number,
    public pcmCalculationDate: number,
    public sqvSapLatestMonth: number,
    public sqvDate: number,
    public gpcLatestYear: number,
    public gpcDate: number,
    public puUm: string,
    public currency: string
  ) {}
}
