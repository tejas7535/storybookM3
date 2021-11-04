export interface GWParams {
  start: number;
  end: number;
  aggregation?: IAGGREGATIONTYPE;
  timebucketSeconds?: number;
}
export enum IAGGREGATIONTYPE {
  AVG = 'AVG',
}
