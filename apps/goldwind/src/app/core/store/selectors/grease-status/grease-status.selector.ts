import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GREASE_GAUGE_SERIES } from '../../../../shared/chart/chart';
import { GREASE_CONTROLS } from '../../../../shared/constants';
import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import {
  GreaseControl,
  GreaseDisplay,
  GreaseStatusMeasurement,
} from '../../reducers/grease-status/models';
import { GraphData, Interval } from '../../reducers/shared/models';

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

export const getGreaseStatusLatestLoading = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.status.loading
);

export const getGreaseStatusResult = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.result
);

export const getGreaseStatusLatestResult = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.status.result
);

export const getGreaseDisplay = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState) => state.display
);

export const getGreaseStatusGraphData = createSelector(
  getGreaseStatusResult,
  getGreaseDisplay,
  (greaseStatus: any, display: GreaseDisplay): GraphData =>
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

export const getGreaseStatusLatestGraphData = createSelector(
  getGreaseStatusLatestResult,
  (greaseStatus: any): GraphData => {
    const gaugePositions = {
      temperatureCelsius: ['25%', '50%'],
      waterContentPercent: ['75%', '30%'],
      deteriorationPercent: ['75%', '75%'],
    };
    const isTempGauge = (formControl: string) =>
      formControl === 'temperatureCelsius';

    return (
      greaseStatus && {
        series: GREASE_CONTROLS.map(
          ({ label, formControl, unit }: GreaseControl) => ({
            ...GREASE_GAUGE_SERIES,
            name: label,
            radius: isTempGauge(formControl) ? '50%' : '33%',
            center: (gaugePositions as any)[formControl],
            detail: {
              ...GREASE_GAUGE_SERIES.detail,
              formatter: `{value} ${unit}`,
            },
            data: [
              {
                value: greaseStatus[formControl],
                name: translate(`greaseStatus.${label}`).toUpperCase(),
              },
            ],
            max: isTempGauge(formControl) ? 120 : 100,
            axisLabel: {
              ...GREASE_GAUGE_SERIES.axisLabel,
              show: isTempGauge(formControl),
            },
          })
        ),
      }
    );
  }
);

export const getGreaseInterval = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState): Interval => state.interval
);
