import { createAction, props } from '@ngrx/store';

export const login = createAction('[User] Login');
export const loginSuccess = createAction(
  '[User] Login success',
  props<{ user: any }>()
);
