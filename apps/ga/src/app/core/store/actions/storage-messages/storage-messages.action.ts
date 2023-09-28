import { createAction, props } from '@ngrx/store';

import { MaintenanceMessage } from '@ga/shared/models/maintenance-message/maintenance-message';

export const getStorageMessage = createAction(
  '[Storage Messages] get storage messages'
);

export const setStorageMessage = createAction(
  '[Storage Messages] Set storage messages',
  props<{
    message: MaintenanceMessage;
  }>()
);
