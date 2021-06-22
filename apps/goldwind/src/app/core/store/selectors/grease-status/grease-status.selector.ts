import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GREASE_GAUGE_SERIES } from '../../../../shared/chart/chart';
import {
  DATE_FORMAT,
  GREASE_CONTROLS,
  GREASE_DASHBOARD,
} from '../../../../shared/constants';
import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import {
  GcmStatus,
  GreaseControl,
  GreaseDisplay,
  GreaseSensor,
  Type,
} from '../../reducers/grease-status/models';
import { LoadSense } from '../../reducers/load-sense/models';
import { ShaftStatus } from '../../reducers/shaft/models';
import { GraphData, Interval } from '../../reducers/shared/models';
import { getBearingLoadResult } from '../load-sense/load-sense.selector';
import { getShaftResult } from '../shaft/shaft.selector';

type GreaseDisplayKeys = keyof GreaseDisplay;
type DisplayOption = [GreaseDisplayKeys, boolean];

const isTempGauge = (formControl: string) =>
  formControl === 'temperatureOptics';

const analysisGraphDataSeries = (
  key: keyof GreaseDisplay,
  value: boolean,
  gcmStatus: GcmStatus[],
  shaftStatus: ShaftStatus[],
  bearingLoad: LoadSense[]
) => {
  let data: any[];

  switch (value && GREASE_CONTROLS.find(({ label }) => label === key).type) {
    case Type.grease:
      data = gcmStatus?.map((measurement: GcmStatus) => {
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

        return measurementValue
          ? {
              value: [
                new Date(measurement.timestamp),
                measurementValue.toFixed(2),
              ],
            }
          : { value: [] };
      });
      break;
    case Type.rsm:
      data = shaftStatus?.map((measurement: ShaftStatus) => ({
        value: [
          new Date(measurement.timestamp),
          measurement.rsm01ShaftSpeed.toFixed(2),
        ],
      }));
      break;
    case Type.load:
      data = bearingLoad?.map((measurement: LoadSense) => ({
        value: [
          new Date(measurement.timestamp),
          (measurement as any)[key].toFixed(2),
        ],
      }));
      break;
    default:
      data = [];
      break;
  }

  return {
    name: key,
    type: 'line',
    data,
  };
};

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

export const getGreaseTimeStamp = createSelector(
  getGreaseStatusLatestResult,
  (state: GcmStatus) =>
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

export const getAnalysisGraphData = createSelector(
  getGreaseStatusResult,
  getShaftResult,
  getBearingLoadResult,
  getGreaseDisplay,
  (
    gcmStatus: GcmStatus[],
    shaftStatus: ShaftStatus[],
    bearingLoad: LoadSense[],
    display: GreaseDisplay
  ): GraphData => {
    const result = gcmStatus && {
      legend: {
        data: Object.entries(display)
          .map(([key, value]) => [key, value] as DisplayOption)
          .filter(([_key, value]: DisplayOption) => value)
          .map(([key, _value]: DisplayOption) => key),
      },
      series: Object.entries(display)
        .map(([key, value]) => [key, value] as DisplayOption)
        .map(([key, value]: DisplayOption) =>
          analysisGraphDataSeries(
            key,
            value,
            gcmStatus,
            shaftStatus,
            bearingLoad
          )
        ),
    };

    return result;
  }
);

export const getGreaseStatusLatestGraphData = createSelector(
  getGreaseStatusLatestResult,
  (gcmProcessed: GcmStatus, { sensorName }: GreaseSensor): GraphData => {
    const gaugePositions = {
      temperatureOptics: ['20%', '50%'],
      waterContent: ['50%', '50%'],
      deterioration: ['80%', '50%'],
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
