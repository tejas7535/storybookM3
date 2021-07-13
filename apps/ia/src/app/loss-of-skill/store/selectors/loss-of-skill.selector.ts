import { createSelector } from '@ngrx/store';

import { LossOfSkillState, selectLossOfSkillState } from '..';

const getLostJobProfilesState = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.lostJobProfiles
);

export const getLostJobProfilesLoading = createSelector(
  getLostJobProfilesState,
  (state) => state.loading
);

export const getLostJobProfilesData = createSelector(
  getLostJobProfilesState,
  (state) => state.data
);
