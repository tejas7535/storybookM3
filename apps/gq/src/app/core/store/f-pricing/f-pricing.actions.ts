import { FPricingData } from '@gq/shared/models/f-pricing';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const FPricingActions = createActionGroup({
  source: 'fPricing',
  events: {
    'Reset FPricing Data': emptyProps(),
    'Load FPricing Data': props<{ gqPositionId: string }>(),
    'Load FPricing Data Success': props<{ data: FPricingData }>(),
    'Load FPricing Data failure': props<{ error: Error }>(),
  },
});
