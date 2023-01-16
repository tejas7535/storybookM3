import { AQMLimit } from './aqm-limit.model';

export interface AQMCompositionLimits {
  c: AQMLimit;
  si: AQMLimit;
  mn: AQMLimit;
  cr: AQMLimit;
  mo: AQMLimit;
  ni: AQMLimit;
}
