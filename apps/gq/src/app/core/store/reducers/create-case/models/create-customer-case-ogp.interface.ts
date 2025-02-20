import { CreateCustomerCase } from '@gq/shared/services/rest/search/models/create-customer-case.model';

import { CreateCaseHeaderData } from './create-case-header-data.interface';

export interface CreateCustomerCaseOgp
  extends Omit<CreateCustomerCase, 'customer'> {
  headerInformation: CreateCaseHeaderData;
}
