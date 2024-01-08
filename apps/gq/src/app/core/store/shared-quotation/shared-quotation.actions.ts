import { SharedQuotation } from '@gq/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SharedQuotationActions = createActionGroup({
  source: 'Shared Quotation',
  events: {
    'Get Shared Quotation': props<{ gqId: number }>(),
    'Get Shared Quotation Success': props<{
      sharedQuotation: SharedQuotation;
    }>(),
    'Get Shared Quotation Failure': props<{ errorMessage: string }>(),
    'Save Shared Quotation': props<{ gqId: number }>(),
    'Save Shared Quotation Success': props<{
      sharedQuotation: SharedQuotation;
    }>(),
    'Save Shared Quotation Failure': props<{ errorMessage: string }>(),
    'Delete Shared Quotation': props<{ id: string }>(),
    'Delete Shared Quotation Success': emptyProps(),
    'Delete Shared Quotation Failure': props<{ errorMessage: string }>(),
  },
});
