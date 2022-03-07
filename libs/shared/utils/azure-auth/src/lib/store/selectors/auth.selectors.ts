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

export const getUserUniqueIdentifier = createSelector(
  getAuthState,
  (state) => state.accountInfo?.username?.split('@')[0]
);

export const getUserDepartment = createSelector(
  getAuthState,
  (state) => state.accountInfo?.department
);

export const getIsLoggedIn = createSelector(
  getAuthState,
  (state) => state.accountInfo !== undefined
);

export const getRoles = createSelector(
  getAuthState,
  (state): string[] => (state.accountInfo?.idTokenClaims as any)?.roles || []
);

export const getBackendRoles = createSelector(
  getAuthState,
  (state): string[] => state.accountInfo?.backendRoles || []
);

export const hasIdTokenRole = (role: string) =>
  createSelector(getRoles, (idTokenRoles): boolean =>
    idTokenRoles?.includes(role)
  );

export const hasIdTokenRoles = (roles: string[]) =>
  createSelector(getRoles, (idTokenRoles): boolean =>
    idTokenRoles && roles
      ? !roles.map((role) => idTokenRoles.includes(role)).includes(false)
      : false
  );

export const hasAnyIdTokenRole = (roles: string[]) =>
  createSelector(getRoles, (idTokenRoles): boolean =>
    idTokenRoles && roles
      ? roles.map((role) => idTokenRoles.includes(role)).includes(true)
      : false
  );

export const getProfileImage = createSelector(
  getAuthState,
  (state) => state.profileImage.url
);
