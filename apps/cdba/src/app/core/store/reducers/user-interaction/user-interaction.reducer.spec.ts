import {
  BomExportProgress,
  BomExportStatus,
} from '@cdba/user-interaction/model/feature/bom-export';

import {
  loadInitialBomExportStatus,
  loadInitialBomExportStatusFailure,
  loadInitialBomExportStatusSuccess,
  trackBomExportStatus,
  trackBomExportStatusCompleted,
  trackBomExportStatusFailure,
  updateBomExportStatus,
} from '../../actions';
import {
  initialState,
  userInteractionReducer,
} from './user-interaction.reducer';

describe('UserInteractionReducer', () => {
  it('should set loading to true on loadInitialBomExportStatus', () => {
    const action = loadInitialBomExportStatus();
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.loading).toBe(true);
  });

  it('should set loading to false and update status on loadInitialBomExportStatusSuccess', () => {
    const status = { progress: BomExportProgress.FINISHED } as BomExportStatus;
    const action = loadInitialBomExportStatusSuccess({ status });
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.loading).toBe(false);
    expect(state.feature.bomExport.status).toEqual(status);
  });

  it('should set loading to false and update errorMessage on loadInitialBomExportStatusFailure', () => {
    const errorMessage = 'Error loading status';
    const action = loadInitialBomExportStatusFailure({ errorMessage });
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.loading).toBe(false);
    expect(state.feature.bomExport.errorMessage).toBe(errorMessage);
  });

  it('should update status on upateBomExportStatus', () => {
    const currentStatus = {
      progress: BomExportProgress.IN_PROGRESS_1,
    } as BomExportStatus;
    const action = updateBomExportStatus({ currentStatus });
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.status).toEqual(currentStatus);
  });

  it('should set loading to false and update status progress to STARTED on trackBomExportStatus', () => {
    const action = trackBomExportStatus();
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.loading).toBe(false);
    expect(state.feature.bomExport.status.progress).toBe(
      BomExportProgress.STARTED
    );
  });

  it('should set loading to false on trackBomExportStatusSuccess', () => {
    const action = trackBomExportStatusCompleted();
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.loading).toBe(false);
  });

  it('should set loading to false, update errorMessage and status progress to FAILED on trackBomExportStatusFailure', () => {
    const errorMessage = 'Error tracking status';
    const action = trackBomExportStatusFailure({ errorMessage });
    const state = userInteractionReducer(initialState, action);

    expect(state.feature.bomExport.loading).toBe(false);
    expect(state.feature.bomExport.errorMessage).toBe(errorMessage);
    expect(state.feature.bomExport.status.progress).toBe(
      BomExportProgress.FAILED
    );
  });
});
