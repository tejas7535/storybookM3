import { createSelector } from '@ngrx/store';

import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import {
  GreaseDisplay,
  GreaseStatusGraphData,
  GreaseStatusMeasurement,
} from '../../reducers/grease-status/models';
import { Interval } from '../../reducers/shared/models';

type GreaseDisplayKeys = keyof GreaseDisplay;
type DisplayOption = [GreaseDisplayKeys, boolean];

export const getGreaseSensorId = createSelector(
  getGreaseStatusState,
  () => '887bffbe-2e87-49f0-b763-ba235dd7c876'
);

export const getGreaseStatusLoading = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.loading
);

export const getGreaseStatusResult = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.result
);

export const getGreaseDisplay = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.display
);

export const getGreaseStatusGraphData = createSelector(
  getGreaseStatusResult,
  getGreaseDisplay,
  (greaseStatus: any, display: GreaseDisplay): GreaseStatusGraphData =>
    greaseStatus && {
      legend: {
        data: Object.entries(display)
          .map(([key, value]) => [key, value] as DisplayOption)
          .filter(([_key, value]: DisplayOption) => value)
          .map(([key, _value]: DisplayOption) => key),
      },
      series: Object.entries(display)
        .map(([key, value]) => [key, value] as DisplayOption)
        .map(([key, value]: DisplayOption) => ({
          name: key,
          type: 'line',
          data:
            (value &&
              greaseStatus.map((measurement: GreaseStatusMeasurement) => ({
                value: [
                  new Date(measurement.startDate),
                  (measurement as any)[key],
                ],
              }))) ||
            [],
        })),
    }
);

export const getGreaseInterval = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState): Interval => state.interval
);
