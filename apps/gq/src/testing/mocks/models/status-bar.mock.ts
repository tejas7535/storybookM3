import { StatusBar } from '@gq/shared/ag-grid/custom-status-bar/quotation-details-status/model/status-bar.model';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';

// values equal calculations with QUOTATION_DETAIL_MOCK
export const STATUS_BAR_PROPERTIES_MOCK: QuotationDetailsSummaryKpi = {
  totalNetValue: 2000,
  totalWeightedAverageGpi: 90,
  totalWeightedAverageGpm: 85,
  totalWeightedAveragePriceDiff: 17.65,
  amountOfQuotationDetails: 1,
  avgGqRating: 0,
};

export const STATUS_BAR_MOCK: StatusBar = {
  total: STATUS_BAR_PROPERTIES_MOCK,
  selected: STATUS_BAR_PROPERTIES_MOCK,
  filtered: 0,
};
