import { AuthConfig, AuthRoles } from './models/auth.models';

export enum RolePrefix {
  ProductLine = 'CDBA_PRODUCT_LINE',
  SubRegion = 'CDBA_SUB_REGION',
}

export const adminRoles: AuthRoles = ['CDBA_ADMIN'];

export const authConfig: AuthConfig = {
  basicRoles: ['CDBA_BASIC'],
  pricingRoles: [...adminRoles, 'CDBA_COST_TYPE_SQV', 'CDBA_COST_TYPE_GPC'],
};
