import { BomExportStatus } from '@cdba/user-interaction/model/feature/bom-export';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';

import {
  loadInitialBomExportStatus,
  loadInitialBomExportStatusFailure,
  loadInitialBomExportStatusSuccess,
  resetBomExportStatusTracking,
  showSnackBar,
  trackBomExportStatus,
  trackBomExportStatusCompleted,
  trackBomExportStatusFailure,
  updateBomExportStatus,
} from './user-interaction.actions';

describe('UserInteraction Actions', () => {
  it('should create showSnackBar action', () => {
    const interactionType = {} as InteractionType;
    const action = showSnackBar({ interactionType });
    expect(action.type).toBe('[UserInteraction] Show Snack Bar');
    expect(action.interactionType).toEqual(interactionType);
  });

  it('should create loadInitialBomExportStatus action', () => {
    const action = loadInitialBomExportStatus();
    expect(action.type).toBe(
      '[UserInteraction] Load initial BOM Export status'
    );
  });

  it('should create loadInitialBomExportStatusSuccess action', () => {
    const status = {} as BomExportStatus;
    const action = loadInitialBomExportStatusSuccess({ status });
    expect(action.type).toBe(
      '[UserInteraction] Load initial BOM Export status Success'
    );
    expect(action.status).toEqual(status);
  });

  it('should create loadInitialBomExportStatusFailure action', () => {
    const errorMessage = 'Error loading status';
    const action = loadInitialBomExportStatusFailure({ errorMessage });
    expect(action.type).toBe(
      '[UserInteraction] Load initial BOM Export status Failure'
    );
    expect(action.errorMessage).toEqual(errorMessage);
  });

  it('should create resetBomExportStatusTracking action', () => {
    const action = resetBomExportStatusTracking();
    expect(action.type).toBe('[UserInteraction] Reset tracking');
  });

  it('should create trackBomExportStatus action', () => {
    const action = trackBomExportStatus();
    expect(action.type).toBe('[UserInteraction] Start tracking progress');
  });

  it('should create upateBomExportStatus action', () => {
    const currentStatus = {} as BomExportStatus;
    const action = updateBomExportStatus({ currentStatus });
    expect(action.type).toBe('[UserInteraction] Update progress');
    expect(action.currentStatus).toEqual(currentStatus);
  });

  it('should create trackBomExportStatusCompleted action', () => {
    const action = trackBomExportStatusCompleted();
    expect(action.type).toBe(
      '[UserInteraction] Stop tracking progress - Completed'
    );
  });

  it('should create trackBomExportStatusFailure action', () => {
    const errorMessage = 'Error tracking status';
    const action = trackBomExportStatusFailure({ errorMessage });
    expect(action.type).toBe(
      '[UserInteraction] Stop tracking progress - Failure'
    );
    expect(action.errorMessage).toEqual(errorMessage);
  });
});
