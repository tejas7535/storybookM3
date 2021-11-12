import { AccountInfo } from '@schaeffler/azure-auth';

export const ACCOUNT_INFO_MOCK: AccountInfo = {
  idTokenClaims: {
    roles: [
      'CDBA_BASIC',
      'CDBA_COST_TYPE_SQV',
      'CDBA_PRODUCT_LINE_03',
      'CDBA_SUB_REGION_21',
    ],
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
