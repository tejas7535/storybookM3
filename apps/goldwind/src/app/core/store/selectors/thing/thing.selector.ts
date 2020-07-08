import { createSelector } from '@ngrx/store';

import { getThingState } from '../../reducers';
import { ThingState } from '../../reducers/thing/thing.reducer';

export const getThingLoading = createSelector(
  getThingState,
  (state: ThingState) => state.thing.loading
);

export const getThingThing = createSelector(
  getThingState,
  (state: ThingState) => state.thing.thing
);
