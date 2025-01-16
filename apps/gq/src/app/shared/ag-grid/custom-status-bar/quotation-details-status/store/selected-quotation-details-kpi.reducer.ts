import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
import { createFeature, createReducer, on } from '@ngrx/store';

import { SelectedQuotationDetailsKpiActions } from './selected-quotation-details-kpi.actions';

export interface SelectedQuotationDetailsKpiState {
  selectedQuotationDetailsKpi: QuotationDetailsSummaryKpi;
  loading: boolean;
  error: Error;
}

export const initialState: SelectedQuotationDetailsKpiState = {
  selectedQuotationDetailsKpi: {
    amountOfQuotationDetails: 0,
    totalNetValue: null,
    totalWeightedAveragePriceDiff: null,
    totalWeightedAverageGpi: null,
    totalWeightedAverageGpm: null,
  },
  loading: false,
  error: undefined,
};
export const SELECTED_QUOTATION_DETAILS_KPI_KEY = 'selectedQuotationDetailsKpi';

export const selectedQuotationDetailsKpiFeature = createFeature({
  name: SELECTED_QUOTATION_DETAILS_KPI_KEY,
  reducer: createReducer(
    initialState,
    on(
      SelectedQuotationDetailsKpiActions.loadQuotationKPI,
      (state): SelectedQuotationDetailsKpiState => ({
        ...state,
        loading: true,
        error: undefined,
      })
    ),
    on(
      SelectedQuotationDetailsKpiActions.loadQuotationKPISuccess,
      (state, { response }): SelectedQuotationDetailsKpiState => ({
        ...state,
        loading: false,
        selectedQuotationDetailsKpi: response,
        error: undefined,
      })
    ),
    on(
      SelectedQuotationDetailsKpiActions.loadQuotationKPIFailure,
      (state, { error }): SelectedQuotationDetailsKpiState => ({
        ...state,
        error,
        loading: false,
      })
    ),
    on(
      SelectedQuotationDetailsKpiActions.resetQuotationKPI,
      (state): SelectedQuotationDetailsKpiState => ({
        ...state,
        selectedQuotationDetailsKpi: initialState.selectedQuotationDetailsKpi,
        loading: false,
      })
    )
  ),
});
