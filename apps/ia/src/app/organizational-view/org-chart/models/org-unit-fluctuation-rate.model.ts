import { OrgUnitFluctuationRateResponse } from './org-unit-fluctuation-rate-response.model';

export interface OrgUnitFluctuationRate extends OrgUnitFluctuationRateResponse {
  value: string;
  timeRange: string;
}
