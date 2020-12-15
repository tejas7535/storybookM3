import { translate } from '@ngneat/transloco';
import { createSelector } from '@ngrx/store';

import {
  GaugeColors,
  GREASE_GAUGE_SERIES,
} from '../../../../shared/chart/chart';
import { getBearingState } from '../../reducers';
import { BearingState } from '../../reducers/bearing/bearing.reducer';
import { BearingMetadata, ShaftStatus } from '../../reducers/bearing/models';

export const getBearingLoading = createSelector(
  getBearingState,
  (state: BearingState) => state.loading
);

export const getBearingResult = createSelector(
  getBearingState,
  (state: BearingState) => state.result
);

export const getMainBearing = createSelector(
  getBearingResult,
  (state: BearingMetadata) => state && state.mainBearing
);

// highly WIP
export const getShaftDeviceId = createSelector(
  getBearingState,
  () => 'goldwind-qa-002'
);

export const getShaftResult = createSelector(
  getBearingState,
  (state: BearingState) => state?.shaft?.result
);

export const getShaftLatestGraphData = createSelector(
  getShaftResult,
  (state: ShaftStatus) =>
    state && {
      series: {
        ...GREASE_GAUGE_SERIES,
        name: translate('conditionMonitoring.shaft.rotorRotationSpeed'),
        max: 20,
        data: [
          {
            value: state.rsm01Shaftcountervalue,
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
