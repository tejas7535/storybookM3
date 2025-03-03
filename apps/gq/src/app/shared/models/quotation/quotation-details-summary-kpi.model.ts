export class QuotationDetailsSummaryKpi {
  constructor(
    public totalNetValue = 0,
    public totalWeightedAverageGpi = 0,
    public totalWeightedAverageGpm = 0,
    public totalWeightedAveragePriceDiff = null as number,
    public amountOfQuotationDetails = 0,
    public avgGqRating = 0
  ) {}
}
