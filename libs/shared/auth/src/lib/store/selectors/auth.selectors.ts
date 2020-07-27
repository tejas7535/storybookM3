import { createSelector } from '@ngrx/store';

import { getAuthState } from '../reducers/auth.reducer';

export const getUser = createSelector(getAuthState, (state) => state.user);

export const getUsername = createSelector(getUser, (user) => user?.username);

export const getIsLoggedIn = createSelector(
  getAuthState,
  (state) => state.loggedIn
);

export const getToken = createSelector(getAuthState, (state) => state.token);

export const getAccessToken = createSelector(
  getAuthState,
  (state) => state.accessToken
);

export const getClaim = (claim: string) =>
  createSelector(getToken, (token) => {
    if (!token) {
      return undefined;
    }
    const entry = Object.entries(token).find((e) => e[0] === claim);

    return entry ? entry[1] : undefined;
  });

export const getRoles = createSelector(getClaim('roles'), (roles) =>
  roles ? roles : []
);
