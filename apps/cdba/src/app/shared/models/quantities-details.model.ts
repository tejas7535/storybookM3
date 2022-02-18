import { PcmCalculation } from './pcm-calculation.model';

export class QuantitiesDetails {
  constructor(
    public pcmCalculations: PcmCalculation[],
    public netSales: number[],
    public budgetQuantityCurrentYear: number,
    public budgetQuantitySoco: number,
    public actualQuantities: number[],
    public plannedQuantities: number[],
    public currency: string
  ) {}
}
