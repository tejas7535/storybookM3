import { RecalculationReasons } from './recalculation-reasons.enum';

export interface SqvCheck {
  status: RecalculationReasons;
  value?: number;
}
