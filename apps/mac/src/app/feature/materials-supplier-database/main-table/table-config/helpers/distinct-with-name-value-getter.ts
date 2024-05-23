import { SetFilterValuesFuncParams } from 'ag-grid-community';

import { SapValueWithText } from '@mac/feature/materials-supplier-database/models';

import { MsdDataService } from '../../../services';

export const DISTINCT_WITH_NAME_VALUE_GETTER_FACTORY =
  (textColumn: string) =>
  (params: SetFilterValuesFuncParams<any, SapValueWithText>) => {
    const column = params.column.getColId();
    const service: MsdDataService = params.context['dataService'];
    service
      .getDistinctSapValuesWithText(column, textColumn)
      .subscribe((values) => params.success(values as SapValueWithText[]));
  };
