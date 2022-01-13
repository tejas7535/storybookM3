import { LoadSense } from '../../store/reducers/load-sense/models';
import { LoadDistribution } from '../../store/selectors/load-distribution/load-distribution.interface';

export interface LoadDistributionEntity {
  timestamp: string;
  lsps: LoadSense;
  row1: LoadDistribution;
  row2: LoadDistribution;
}
