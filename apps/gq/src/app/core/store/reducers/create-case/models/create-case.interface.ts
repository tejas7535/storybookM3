import { MaterialQuantities } from '@gq/shared/models/table';

import { CreateCaseHeaderData } from './create-case-header-data.interface';

export interface CreateCase {
  headerInformation: CreateCaseHeaderData;
  materialQuantities: MaterialQuantities[];
}
