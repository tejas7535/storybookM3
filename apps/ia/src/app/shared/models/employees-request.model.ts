import { MonthlyFluctuationOverTime } from '.';
import { FilterDimension } from './filter';

export class EmployeesRequest {
  public constructor(
    public filterDimension: FilterDimension,
    public value: string,
    public timeRange: string,
    public positionDescription?: string,
    public type?: MonthlyFluctuationOverTime[]
  ) {}
}
