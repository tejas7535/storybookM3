import { CustomerDetails } from '@cdba/shared/models';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const CUSTOMER_DETAILS_MOCK = new CustomerDetails(
  REFERENCE_TYPE_MOCK.customers,
  REFERENCE_TYPE_MOCK.customerGroups
);
