import { SalesOrganizationDetail } from '@cdba/shared/models/reference-type.model';

export const SALES_ORGANIZATION_DETAILS_MOCK: SalesOrganizationDetail[] = [
  {
    salesOrganizationDescription: 'SALES ORGANIZATION DESCR 1',
    salesOrganizations: ['0123', '4567', '8901'],
  } as SalesOrganizationDetail,
  {
    salesOrganizationDescription: 'SALES ORGANIZATION DESCR 2',
    salesOrganizations: ['2345', '6789', '0123'],
  } as SalesOrganizationDetail,
];
