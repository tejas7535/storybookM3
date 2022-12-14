import { FilterDimension } from '../../../shared/models';
import { DimensionFluctuationData } from '../../models/dimension-fluctuation-data.model';

export interface OrgChartData {
  dimension: FilterDimension;
  data: DimensionFluctuationData[];
}
