import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { createActionGroup, props } from '@ngrx/store';

export const OverviewCasesActions = createActionGroup({
  source: 'OverviewCases',
  events: {
    'load Cases for View': props<{ viewId: number }>(),
    'load Cases': props<{ status: QuotationStatus }>(),
    'load Cases Success': props<{ response: GetQuotationsResponse }>(),
    'load Cases Failure': props<{ errorMessage: string }>(),
    'update Cases Status': props<{
      gqIds: number[];
      status: QuotationStatus;
    }>(),
    'update Cases Status Success': props<{ gqIds: number[] }>(),
    'update Cases Status Failure': props<{ errorMessage: string }>(),
    'select Case': props<{ gqId: number }>(),
    'deselect Case': props<{ gqId: number }>(),
  },
});
