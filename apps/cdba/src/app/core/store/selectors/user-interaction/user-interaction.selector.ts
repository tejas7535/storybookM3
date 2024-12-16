import { createSelector } from '@ngrx/store';

import { BomExportProgress } from '../../../../user-interaction/model/feature/bom-export';
import { getUserInteractionState } from '../../reducers';
import {
  BomExportFeature,
  UserInteractionState,
} from '../../reducers/user-interaction/user-interaction.reducer';

export const getBomExportFeature = createSelector(
  getUserInteractionState,
  (state: UserInteractionState) => state.feature.bomExport
);

export const getBomExportFeatureStatus = createSelector(
  getBomExportFeature,
  (feature: BomExportFeature) => feature.status
);

export const isBomExportFeatureRunning = createSelector(
  getBomExportFeature,
  (feature: BomExportFeature) => {
    if (feature.status) {
      return (
        feature.status.progress !== BomExportProgress.FINISHED &&
        feature.status.progress !== BomExportProgress.FAILED
      );
    }

    return false;
  }
);
