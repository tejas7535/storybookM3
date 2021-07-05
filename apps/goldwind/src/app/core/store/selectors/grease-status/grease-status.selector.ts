import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import { GREASE_GAUGE_SERIES } from '../../../../shared/chart/chart';
import { DATE_FORMAT, GREASE_DASHBOARD } from '../../../../shared/constants';
import { Control } from '../../../../shared/models';
import { getGreaseStatusState } from '../../reducers';
import { GreaseStatusState } from '../../reducers/grease-status/grease-status.reducer';
import { GcmStatus, GreaseSensor } from '../../reducers/grease-status/models';
import { GraphData } from '../../reducers/shared/models';

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
          ({ label, formControl, unit }: Control) => {
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
