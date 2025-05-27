import { CreateCustomerCaseMaterialData } from '@gq/shared/services/rest/search/models/create-customer-case.model';

import { CreateCaseHeaderData } from './create-case-header-data.interface';

export interface CreateCustomerCase
  extends Omit<CreateCustomerCaseMaterialData, 'customer'> {
  headerInformation: CreateCaseHeaderData;
}
