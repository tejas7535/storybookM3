import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';

import { QUOTATION_DETAILS_MOCK } from '../../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK } from '../../../../../../testing/mocks/state/selected-quotation-details-state';
import { SelectedQuotationDetailsKpiActions } from './selected-quotation-details-kpi.actions';
import { selectedQuotationDetailsKpiFeature } from './selected-quotation-details-kpi.reducer';

describe('selectedQuotationDetailsKpiReducer', () => {
  describe('SelectedQuotationDetailsKpiActions', () => {
    test('loadQuotationKPI', () => {
      const action = SelectedQuotationDetailsKpiActions.loadKPI({
        data: QUOTATION_DETAILS_MOCK,
      });
      const state = selectedQuotationDetailsKpiFeature.reducer(
        SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK,
        action
      );
      expect(state).toEqual({
        ...SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK,
        loading: true,
      });
    });
    test('loadQuotationKPISuccess', () => {
      const response: QuotationDetailsSummaryKpi = {
        amountOfQuotationDetails: 1,
        totalNetValue: 2,
        totalWeightedAveragePriceDiff: 3,
        totalWeightedAverageGpi: 4,
        totalWeightedAverageGpm: 5,
        avgGqRating: 3,
      };
      const action = SelectedQuotationDetailsKpiActions.loadKPISuccess({
        response,
      });
      const state = selectedQuotationDetailsKpiFeature.reducer(
        SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK,
        action
      );
      expect(state).toEqual({
        ...SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK.error,
        selectedQuotationDetailsKpi: response,
        loading: false,
      });
    });

    test('loadQuotationKPIFailure', () => {
      const error = new Error('error');
      const action = SelectedQuotationDetailsKpiActions.loadKPIFailure({
        error,
      });
      const state = selectedQuotationDetailsKpiFeature.reducer(
        SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK,
        action
      );
      expect(state).toEqual({
        ...SELECTED_QUOTATION_DETAILS_KPI_STATE_MOCK,
        error,
        loading: false,
      });
    });
  });
});
