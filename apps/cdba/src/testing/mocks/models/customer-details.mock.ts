import { CustomerDetails } from '@cdba/detail/detail-tab/customer/model/customer.details.model';

import { REFERENCE_TYPE_MOCK } from './reference-type.mock';

export const CUSTOMER_DETAILS_MOCK = new CustomerDetails(
  REFERENCE_TYPE_MOCK.customer,
  REFERENCE_TYPE_MOCK.customerGroup
);
