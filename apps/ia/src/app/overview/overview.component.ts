import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Event, TerminatedEmployee } from '../shared/models';
import { Employee } from '../shared/models/employee.model';
import { DoughnutConfig } from './entries-exits/doughnut-chart/models/doughnut-config.model';
import { OverviewState } from './store';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getIsLoadingAttritionOverTimeOverview,
  getLeaversDataForSelectedOrgUnit,
  getOverviewFluctuationEntriesCount,
  getOverviewFluctuationEntriesDoughnutConfig,
  getOverviewFluctuationExitsCount,
  getOverviewFluctuationExitsDoughnutConfig,
} from './store/selectors/overview.selector';

@Component({
  selector: 'ia-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  public attritionQuotaloading$: Observable<boolean>;
  public events$: Observable<Event[]>;
  public attritionData$: Observable<{
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  }>;
  public entriesDoughnutConfig: DoughnutConfig;
  public exitsDoughnutConfig$: Observable<DoughnutConfig>;
  public entriesDoughnutConfig$: Observable<DoughnutConfig>;
  public entriesCount$: Observable<number>;
  public exitsCount$: Observable<number>;
  public exitEmployees$: Observable<Employee[]>;

  constructor(private readonly store: Store<OverviewState>) {}

  public ngOnInit(): void {
    this.attritionQuotaloading$ = this.store.select(
      getIsLoadingAttritionOverTimeOverview
    );
    this.events$ = this.store.select(getAttritionOverTimeEvents);
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);

    this.entriesDoughnutConfig$ = this.store.select(
      getOverviewFluctuationEntriesDoughnutConfig
    );

    this.exitsDoughnutConfig$ = this.store.select(
      getOverviewFluctuationExitsDoughnutConfig
    );

    this.entriesCount$ = this.store.select(getOverviewFluctuationEntriesCount);
    this.exitsCount$ = this.store.select(getOverviewFluctuationExitsCount);
    this.exitEmployees$ = this.store.select(getLeaversDataForSelectedOrgUnit);
  }
}
