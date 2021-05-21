import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { Event, TerminatedEmployee } from '../shared/models';
import { OverviewFluctuationRates } from '../shared/models/overview-fluctuation-rates';
import { OverviewState } from './store';
import {
  getAttritionOverTimeEvents,
  getAttritionOverTimeOverviewData,
  getIsLoadingAttritionOverTimeOverview,
  getOverviewFluctuationRatesData,
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
  public fluctuationRatesData$: Observable<OverviewFluctuationRates>;

  constructor(private readonly store: Store<OverviewState>) {}

  public ngOnInit(): void {
    this.attritionQuotaloading$ = this.store.select(
      getIsLoadingAttritionOverTimeOverview
    );
    this.events$ = this.store.select(getAttritionOverTimeEvents);
    this.attritionData$ = this.store.select(getAttritionOverTimeOverviewData);
    this.fluctuationRatesData$ = this.store.select(
      getOverviewFluctuationRatesData
    );
  }
}
