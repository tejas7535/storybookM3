import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const Rfq4ProcessActions = createActionGroup({
  source: 'RFQ4 Processes',
  events: {
    'find calculators': props<{ gqPositionId: string }>(),
    'find calculators success': props<{
      foundCalculators: string[];
    }>(),
    'find calculators error': props<{ gqPositionId: string; error: string }>(),
    'clear calculators': emptyProps(),

    'send recalculate sqv request': props<{
      gqPositionId: string;
      message: string;
    }>(),
    'send recalculate sqv request success': props<{
      gqPositionId: string;
      rfq4Status: Rfq4Status;
    }>(),
    'send recalculate sqv request error': props<{
      error: string;
    }>(),
  },
});
