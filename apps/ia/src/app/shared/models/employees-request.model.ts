import { MonthlyFluctuationOverTime } from '.';
import { FilterDimension } from './filter';

export class EmployeesRequest {
  public constructor(
    public filterDimension: FilterDimension,
    public value: string,
    public timeRange: string,
    public jobKey?: string,
    public type?: MonthlyFluctuationOverTime[],
    public reasonId?: number,
    public detailedReasonId?: number,
    public cluster?: string
  ) {}
}
