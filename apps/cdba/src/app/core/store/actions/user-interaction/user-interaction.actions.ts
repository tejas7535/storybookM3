import { createAction, props, union } from '@ngrx/store';

import { BomExportStatus } from '@cdba/user-interaction/model/feature/bom-export';
import { InteractionType } from '@cdba/user-interaction/model/interaction-type.enum';

export const showSnackBar = createAction(
  '[UserInteraction] Show Snack Bar',
  props<{ interactionType: InteractionType }>()
);

export const loadInitialBomExportStatus = createAction(
  '[UserInteraction] Load initial BOM Export status'
);

export const loadInitialBomExportStatusSuccess = createAction(
  '[UserInteraction] Load initial BOM Export status Success',
  props<{ status: BomExportStatus }>()
);

export const loadInitialBomExportStatusFailure = createAction(
  '[UserInteraction] Load initial BOM Export status Failure',
  props<{ errorMessage: string }>()
);

export const resetBomExportStatusTracking = createAction(
  '[UserInteraction] Reset tracking'
);

export const trackBomExportStatus = createAction(
  '[UserInteraction] Start tracking progress'
);

export const updateBomExportStatus = createAction(
  '[UserInteraction] Update progress',
  props<{ currentStatus: BomExportStatus }>()
);

export const trackBomExportStatusSuccess = createAction(
  '[UserInteraction] Stop tracking progress - Success'
);

export const trackBomExportStatusFailure = createAction(
  '[UserInteraction] Stop tracking progress - Failure',
  props<{ errorMessage: string }>()
);

const all = union({
  showSnackBar,
  resetBomExportStatusTracking,
  updateBomExportStatus,
  trackBomExportStatus,
  trackBomExportStatusSuccess,
  trackBomExportStatusFailure,
});
export type UserInteractionActions = typeof all;
