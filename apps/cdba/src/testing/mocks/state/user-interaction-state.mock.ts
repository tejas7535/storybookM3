import {
  BomExportFeature,
  UserInteractionState,
} from '@cdba/core/store/reducers/user-interaction/user-interaction.reducer';
import {
  BomExportProgress,
  BomExportStatus,
} from '@cdba/user-interaction/model/feature/bom-export';

export const USER_INTERACTION_STATE_MOCK = {
  userInteraction: {
    feature: {
      bomExport: {
        loading: false,
        errorMessage: undefined,
        status: {
          requestedBy: 'cdba@test.com',
          downloadUrl: 'http://example.com',
          downloadUrlExpiry: new Date(2024, 12, 12),
          progress: BomExportProgress.STARTED,
          started: '',
          stopped: '',
        } as BomExportStatus,
      } as BomExportFeature,
    },
  } as UserInteractionState,
};
