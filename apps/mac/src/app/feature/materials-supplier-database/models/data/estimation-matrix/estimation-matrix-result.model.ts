import { LoadSuccessParams } from 'ag-grid-community';

import { EstimationMatrix } from './estimation-matrix.model';

export interface EstimationMatrixResult extends LoadSuccessParams {
  rowData: EstimationMatrix[];
  rowCount: number;
}
