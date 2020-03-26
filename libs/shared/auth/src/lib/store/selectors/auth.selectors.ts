import { createSelector } from '@ngrx/store';

import { getAuthState } from '../reducers/auth.reducer';

export const getUser = createSelector(getAuthState, state => state.user);

export const getUsername = createSelector(getUser, user => user?.username);

export const getIsLoggedIn = createSelector(
  getAuthState,
  state => state.loggedIn
);
