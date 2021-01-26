import { createSelector } from '@ngrx/store';

import { LossOfSkillsState, selectLossOfSkillsState } from '..';

const getLostJobProfilesState = createSelector(
  selectLossOfSkillsState,
  (state: LossOfSkillsState) => state.lostJobProfiles
);

export const getLostJobProfilesLoading = createSelector(
  getLostJobProfilesState,
  (state) => state.loading
);

export const getLostJobProfilesData = createSelector(
  getLostJobProfilesState,
  (state) => state.data
);
