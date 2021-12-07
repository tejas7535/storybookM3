import { createSelector } from '@ngrx/store';
import { EChartsOption } from 'echarts';

import { GaugeColors } from '../../../../shared/chart/chart';
import { GaugeEchartConfig } from '../../../../shared/chart/gauge-chart';
import { DATE_FORMAT } from '../../../../shared/constants';
import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import {
  GcmStatus,
  GreaseSensor,
  GreaseSensorName,
  GreaseType,
} from '../../reducers/grease-status/models';

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

export const getGreaseStatusLatestWaterContentGraphData = createSelector(
  getGreaseStatusLatestResult,
  (gcmProcessed: GcmStatus, { sensorName }: GreaseSensor): EChartsOption => {
    const type: GreaseType = GreaseType.waterContent;

    const gaubeConfig = new GaugeEchartConfig({
      name: `greaseStatus.${type}`,
      min: 0,
      max: 100,
      unit: '%',

      value: getValueFromSensorType(gcmProcessed, sensorName, type),
      thresholds: [
        { color: GaugeColors.GREEN, value: 80 },
        { color: GaugeColors.YELLOW, value: 90 },
        { color: GaugeColors.RED, value: 100 },
      ],
    });

    return gaubeConfig.extandedSeries();
  }
);

export const getGreaseStatusLatestTemperatureOpticsGraphData = createSelector(
  getGreaseStatusLatestResult,
  (gcmProcessed: GcmStatus, { sensorName }: GreaseSensor): EChartsOption => {
    const type: GreaseType = GreaseType.temperatureOptics;
    const gaubeConfig = new GaugeEchartConfig({
      name: `greaseStatus.${type}`,
      unit: '°C',
      min: 0,
      max: 120,
      value: getValueFromSensorType(gcmProcessed, sensorName, type),
      thresholds: [
        { color: GaugeColors.GREEN, value: 80 },
        { color: GaugeColors.YELLOW, value: 90 },
        { color: GaugeColors.RED, value: 120 },
      ],
    });

    return gaubeConfig.extandedSeries();
  }
);

export const getGreaseStatusLatestDeteriorationGraphData = createSelector(
  getGreaseStatusLatestResult,
  (gcmProcessed: GcmStatus, { sensorName }: GreaseSensor): EChartsOption => {
    const type: GreaseType = GreaseType.deterioration;

    const gaubeConfig = new GaugeEchartConfig({
      name: `greaseStatus.${type}`,
      min: 0,
      max: 100,
      unit: '%',
      value: getValueFromSensorType(gcmProcessed, sensorName, type),
      thresholds: [
        { color: GaugeColors.GREEN, value: 80 },
        { color: GaugeColors.YELLOW, value: 90 },
        { color: GaugeColors.RED, value: 100 },
      ],
    });

    return gaubeConfig.extandedSeries();
  }
);
/**
 * Can be used to get a number valued for a echart from a gcm Sensor by type
 * @param gcmProcessed
 * @param sensorName
 * @param type
 * @returns
 */
function getValueFromSensorType(
  gcmProcessed: GcmStatus,
  sensorName: GreaseSensorName,
  type: GreaseType
): number {
  if (!gcmProcessed) {
    return 0;
  }

  return gcmProcessed[
    `${sensorName}${type.replace(/^./, (firstChar) => firstChar.toUpperCase())}`
  ] as number;
}
