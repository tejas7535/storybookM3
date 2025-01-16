import { SelectedQuotationDetailsKpiState } from '../../../../app/shared/ag-grid/custom-status-bar/quotation-details-status/store/selected-quotation-details-kpi.reducer';
export const SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK: SelectedQuotationDetailsKpiState =
  {
    selectedQuotationDetailsKpi: {
      amountOfQuotationDetails: 0,
      totalNetValue: null,
      totalWeightedAveragePriceDiff: null,
      totalWeightedAverageGpi: null,
      totalWeightedAverageGpm: null,
    },
    loading: false,
    error: undefined as any,
  };
