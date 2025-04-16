import { ActiveCaseState } from '@gq/core/store/active-case/active-case.reducer';
import { QuotationKpiSimulationActions } from '@gq/core/store/active-case/quotation-kpi-simulation/quotation-kpi-simulation.action';
import { ActionCreator, on, ReducerTypes } from '@ngrx/store';

export const QuotationKpiSimulationReducers: ReducerTypes<
  ActiveCaseState,
  ActionCreator[]
>[] = [
  on(
    QuotationKpiSimulationActions.resetSimulatedQuotation,
    (state: ActiveCaseState): ActiveCaseState => ({
      ...state,
      simulatedItem: undefined,
    })
  ),
  on(
    QuotationKpiSimulationActions.calculateSimulatedKPI,
    (state: ActiveCaseState, { simulationData }): ActiveCaseState => ({
      ...state,
      simulationData,
    })
  ),
  on(
    QuotationKpiSimulationActions.calculateSimulatedSummaryQuotationSuccess,
    (state: ActiveCaseState, { simulatedQuotation }): ActiveCaseState => ({
      ...state,
      simulatedItem: simulatedQuotation,
    })
  ),
];
