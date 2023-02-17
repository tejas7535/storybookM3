import { BearingData } from './bearing-data';
import { LoadCaseData } from './load-case-data';

export interface CalculationParameters {
  bearingData: BearingData;
  loadcaseData: LoadCaseData[];
}
