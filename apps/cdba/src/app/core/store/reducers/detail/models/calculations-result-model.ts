import { Calculation } from '../../shared/models/calculation.model';

export class CalculationsResultModel {
  public constructor(public items: Calculation[]) {}
}
