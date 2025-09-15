import { MMSeparator } from '@mm/core/services';
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const GlobalActions = createActionGroup({
  source: 'Global',
  events: {
    'Init Global': props<{
      bearingId?: string;
      separator?: MMSeparator;
    }>(),
    'Set Is Initialized': emptyProps(),
    'Determine Internal User': emptyProps(),
    'Set Is Internal User': props<{ isInternalUser: boolean }>(),
  },
});
