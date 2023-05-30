import { SalesDetails } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const SALES_DETAILS_MOCK: SalesDetails = new SalesDetails(
  REFERENCE_TYPE_MOCK.materialNumber,
  REFERENCE_TYPE_MOCK.materialDesignation,
  REFERENCE_TYPE_MOCK.materialShortDescription,
  REFERENCE_TYPE_MOCK.productLine,
  REFERENCE_TYPE_MOCK.pcmCalculations[0].rfq,
  REFERENCE_TYPE_MOCK.salesOrganizations,
  REFERENCE_TYPE_MOCK.salesOrganizationsDescriptions,
  REFERENCE_TYPE_MOCK.pcmCalculations[0].projectName,
  REFERENCE_TYPE_MOCK.productDescription,
  REFERENCE_TYPE_MOCK.materialClass,
  REFERENCE_TYPE_MOCK.materialClassDescription
);
