import { QuotationStatus } from '@gq/shared/models/quotation/quotation-status.enum';
import { GetQuotationsCountResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-count-response.interface';
import { GetQuotationsResponse } from '@gq/shared/services/rest/quotation/models/get-quotations-response.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { QuotationTab } from './models/quotation-tab.enum';

export const OverviewCasesActions = createActionGroup({
  source: 'OverviewCases',
  events: {
    'load Cases for View': props<{ viewId: number }>(),
    'load Cases': props<{ tab: QuotationTab }>(),
    'load Cases Success': props<{
      response: GetQuotationsResponse;
    }>(),
    'load Cases Failure': props<{ errorMessage: string }>(),
    'update Cases Status': props<{
      gqIds: number[];
      status: QuotationStatus;
    }>(),
    'update Cases Status Success': props<{ gqIds: number[] }>(),
    'update Cases Status Failure': props<{ errorMessage: string }>(),
    'select Case': props<{ gqId: number }>(),
    'deselect Case': props<{ gqId: number }>(),
    'get Cases count': emptyProps(),
    'get Cases count Success': props<{
      response: GetQuotationsCountResponse;
    }>(),
    'get Cases count Failure': props<{ errorMessage: string }>(),
  },
});
