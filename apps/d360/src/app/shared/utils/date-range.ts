export type DateRangePeriod = 'WEEKLY' | 'MONTHLY';

export interface DateRange {
  from: Date;
  to: Date;
  period: DateRangePeriod;
}
