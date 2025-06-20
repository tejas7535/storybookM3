import { RecalculateSqvStatus } from './recalculate-sqv-status.enum';

export interface ClaimCalculationResponse {
  assignee: string;
  processVariables: {
    recalculationStatus: RecalculateSqvStatus;
  };
}
