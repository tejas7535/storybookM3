import { createSelector } from '@ngrx/store';

import { getAuthState } from '../reducers/auth.reducer';

export const getAccountInfo = createSelector(
  getAuthState,
  (state) => state.accountInfo
);

export const getUsername = createSelector(
  getAuthState,
  (state) => state.accountInfo?.name
);

export const getIsLoggedIn = createSelector(
  getAuthState,
  (state) => state.accountInfo !== undefined
);

export const getRoles = createSelector(
  getAuthState,
  (state) => (state.accountInfo?.idTokenClaims as any)?.roles || []
);

export const getProfileImage = createSelector(
  getAuthState,
  (state) => state.profileImage.url
);
