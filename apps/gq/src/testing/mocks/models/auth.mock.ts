import { AccountInfo } from '@schaeffler/azure-auth';

import { UserRoles } from '../../../app/shared/constants';

export const ACCOUNT_INFO_MOCK: AccountInfo = {
  idTokenClaims: {
    roles: [
      UserRoles.BASIC,
      UserRoles.COST_GPC,
      UserRoles.COST_SQV,
      UserRoles.REGION_WORLD,
      UserRoles.SECTOR_ALL,
      UserRoles.MANUAL_PRICE,
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
