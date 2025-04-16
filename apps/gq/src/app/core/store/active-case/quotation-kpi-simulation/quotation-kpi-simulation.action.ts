import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail, SimulatedQuotation } from '@gq/shared/models';
import { QuotationDetailsSimulatedKpi } from '@gq/shared/services/rest/calculation/model/quotation-details-simulated-kpi.interface';
import { QuotationDetailsSimulationKpiData } from '@gq/shared/services/rest/calculation/model/quotation-details-simulation-kpi-data.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const QuotationKpiSimulationActions = createActionGroup({
  source: 'Quotation KPI Simulation',
  events: {
    'Confirm Simulated Quotation': emptyProps(),
    'Reset Simulated Quotation': emptyProps(),
    'Calculate Simulated KPI': props<{
      simulationData: QuotationDetailsSimulationKpiData;
    }>(),
    'Calculate Simulated KPI Success': props<{
      simulatedKpis: QuotationDetailsSimulatedKpi;
    }>(),
    'Calculate Simulated KPI Failure': props<{
      errorMessage: string;
    }>(),
    'Calculate Simulated Summary Quotation': props<{
      gqId: number;
      simulatedQuotationDetails: QuotationDetail[];
      simulatedField: ColumnFields;
      selectedQuotationDetails: QuotationDetail[];
    }>(),
    'Calculate Simulated Summary Quotation Success': props<{
      simulatedQuotation: SimulatedQuotation;
    }>(),
    'Calculate Simulated Summary Quotation Failure': props<{
      errorMessage: string;
    }>(),
  },
});
