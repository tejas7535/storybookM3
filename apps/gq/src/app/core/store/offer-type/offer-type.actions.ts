import { OfferType } from '@gq/shared/models/offer-type.interface';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const OfferTypeActions = createActionGroup({
  source: 'Offer Type',
  events: {
    'get all offer types': emptyProps(),
    'get all offer types success': props<{
      offerTypes: OfferType[];
    }>(),
    'get all offer types failure': props<{ errorMessage: string }>(),
  },
});
