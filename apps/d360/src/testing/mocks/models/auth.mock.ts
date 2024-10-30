import { AccountInfo } from '@schaeffler/azure-auth';

export const ACCOUNT_INFO_MOCK: AccountInfo = {
  idTokenClaims: {
    roles: ['mock_role1'],
  },
  department: 'mock_department',
  homeAccountId: 'mock_id',
  environment: 'mock_environment',
  tenantId: 'mock_id',
  username: 'mock_name',
  localAccountId: 'mock_id',
  name: 'mock_name',
};

export const PROFILE_IMAGE_MOCK = {
  url: 'mock_url',
  loading: false,
  errorMessage: 'mock_message',
};
