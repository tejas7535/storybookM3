import { QuotationToDate } from '@gq/core/store/quotation-to-date/quotation-to-date.model';
import { CustomerId } from '@gq/shared/models';
import { createActionGroup, props } from '@ngrx/store';

export const QuotationToDateActions = createActionGroup({
  source: 'Quotation To Date',
  events: {
    'get quotation to date': props<{ customerId: CustomerId }>(),
    'get quotation to date success': props<{
      quotationToDate: QuotationToDate;
    }>(),
    'get quotation to date failure': props<{ errorMessage: string }>(),
  },
});
