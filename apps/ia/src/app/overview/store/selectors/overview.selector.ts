import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';
import { AttritionOverTime } from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';

export const getIsLoadingAttritionOverTimeOverview = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime.loading
);

const getAttritionOverTime = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.attritionOverTime?.data
);

export const getAttritionOverTimeEvents = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.events
);

export const getAttritionOverTimeOverviewData = createSelector(
  getAttritionOverTime,
  (attritionOverTime: AttritionOverTime) => attritionOverTime?.data
);

export const getOverviewFluctuationRates = createSelector(
  selectOverviewState,
  (state: OverviewState) => state.fluctuationRates?.data
);

export const getOverviewFluctuationRatesData = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates
);
