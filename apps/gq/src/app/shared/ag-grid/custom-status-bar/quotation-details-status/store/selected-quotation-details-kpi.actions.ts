import { QuotationDetail } from '@gq/shared/models';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SelectedQuotationDetailsKpiActions = createActionGroup({
  source: 'selectedQuotationDetailsKpi',
  events: {
    'Load KPI': props<{ data: QuotationDetail[] }>(),
    'Load KPI Success': props<{
      response: QuotationDetailsSummaryKpi;
    }>(),
    'Load KPI Failure': props<{ error: Error }>(),
    'Reset KPI': emptyProps(),
  },
});
