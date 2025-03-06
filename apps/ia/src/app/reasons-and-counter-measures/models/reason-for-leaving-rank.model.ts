export class ReasonForLeavingRank {
  constructor(
    public rank: number | undefined,
    public reasonId: number | undefined,
    public reason: string | undefined,
    public detailedReasonId: number | undefined,
    public detailedReason: string | undefined,
    public leavers: number,
    public percentage: number | undefined
  ) {}
}
