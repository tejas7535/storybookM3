import { filter, map, pipe } from 'rxjs';

import { createSelector, select } from '@ngrx/store';

import { getAuthState } from '../reducers/auth.reducer';

export const getAccountInfo = createSelector(
  getAuthState,
  (state) => state.accountInfo
);

export const getUsername = createSelector(getAuthState, (state) =>
  state.accountInfo?.name?.replaceAll(/\s+/g, ' ')
);

export const getUserUniqueIdentifier = createSelector(
  getAuthState,
  (state) => state.accountInfo?.username?.split('@')[0]
);

export const getUserDepartment = createSelector(
  getAuthState,
  (state) => state.accountInfo?.department
);

export const getBackendRoles = createSelector(
  getAuthState,
  (state): string[] => state.accountInfo?.backendRoles || []
);

export const getAccessToken = createSelector(
  getAccountInfo,
  (accountInfo) => accountInfo?.accessToken
);

export const getProfileImage = createSelector(
  getAuthState,
  (state) => state.profileImage.url
);

export const getIsLoggedIn = createSelector(
  getAuthState,
  (state) => state.accountInfo !== undefined
);

const getIdTokenRoles = createSelector(
  getAuthState,
  (state): string[] => (state.accountInfo?.idTokenClaims as any)?.roles || []
);

const getLoginStateAndRoles = createSelector(
  getIsLoggedIn,
  getIdTokenRoles,
  (loggedIn, roles) => ({
    loggedIn,
    roles,
  })
);

export const getRoles = pipe(
  select(getLoginStateAndRoles),
  filter((combinedValue) => combinedValue.loggedIn),
  map((combinedValue) => combinedValue.roles)
);

export const hasIdTokenRole = (role: string) =>
  pipe(
    getRoles,
    map((idTokenRoles) => idTokenRoles?.includes(role))
  );

export const hasIdTokenRoles = (roles: string[]) =>
  pipe(
    getRoles,
    map((idTokenRoles) =>
      idTokenRoles && roles
        ? !roles.map((role) => idTokenRoles.includes(role)).includes(false)
        : false
    )
  );

export const hasAnyIdTokenRole = (roles: string[]) =>
  pipe(
    getRoles,
    map((idTokenRoles) =>
      idTokenRoles && roles
        ? roles.map((role) => idTokenRoles.includes(role)).includes(true)
        : false
    )
  );
