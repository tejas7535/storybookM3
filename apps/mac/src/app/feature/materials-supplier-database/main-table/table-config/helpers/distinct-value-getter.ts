import { SetFilterValuesFuncParams } from 'ag-grid-community';

import { MsdDataService } from '../../../services';

export const DISTINCT_VALUE_GETTER = (params: SetFilterValuesFuncParams) => {
  const column = params.column.getColId();
  const service: MsdDataService = params.context['dataService'];
  service
    .getDistinctSapValues(column)
    .subscribe((values) => params.success(values));
};
