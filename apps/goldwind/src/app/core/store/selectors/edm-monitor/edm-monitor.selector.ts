import { createSelector } from '@ngrx/store';

import { getEdmMonitorState } from '../../reducers';
import { EdmMonitorState } from '../../reducers/edm-monitor/edm-monitor.reducer';
import {
  Antenna,
  Edm,
  EdmGraphData,
  EdmMeasurement,
  Interval,
} from '../../reducers/edm-monitor/models';

export const getSensorId = createSelector(
  getEdmMonitorState,
  () => 'ee7bffbe-2e87-49f0-b763-ba235dd7c876'
); // will later access a valid id within the inital bearing result

export const getEdmResult = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): Edm => state.measurements
);

export const getEdmGraphData = createSelector(
  getEdmResult,
  (edm: any, props: Antenna): EdmGraphData =>
    edm && {
      series: {
        data: edm.map((measurement: EdmMeasurement) => ({
          value: [
            new Date(measurement.startDate),
            measurement[props.antennaName],
          ],
        })),
      },
    }
);

export const getInterval = createSelector(
  getEdmMonitorState,
  (state: EdmMonitorState): Interval => state.interval
);
