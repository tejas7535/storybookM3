import { AuthState } from '@schaeffler/azure-auth';

import { ACCOUNT_INFO_MOCK, PROFILE_IMAGE_MOCK } from '../models/auth.mock';

export const INITIAL_AUTH_STATE_MOCK: AuthState = {
  accountInfo: undefined,
  profileImage: {
    url: undefined,
    loading: false,
    errorMessage: undefined,
  },
};

export const AUTH_STATE_MOCK: AuthState = {
  accountInfo: ACCOUNT_INFO_MOCK,
  profileImage: PROFILE_IMAGE_MOCK,
};
