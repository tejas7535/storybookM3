import { createSelector } from '@ngrx/store';

import { GaugeEchartConfig } from '../../../../shared/chart/gauge-chart';
import {
  DATE_FORMAT,
  STATIC_STAFETY_SETTINGS,
} from '../../../../shared/constants';
import { StaticSafetyFactorEntity } from '../../../http/types/static-safety-factory.entity';
import { getStaticSafetyState } from '../../reducers';
import { StaticSafetyState } from '../../reducers/static-safety/static-safety.reducer';

export const getStaticSafetyLatestResult = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.status?.result
);

export const getStaticSafetyLatestLoading = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.status.loading
);

export const getStaticSafetyLatestTimeStamp = createSelector(
  getStaticSafetyLatestResult,
  (state: StaticSafetyFactorEntity) =>
    state &&
    new Date(state.timestamp).toLocaleTimeString(
      DATE_FORMAT.local,
      DATE_FORMAT.options
    )
);

export const getStaticSafetyLatestGraphData = createSelector(
  getStaticSafetyLatestResult,
  (state: StaticSafetyFactorEntity) => {
    const gaubeConfig = new GaugeEchartConfig({
      value: state?.staticSafetyFactor,
      min: STATIC_STAFETY_SETTINGS.MIN,
      max: STATIC_STAFETY_SETTINGS.MAX,
      name: STATIC_STAFETY_SETTINGS.TITLE_KEY,
      thresholds: STATIC_STAFETY_SETTINGS.THRESHOLD_CONFIG,
      reverse: true,
    });

    return gaubeConfig.extandedSeries();
  }
);

export const getStaticSafetyLoading = createSelector(
  getStaticSafetyState,
  (state: StaticSafetyState) => state?.loading
);
