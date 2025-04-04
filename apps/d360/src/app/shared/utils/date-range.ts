export enum DateRangePeriod {
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
}

export type DateRangePeriodType =
  | DateRangePeriod.Weekly
  | DateRangePeriod.Monthly;

export interface DateRange {
  from: Date;
  to: Date;
  period: DateRangePeriodType;
}
