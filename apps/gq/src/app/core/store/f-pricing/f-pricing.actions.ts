import { FPricingData } from '@gq/shared/models/f-pricing';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

import { FPricingComparableMaterials } from '../reducers/transactions/models/f-pricing-comparable-materials.interface';

export const FPricingActions = createActionGroup({
  source: 'fPricing',
  events: {
    'Reset FPricing Data': emptyProps(),
    'Load FPricing Data': props<{ gqPositionId: string }>(),
    'Load FPricing Data Success': props<{ data: FPricingData }>(),
    'Load FPricing Data failure': props<{ error: Error }>(),

    'Load Comparable Transactions': props<{ gqPositionId: string }>(),
    'Load Comparable Transactions Success': props<{
      data: FPricingComparableMaterials[];
    }>(),
    'Load Comparable Transactions Failure': props<{ error: Error }>(),
  },
});
