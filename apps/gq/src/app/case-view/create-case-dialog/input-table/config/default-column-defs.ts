import { ColDef } from '@ag-grid-community/all-modules';

import { CaseTableItem } from '../../../../core/store/models';
import { isDummyData } from '../../../../core/store/reducers/create-case/config/dummy-row-data';

export const setStyle = (params: any): any => {
  const data: CaseTableItem = params.data;
  if (isDummyData(data)) {
    return { color: '#9ca2a5' };
  }

  return {};
};

export const DEFAULT_COLUMN_DEFS: ColDef = {
  cellStyle: setStyle,
  editable: false,
  flex: 1,
  resizable: true,
};
