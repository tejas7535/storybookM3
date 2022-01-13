import { Interval } from '../../core/store/reducers/shared/models';

export interface ChartState<T> {
  display: T;
  interval: Interval;
  result?: any;
}
