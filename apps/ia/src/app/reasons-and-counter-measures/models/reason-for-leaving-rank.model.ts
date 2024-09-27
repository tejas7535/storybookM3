export class ReasonForLeavingRank {
  constructor(
    public rank: number,
    public reason: string,
    public leavers: number,
    public percentage: number
  ) {}
}
