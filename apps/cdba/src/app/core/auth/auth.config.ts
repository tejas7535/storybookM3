import { AuthConfig, AuthRoles } from './models/auth.models';

export enum RolePrefix {
  ProductLine = 'CDBA_PL',
  SubRegion = 'CDBA_REGION',
}

export const adminRoles: AuthRoles = ['CDBA_ADMIN'];

export const authConfig: AuthConfig = {
  basicRoles: ['CDBA_BASIC'],
  pricingRoles: [
    ...adminRoles,
    'CDBA_FUNC_SALES_AUTOMOTIVE',
    'CDBA_FUNC_INDUSTRY_PRICING',
    'CDBA_FUNC_CALCULATION',
    'CDBA_FUNC_APPLICATION_ENGINEERING',
    'CDBA_FUNC_CONSTRUCTION',
    'CDBA_FUNC_PURCHASING',
  ],
};
