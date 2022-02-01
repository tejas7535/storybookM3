import { CostRoles } from '@cdba/core/auth/auth.config';

export interface ExcludedCalculations {
  count: number;
  missingCostRoles: [`${CostRoles}`];
  excludedPlants: string[];
}
