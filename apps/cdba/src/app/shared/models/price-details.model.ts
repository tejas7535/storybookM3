import { PcmCalculation } from './pcm-calculation.model';

export class PriceDetails {
  constructor(
    public pcmCalculations: PcmCalculation[],
    public sqvSapLatestMonth: number,
    public sqvDate: string,
    public gpcLatestYear: number,
    public gpcDate: string,
    public puUm: string,
    public currency: string,
    public averagePrice: number
  ) {}
}
