import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { QuotationKpiSimulationActions } from '@gq/core/store/active-case/quotation-kpi-simulation/quotation-kpi-simulation.action';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '@gq/shared/models';
import { QuotationDetailsSimulationKpiData } from '@gq/shared/services/rest/calculation/model/quotation-details-simulation-kpi-data.interface';
import { Action } from '@ngrx/store';

import { ACTIVE_CASE_STATE_MOCK } from '../../../../../testing/mocks';
import {
  QUOTATION_DETAIL_MOCK,
  SIMULATED_QUOTATION_MOCK,
} from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';

describe('Quotation KPI Simulation Reducer', () => {
  describe('SimulatedSummaryForQuotation', () => {
    test('should calculated new simulated summary for quotation success', () => {
      const quotationDetail: QuotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        rfqData: null,
      };
      const simulatedQuotation = {
        gqId: 1_234_543,
        simulatedField: ColumnFields.CUSTOMER_MATERIAL,
        quotationDetails: [quotationDetail],
        previousStatusBar: SIMULATED_QUOTATION_MOCK.previousStatusBar,
        simulatedStatusBar: SIMULATED_QUOTATION_MOCK.simulatedStatusBar,
      };

      const action: Action =
        QuotationKpiSimulationActions.calculateSimulatedSummaryQuotationSuccess(
          {
            simulatedQuotation,
          }
        );

      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulatedItem: {
            ...SIMULATED_QUOTATION_MOCK,
          },
        },
        action
      );

      expect(state.simulatedItem).toEqual(simulatedQuotation);
    });
  });

  describe('SimulatedKpiValues', () => {
    test('should set simulation data for simulated kpi values', () => {
      const simulationData: QuotationDetailsSimulationKpiData = {
        gqId: 1234,
        simulatedField: ColumnFields.PRICE_SOURCE,
        priceSourceOption: PriceSourceOptions.GQ,
        selectedQuotationDetails: [QUOTATION_DETAIL_MOCK],
      };

      const action: Action =
        QuotationKpiSimulationActions.calculateSimulatedKPI({
          simulationData,
        });

      const state = activeCaseFeature.reducer(
        {
          ...ACTIVE_CASE_STATE_MOCK,
          simulationData,
        },
        action
      );

      expect(state.simulationData).toEqual(simulationData);
    });
  });
});
