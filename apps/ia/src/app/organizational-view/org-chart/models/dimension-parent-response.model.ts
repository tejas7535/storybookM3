import { FilterDimension, IdValue } from '../../../shared/models';

export interface DimensionParentResponse {
  filterDimension: FilterDimension;
  data: IdValue;
}
