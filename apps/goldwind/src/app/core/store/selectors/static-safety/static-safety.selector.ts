import { createSelector } from '@ngrx/store';

import { GaugeEchartConfig } from '../../../../shared/chart/gauge-chart';
import {
  DATE_FORMAT,
  STATIC_STAFETY_SETTINGS,
} from '../../../../shared/constants';
import { getStaticSafetyState } from '../../reducers';
import { StaticSafetyStatus } from '../../reducers/static-safety/models/static-safety.model';
import { StaticSafetyState } from '../../reducers/static-safety/static-safety.reducer';

export const getStaticSafetyLatestResult = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.status.result
);

export const getStaticSafetyLatestLoading = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.status.loading
);

export const getStaticSafetyLatestTimeStamp = createSelector(
  getStaticSafetyLatestResult,
  (state: StaticSafetyStatus) =>
    state &&
    new Date(state.timestamp).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    )
);

export const getStaticSafetyLatestGraphData = createSelector(
  getStaticSafetyLatestResult,
  (state: StaticSafetyStatus) => {
    const gaubeConfig = new GaugeEchartConfig({
      value: state?.value,
      min: STATIC_STAFETY_SETTINGS.MIN,
      max: STATIC_STAFETY_SETTINGS.MAX,
      name: STATIC_STAFETY_SETTINGS.TITLE_KEY,
      thresholds: STATIC_STAFETY_SETTINGS.THRESHOLD_CONFIG,
      reverse: true,
    });

    return gaubeConfig.extandedSeries();
  }
);

export const getStaticSafetyResult = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.result
);

export const getStaticSafetyLoading = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.loading
);
