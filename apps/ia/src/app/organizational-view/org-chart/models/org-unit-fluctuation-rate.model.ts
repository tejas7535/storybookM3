import { OrgUnitFluctuationRateResponse } from './org-unit-fluctuation-rate-response.model';

export interface OrgUnitFluctuationRate extends OrgUnitFluctuationRateResponse {
  orgUnitKey: string;
  timeRange: string;
}
