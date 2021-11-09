import {
  RoleDescription,
  RoleDescriptions,
} from '@cdba/core/auth/models/roles.models';

export const PRODUCT_LINE_ROLE_DESCRIPTION_MOCK: RoleDescription = {
  id: '03',
  title: 'CDBA_PRODUCT_LINE_03',
  description: 'Component Valve Trains',
};

export const SUB_REGION_ROLE_DESCRIPTION_MOCK: RoleDescription = {
  id: '21',
  title: 'CDBA_SUB_REGION_21',
  description: 'Germany',
};

export const ROLE_DESCRIPTIONS_MOCK: RoleDescriptions = {
  productLines: [PRODUCT_LINE_ROLE_DESCRIPTION_MOCK],
  subRegions: [SUB_REGION_ROLE_DESCRIPTION_MOCK],
};
