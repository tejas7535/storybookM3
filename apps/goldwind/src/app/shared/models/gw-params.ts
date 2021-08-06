export interface GWParams {
  endDate: number;
  startDate: number;
  aggregation?: IAGGREGATIONTYPE;
  timebucketSeconds?: number;
}
export enum IAGGREGATIONTYPE {
  AVG = 'AVG',
}
