import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';

import { SystemMessage } from './system-message.model';

export const selectSystemMessageId = (sm: SystemMessage): number => sm.id;

export const systemMessageAdapter: EntityAdapter<SystemMessage> =
  createEntityAdapter<SystemMessage>({
    selectId: selectSystemMessageId,
  });
