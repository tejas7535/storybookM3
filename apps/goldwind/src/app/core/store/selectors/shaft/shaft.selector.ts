import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  GaugeColors,
  GREASE_GAUGE_SERIES,
} from '../../../../shared/chart/chart';
import { DATE_FORMAT } from '../../../../shared/constants';
import { getShaftState } from '../../reducers';
import { ShaftStatus } from '../../reducers/shaft/models';
import { ShaftState } from '../../reducers/shaft/shaft.reducer';

export const getShaftLatestResult = createSelector(
  getShaftState,
  (state: ShaftState) => state?.status.result
);

export const getShaftLatestLoading = createSelector(
  getShaftState,
  (state: ShaftState) => state?.status.loading
);

export const getShaftLatestTimeStamp = createSelector(
  getShaftLatestResult,
  (state: ShaftStatus) =>
    state &&
    new Date(state.timestamp).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    )
);

export const getShaftLatestGraphData = createSelector(
  getShaftLatestResult,
  (state: ShaftStatus) =>
    state && {
      series: {
        ...GREASE_GAUGE_SERIES,
        name: translate('conditionMonitoring.shaft.rotorRotationSpeed'),
        max: 20,
        data: [
          {
            value: state.rsm01ShaftSpeed.toFixed(2),
            name: translate(
              'conditionMonitoring.shaft.rotorRotationSpeed'
            ).toUpperCase(),
          },
        ],
        axisLine: {
          lineStyle: {
            ...GREASE_GAUGE_SERIES.axisLine.lineStyle,
            color: [
              [16.5 / 20, GaugeColors.GREEN],
              [18 / 20, GaugeColors.YELLOW],
              [1, GaugeColors.RED],
            ],
          },
        },
      },
    }
);

export const getShaftResult = createSelector(
  getShaftState,
  (state: ShaftState) => state?.result
);

export const getShaftLoading = createSelector(
  getShaftState,
  (state: ShaftState) => state?.loading
);
