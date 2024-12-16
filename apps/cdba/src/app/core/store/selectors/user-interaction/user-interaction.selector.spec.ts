import { BomExportProgress } from '@cdba/user-interaction/model/feature/bom-export';

import {
  BomExportFeature,
  UserInteractionState,
} from '../../reducers/user-interaction/user-interaction.reducer';
import {
  getBomExportFeature,
  getBomExportFeatureStatus,
  isBomExportFeatureRunning,
} from './user-interaction.selector';

describe('User Interaction Selectors', () => {
  const initialState: UserInteractionState = {
    feature: {
      bomExport: {
        status: {
          progress: undefined,
        },
      } as BomExportFeature,
    },
  };

  describe('getBomExportFeature', () => {
    it('should return the bomExport feature state', () => {
      const result = getBomExportFeature.projector(initialState);
      expect(result).toEqual(initialState.feature.bomExport);
    });
  });

  describe('getBomExportFeatureStatus', () => {
    it('should return the status of the bomExport feature', () => {
      const result = getBomExportFeatureStatus.projector(
        initialState.feature.bomExport
      );
      expect(result).toEqual(initialState.feature.bomExport.status);
    });
  });

  describe('isBomExportFeatureRunning', () => {
    it('should return true if bomExport feature is running', () => {
      const runningState = {
        ...initialState,
        feature: {
          bomExport: {
            status: {
              progress: BomExportProgress.IN_PROGRESS_1,
            },
          } as BomExportFeature,
        },
      };
      const result = isBomExportFeatureRunning.projector(
        runningState.feature.bomExport
      );
      expect(result).toBe(true);
    });

    it('should return false if bomExport feature is finished', () => {
      const finishedState = {
        ...initialState,
        feature: {
          bomExport: {
            status: {
              progress: BomExportProgress.FINISHED,
            },
          } as BomExportFeature,
        },
      };
      const result = isBomExportFeatureRunning.projector(
        finishedState.feature.bomExport
      );
      expect(result).toBe(false);
    });

    it('should return false if bomExport feature has failed', () => {
      const failedState = {
        ...initialState,
        feature: {
          bomExport: {
            status: {
              progress: BomExportProgress.FAILED,
            },
          } as BomExportFeature,
        },
      };
      const result = isBomExportFeatureRunning.projector(
        failedState.feature.bomExport
      );
      expect(result).toBe(false);
    });

    it('should return false if bomExport feature status is undefined', () => {
      const undefinedStatusState = {
        ...initialState,
        feature: {
          bomExport: {
            status: undefined,
          } as BomExportFeature,
        },
      };
      const result = isBomExportFeatureRunning.projector(
        undefinedStatusState.feature.bomExport
      );
      expect(result).toBe(false);
    });
  });
});
