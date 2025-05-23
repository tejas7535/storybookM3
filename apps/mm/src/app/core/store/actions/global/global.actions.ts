import { MMSeparator } from '@mm/core/services';
import { AppDelivery } from '@mm/shared/models';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GlobalActions = createActionGroup({
  source: 'Global',
  events: {
    'Init Global': props<{
      isStandalone?: boolean;
      bearingId?: string;
      separator?: MMSeparator;
      language?: string;
    }>(),
    'Set Is Initialized': emptyProps(),
    'Set Is Standalone': props<{ isStandalone: boolean }>(),
    'Set App Delivery': props<{ appDelivery: `${AppDelivery}` }>(),
    'Determine Internal User': emptyProps(),
    'Set Is Internal User': props<{ isInternalUser: boolean }>(),
  },
});
