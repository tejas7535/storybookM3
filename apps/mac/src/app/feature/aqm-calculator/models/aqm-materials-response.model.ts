import { AQMCompositionLimits } from './aqm-composition-limits.model';
import { AQMMaterial } from './aqm-material.model';
import { AQMSumLimits } from './aqm-sum-limits.model';

export interface AQMMaterialsResponse {
  materials: AQMMaterial[];
  sumLimits: AQMSumLimits;
  compositionLimits: AQMCompositionLimits;
}
