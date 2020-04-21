import { createAction, union } from '@ngrx/store';

export * from './tagging/tagging.actions';
export * from './translation/translation.actions';

export const resetAll = createAction('[All] Reset all');

const all = union({
  resetAll
});

export type AllActions = typeof all;
