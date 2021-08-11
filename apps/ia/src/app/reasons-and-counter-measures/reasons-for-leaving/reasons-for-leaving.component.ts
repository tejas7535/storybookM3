import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getOrgUnits,
  getSelectedOrgUnit,
  getSelectedTimePeriod,
  getSelectedTimeRange,
  getTimePeriods,
} from '../../core/store/selectors/filter/filter.selector';
import { DoughnutChartData } from '../../shared/charts/models/doughnut-chart-data.model';
import { SolidDoughnutChartConfig } from '../../shared/charts/models/solid-doughnut-chart-config.model';
import { Filter, IdValue, TimePeriod } from '../../shared/models';
import { ReasonForLeavingStats } from '../models/reason-for-leaving-stats.model';
import {
  getComparedSelectedOrgUnit,
  getComparedSelectedTimePeriod,
  getComparedSelectedTimeRange,
  getReasonsChartConfig,
  getReasonsChartData,
  getReasonsData,
  getReasonsLoading,
} from '../store/selectors/reasons-and-counter-measures.selector';

@Component({
  selector: 'ia-reasons-for-leaving',
  templateUrl: './reasons-for-leaving.component.html',
})
export class ReasonsForLeavingComponent implements OnInit {
  orgUnits$: Observable<Filter>;
  selectedOrgUnit$: Observable<string>;
  timePeriods$: Observable<IdValue[]>;
  selectedTimePeriod$: Observable<TimePeriod>;
  selectedTime$: Observable<string>;

  reasonsChartConfig$: Observable<SolidDoughnutChartConfig>;
  reasonsChartData$: Observable<DoughnutChartData[]>;
  reasonsData$: Observable<ReasonForLeavingStats[]>;
  reasonsLoading$: Observable<boolean>;

  comparedSelectedOrgUnit$: Observable<string>;
  comparedSelectedTimePeriod$: Observable<TimePeriod>;
  comparedSelectedTime$: Observable<string>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnits$ = this.store.select(getOrgUnits);
    this.selectedOrgUnit$ = this.store.select(getSelectedOrgUnit);
    this.timePeriods$ = this.store.select(getTimePeriods);
    this.selectedTimePeriod$ = this.store.select(getSelectedTimePeriod);
    this.selectedTime$ = this.store.select(getSelectedTimeRange);

    this.reasonsChartConfig$ = this.store.select(getReasonsChartConfig);
    this.reasonsChartData$ = this.store.select(getReasonsChartData);
    this.reasonsData$ = this.store.select(getReasonsData);
    this.reasonsLoading$ = this.store.select(getReasonsLoading);

    this.comparedSelectedOrgUnit$ = this.store.select(
      getComparedSelectedOrgUnit
    );

    this.comparedSelectedTimePeriod$ = this.store.select(
      getComparedSelectedTimePeriod
    );
    this.comparedSelectedTime$ = this.store.select(
      getComparedSelectedTimeRange
    );
  }
}
