import { MaterialQuantities } from '@gq/shared/models/table';

import { CreateCaseHeaderData } from './create-case-header-data.interface';

export interface CreateCaseOgp {
  headerInformation: CreateCaseHeaderData;
  materialQuantities: MaterialQuantities[];
}
