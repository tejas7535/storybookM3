import { FilterDimension } from '../../../shared/models';
import { DimensionFluctuationData } from '../../models/dimension-fluctuation-data.model';
import { OrgChartTranslation } from './org-chart-translation.model';

export interface OrgChartData {
  dimension: FilterDimension;
  data: DimensionFluctuationData[];
  translation: OrgChartTranslation;
}
