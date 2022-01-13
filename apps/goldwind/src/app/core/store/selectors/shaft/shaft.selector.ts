import { createSelector } from '@ngrx/store';

import { GaugeColors } from '../../../../shared/chart/chart';
import { GaugeEchartConfig } from '../../../../shared/chart/gauge-chart';
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
  (state: ShaftStatus) => {
    const gaubeConfig = new GaugeEchartConfig({
      value: state?.rsm01ShaftSpeed,
      min: 0,
      max: 20,
      unit: 'rpm',
      name: 'conditionMonitoring.shaft.rotorRotationSpeed',
      thresholds: [
        { value: 11, color: GaugeColors.GREEN },
        { value: 15, color: GaugeColors.YELLOW },
        { value: 20, color: GaugeColors.RED },
      ],
    });

    return gaubeConfig.extandedSeries();
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
