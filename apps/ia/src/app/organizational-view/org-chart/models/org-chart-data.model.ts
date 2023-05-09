import { FilterDimension } from '../../../shared/models';
import { DimensionFluctuationData } from '../../models';
import { OrgChartTranslation } from './org-chart-translation.model';

export interface OrgChartData {
  dimension: FilterDimension;
  data: DimensionFluctuationData[];
  translation: OrgChartTranslation;
}
