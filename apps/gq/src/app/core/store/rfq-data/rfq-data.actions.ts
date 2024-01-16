import { RfqData } from '@gq/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const RfqDataActions = createActionGroup({
  source: 'Rfq Data',
  events: {
    'Get Rfq Data': props<{ sapId: string; quotationItemId: number }>(),
    'Get Rfq Data Success': props<{ item: RfqData }>(),
    'Get Rfq Data Failure': props<{ errorMessage: string }>(),

    'Reset Rfq Data': emptyProps(),
  },
});
