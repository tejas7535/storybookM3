import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GREASE_GAUGE_SERIES } from '../../../../shared/chart/chart';
import { DATE_FORMAT, GREASE_DASHBOARD } from '../../../../shared/constants';
import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import {
  GcmProcessed,
  GcmStatus,
  GreaseControl,
  GreaseDisplay,
  GreaseSensor,
} from '../../reducers/grease-status/models';
import { ShaftStatus } from '../../reducers/shaft/models';
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
  (state: GreaseStatusState): GcmStatus => state.result
);

export const getGreaseStatusLatestResult = createSelector(
  getGreaseStatusState,
  (state: GreaseStatusState): GcmProcessed => state.status.result
);

export const getGreaseTimeStamp = createSelector(
  getGreaseStatusLatestResult,
  (state: GcmProcessed) =>
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
  (gcmStatus: any, display: GreaseDisplay): GraphData =>
    gcmStatus && {
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
              (key === 'rsmShaftSpeed'
                ? gcmStatus.RsmShafts.map((measurement: ShaftStatus) => ({
                    value: [
                      new Date(measurement.timestamp),
                      measurement.rsm01ShaftSpeed.toFixed(2),
                    ],
                  }))
                : gcmStatus.GcmProcessed.map((measurement: GcmProcessed) => {
                    let measurementValue: number;
                    if (key.endsWith('_1')) {
                      measurementValue = (measurement as any)[
                        `gcm01${key.charAt(0).toUpperCase()}${key.slice(1, -2)}`
                      ];
                    } else if (key.endsWith('_2')) {
                      measurementValue = (measurement as any)[
                        `gcm02${key.charAt(0).toUpperCase()}${key.slice(1, -2)}`
                      ];
                    }

                    if (measurementValue) {
                      return {
                        value: [
                          new Date(measurement.timestamp),
                          measurementValue.toFixed(2),
                        ],
                      };
                    }

                    return { value: [] };
                  }))) ||
            [],
        })),
    }
);

export const getGreaseStatusLatestGraphData = createSelector(
  getGreaseStatusLatestResult,
  (gcmProcessed: GcmProcessed, { sensorName }: GreaseSensor): GraphData => {
    const gaugePositions = {
      temperatureOptics: ['25%', '50%'],
      waterContent: ['75%', '30%'],
      deterioration: ['75%', '75%'],
    };

    return (
      gcmProcessed && {
        series: GREASE_DASHBOARD.map(
          ({ label, formControl, unit }: GreaseControl) => {
            const property = `${sensorName}${formControl
              .charAt(0)
              .toUpperCase()}${formControl.slice(1)}`;
            const value: number = (gcmProcessed as any)[property];

            return {
              ...GREASE_GAUGE_SERIES,
              name: label,
              radius: isTempGauge(formControl) ? '50%' : '33%',
              center: (gaugePositions as any)[formControl],
              detail: {
                ...GREASE_GAUGE_SERIES.detail,
                formatter: `${value.toFixed(2)} ${unit}`,
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
