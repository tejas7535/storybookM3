import { createAction, props } from '@ngrx/store';

export const loginImplicitFlow = createAction(
  '[Auth] Login with implicit flow'
);

export const login = createAction('[Auth] Login');
export const loginSuccess = createAction(
  '[Auth] Login successful',
  props<{ user: any }>()
);

export const logout = createAction('[Auth] Logout');
