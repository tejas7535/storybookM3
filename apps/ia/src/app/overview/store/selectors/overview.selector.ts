import { createSelector } from '@ngrx/store';

import { OverviewState, selectOverviewState } from '..';
import { getSelectedOrgUnit } from '../../../core/store/selectors';
import { AttritionOverTime } from '../../../shared/models';
import { OverviewFluctuationRates } from '../../../shared/models/overview-fluctuation-rates';
import { DoughnutConfig } from '../../entries-exits/doughnut-chart/models/doughnut-config.model';
import { DoughnutSeriesConfig } from '../../entries-exits/doughnut-chart/models/doughnut-series-config.model';

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

export const getOverviewFluctuationEntriesCount = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates?.entries
);

export const getOverviewFluctuationExitsCount = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    overviewFluctuationRates?.exits
);

export const getOverviewFluctuationEntriesDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    createDoughnutConfig(
      overviewFluctuationRates?.entries,
      overviewFluctuationRates?.entries,
      'Entries'
    )
);

export const getOverviewFluctuationExitsDoughnutConfig = createSelector(
  getOverviewFluctuationRates,
  (overviewFluctuationRates: OverviewFluctuationRates) =>
    createDoughnutConfig(
      overviewFluctuationRates?.exits,
      overviewFluctuationRates?.exits,
      'Exits'
    )
);

export const getLeaversDataForSelectedOrgUnit = createSelector(
  getOverviewFluctuationRates,
  getSelectedOrgUnit,
  (
    overviewFluctuationRates: OverviewFluctuationRates,
    selectedOrgUnit: string | number
  ) =>
    overviewFluctuationRates?.employees.filter(
      (employee) => employee.orgUnit?.indexOf(selectedOrgUnit.toString()) === 0
    )
);

function createDoughnutConfig(
  internalValue: number,
  externalValue: number,
  name: string
) {
  const labelInternal = 'internal';
  const labelExternal = 'external';

  return new DoughnutConfig(
    name,
    [
      new DoughnutSeriesConfig(internalValue, labelInternal),
      new DoughnutSeriesConfig(externalValue, labelExternal),
    ],
    [labelInternal, labelExternal]
  );
}
