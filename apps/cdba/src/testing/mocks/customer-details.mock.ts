import { CustomerDetailsModel } from '../../app/detail/customer/model/customer.details.model';
import { REFRENCE_TYPE_MOCK } from './reference-type.mock';

export const CUSTOMER_DETAILS_MOCK = new CustomerDetailsModel(
  REFRENCE_TYPE_MOCK.customer,
  REFRENCE_TYPE_MOCK.customerGroup
);
