import { AuthConfig, AuthRoles } from './models/auth.models';

export enum RolePrefix {
  ProductLine = 'CDBA_PRODUCT_LINE',
  SubRegion = 'CDBA_SUB_REGION',
}

export const adminRoles: AuthRoles = ['CDBA_ADMIN'];

export enum CostRoles {
  Gpc = 'CDBA_COST_TYPE_GPC',
  Sqv = 'CDBA_COST_TYPE_SQV',
}

export const authConfig: AuthConfig = {
  basicRoles: ['CDBA_BASIC'],
  pricingRoles: [...adminRoles, CostRoles.Sqv, CostRoles.Gpc],
  betaUserRole: 'CDBA_BETA_USER',
};
