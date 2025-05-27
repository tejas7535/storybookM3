import { EstimationMatrix } from './estimation-matrix.model';

export interface EstimationMatrixResponse {
  data: EstimationMatrix[];
  lastRow: number;
  totalRows: number;
  subTotalRows: number;
}
