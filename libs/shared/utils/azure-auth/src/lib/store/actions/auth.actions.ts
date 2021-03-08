import { AccountInfo } from '@azure/msal-browser';
import { createAction, props } from '@ngrx/store';

export const login = createAction('[Azure Auth] Login');
export const loginSuccess = createAction(
  '[Azure Auth] Login successful',
  props<{ accountInfo: AccountInfo }>()
);

export const logout = createAction('[Azure Auth] Logout');

export const loadProfileImage = createAction('[Azure Auth] Load Profile Image');
export const loadProfileImageSuccess = createAction(
  '[Azure Auth] Load Profile Image Success',
  props<{ url: string }>()
);
export const loadProfileImageFailure = createAction(
  '[Azure Auth] Load Profile Image Failure',
  props<{ errorMessage: string }>()
);
