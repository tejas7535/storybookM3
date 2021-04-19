import { Calculation } from '@cdba/shared/models';

export class CalculationsResult {
  public constructor(public items: Calculation[]) {}
}
