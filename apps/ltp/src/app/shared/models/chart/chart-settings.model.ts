import { Axis, Series } from '.';

export interface ChartSettings {
  sources: Series[];
  argumentAxis: Axis;
  valueAxis: Axis;
  customPointFn(): Object;
}
