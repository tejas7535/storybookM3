import { createSelector } from '@ngrx/store';

import { LossOfSkillState, selectLossOfSkillState } from '..';
import {
  convertJobProfilesToLostJobProfiles,
  enrichLostJobProfilesWithOpenPositions,
} from './loss-of-skill.selector.utils';

const getJobProfilesState = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.jobProfiles
);

const getOpenPositionsState = createSelector(
  selectLossOfSkillState,
  (state: LossOfSkillState) => state.openPositions
);

const getJobProfilesData = createSelector(
  getJobProfilesState,
  (state) => state.data
);

const getOpenPositionsData = createSelector(
  getOpenPositionsState,
  (state) => state.data
);

const getJobProfilesLoading = createSelector(
  getJobProfilesState,
  (state) => state.loading
);

const getOpenPositionsLoading = createSelector(
  getOpenPositionsState,
  (state) => state.loading
);

export const getLostJobProfilesLoading = createSelector(
  getJobProfilesLoading,
  getOpenPositionsLoading,
  (jobProfilesLoading, openPositionsLoading) =>
    jobProfilesLoading || openPositionsLoading
);

export const getLostJobProfilesData = createSelector(
  getJobProfilesData,
  getOpenPositionsData,
  getOpenPositionsLoading,
  getJobProfilesLoading,
  (
    jobProfiles,
    openPositions,
    areOpenPositionsLoading,
    areJobProfilesLoading
  ) =>
    !areOpenPositionsLoading && !areJobProfilesLoading
      ? enrichLostJobProfilesWithOpenPositions(
          convertJobProfilesToLostJobProfiles(jobProfiles),
          openPositions
        )
      : undefined
);
