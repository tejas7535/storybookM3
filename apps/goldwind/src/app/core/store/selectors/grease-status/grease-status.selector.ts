import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GREASE_GAUGE_SERIES } from '../../../../shared/chart/chart';
import { DATE_FORMAT, GREASE_CONTROLS } from '../../../../shared/constants';
import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import {
  GreaseControl,
  GreaseDisplay,
  GreaseSensor,
  GreaseStatus,
} from '../../reducers/grease-status/models';
import { GraphData, Interval } from '../../reducers/shared/models';

type GreaseDisplayKeys = keyof GreaseDisplay;
type DisplayOption = [GreaseDisplayKeys, boolean];

const isTempGauge = (formControl: string) =>
  formControl === 'temperatureOptics';

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
  (state: GreaseStatusState): GreaseStatus[] => state.result
);

export const getGreaseStatusLatestResult = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState): GreaseStatus => state.status.result
);

export const getGreaseTimeStamp = createSelector(
  getGreaseStatusLatestResult,
  (state: GreaseStatus) =>
    state &&
    new Date(state.timestamp).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    )
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
              greaseStatus.map((measurement: GreaseStatus) => {
                let measurementValue = (measurement as any)[
                  `gcm01${key.charAt(0).toUpperCase()}${key.slice(1)}`
                ];
                measurementValue = !isTempGauge(key)
                  ? Math.round(measurementValue * 100)
                  : measurementValue; // also probably temporary

                return {
                  value: [new Date(measurement.timestamp), measurementValue],
                };
              })) ||
            [],
        })),
    }
);

export const getGreaseStatusLatestGraphData = createSelector(
  getGreaseStatusLatestResult,
  (greaseStatus: any, { sensorName }: GreaseSensor): GraphData => {
    const gaugePositions = {
      temperatureOptics: ['25%', '50%'],
      waterContent: ['75%', '30%'],
      deterioration: ['75%', '75%'],
    };

    return (
      greaseStatus && {
        series: GREASE_CONTROLS.map(
          ({ label, formControl, unit }: GreaseControl) => {
            let value =
              greaseStatus[
                `${sensorName}${formControl
                  .charAt(0)
                  .toUpperCase()}${formControl.slice(1)}`
              ];
            value = !isTempGauge(formControl) ? Math.round(value * 100) : value; // also probably temporary

            return {
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
                  value,
                  name: translate(`greaseStatus.${label}`).toUpperCase(),
                },
              ],
              max: isTempGauge(formControl) ? 120 : 100,
              axisLabel: {
                ...GREASE_GAUGE_SERIES.axisLabel,
                show: isTempGauge(formControl),
              },
            };
          }
        ),
      }
    );
  }
);

export const getGreaseInterval = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState): Interval => state.interval
);
