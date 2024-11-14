export class ReasonForLeavingRank {
  constructor(
    public rank: number,
    public reasonId: number,
    public reason: string,
    public detailedReasonId: number,
    public detailedReason: string,
    public leavers: number,
    public percentage: number
  ) {}
}
