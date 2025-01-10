import { createSelector } from '@ngrx/store';

import { LossOfSkillState, selectLossOfSkillState } from '..';

const getJobProfilesState = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.jobProfiles
);

export const getJobProfilesLoading = createSelector(
  getJobProfilesState,
  (state) => state.loading
);

export const getJobProfilesData = createSelector(
  getJobProfilesState,
  (state) => state.data?.lostJobProfiles
);

export const getLossOfSkillWorkforceData = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.workforce.data
);

export const getLossOfSkillWorkforceLoading = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.workforce.loading
);

export const getLossOfSkillLeaversData = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.leavers.data
);

export const getLossOfSkillLeaversLoading = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.leavers.loading
);

export const getPmgmData = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.pmgm.data?.pmgmData
);

export const getHasUserEnoughRightsToPmgmData = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => !state.pmgm.data?.responseModified
);
