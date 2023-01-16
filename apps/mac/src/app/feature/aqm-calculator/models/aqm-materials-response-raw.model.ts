import { AQMCompositionLimits } from './aqm-composition-limits.model';
import { AQMSumLimits } from './aqm-sum-limits.model';

export interface AQMMaterialsResponseRaw {
  materials: {
    name: string;
    c: number;
    si: number;
    mn: number;
    cr: number;
    mo: number;
    ni: number;
  }[];
  sumLimits: AQMSumLimits;
  compositionLimits: AQMCompositionLimits;
}
