import { QuotationDetail } from '@gq/shared/models';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SelectedQuotationDetailsKpiActions = createActionGroup({
  source: 'selectedQuotationDetailsKpi',
  events: {
    'Load Quotation KPI': props<{ data: QuotationDetail[] }>(),
    'Load Quotation KPI Success': props<{
      response: QuotationDetailsSummaryKpi;
    }>(),
    'Load Quotation KPI Failure': props<{ error: Error }>(),
    'Reset Quotation KPI': emptyProps(),
  },
});
