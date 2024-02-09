import { ReasonForLeavingStats } from './reason-for-leaving-stats.model';

export class ReasonForLeavingRank implements ReasonForLeavingStats {
  constructor(
    public position: number,
    public actionReason: string,
    public percentage: number,
    public leavers: number
  ) {}
}
