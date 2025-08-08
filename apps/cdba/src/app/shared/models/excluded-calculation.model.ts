import { CostRoles } from '@cdba/core/auth/config/auth.config';

export interface ExcludedCalculations {
  count: number;
  missingCostRoles: [`${CostRoles}`];
  excludedPlants: string[];
}
