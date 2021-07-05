import { createSelector } from '@ngrx/store';

import { LOAD_ASSESSMENT_CONTROLS } from '../../../../shared/constants';
import { Type } from '../../../../shared/models';
import { getLoadAssessmentState } from '../../reducers';
import { GcmStatus } from '../../reducers/grease-status/models';
import { LoadAssessmentState } from '../../reducers/load-assessment/load-assessment.reducer';
import { LoadAssessmentDisplay } from '../../reducers/load-assessment/models';
import { LoadSense } from '../../reducers/load-sense/models';
import { ShaftStatus } from '../../reducers/shaft/models';
import { GraphData, Interval } from '../../reducers/shared/models';
import { getGreaseStatusResult } from '../grease-status/grease-status.selector';
import { getBearingLoadResult } from '../load-sense/load-sense.selector';
import { getShaftResult } from '../shaft/shaft.selector';

type GreaseDisplayKeys = keyof LoadAssessmentDisplay;
type DisplayOption = [GreaseDisplayKeys, boolean];

const analysisGraphDataSeries = (
  key: keyof LoadAssessmentDisplay,
  value: boolean,
  gcmStatus: GcmStatus[],
  shaftStatus: ShaftStatus[],
  bearingLoad: LoadSense[]
) => {
  let data: any[];

  switch (
    value &&
    LOAD_ASSESSMENT_CONTROLS.find(({ label }) => label === key).type
  ) {
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

export const getLoadAssessmentDisplay = createSelector(
  getLoadAssessmentState,
  (state: LoadAssessmentState) => state.display
);

export const getLoadAssessmentInterval = createSelector(
  getLoadAssessmentState,
  (state: LoadAssessmentState): Interval => state.interval
);

export const getAnalysisGraphData = createSelector(
  getGreaseStatusResult,
  getShaftResult,
  getBearingLoadResult,
  getLoadAssessmentDisplay,
  (
    gcmStatus: GcmStatus[],
    shaftStatus: ShaftStatus[],
    bearingLoad: LoadSense[],
    display: LoadAssessmentDisplay
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
