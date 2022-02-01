import { Calculation, ExcludedCalculations } from '@cdba/shared/models';

export class CalculationsResponse {
  public constructor(
    public items: Calculation[],
    public excludedItems: ExcludedCalculations
  ) {}
}
