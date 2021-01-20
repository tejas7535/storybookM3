import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { Event, TerminatedEmployee } from '../../shared/models';
import { OverviewState } from '../store';
import {
  getAttritionOverTimeData,
  getAttritionOverTimeEvents,
  getIsLoadingAttritionOverTime,
} from '../store/selectors/overview.selector';

@Component({
  selector: 'ia-attrition-quota-details',
  templateUrl: './attrition-quota-details.component.html',
  styleUrls: ['./attrition-quota-details.component.scss'],
})
export class AttritionQuotaDetailsComponent implements OnInit {
  public loading$: Observable<boolean>;
  public events$: Observable<Event[]>;
  public attritionData$: Observable<{
    [seriesName: string]: {
      employees: TerminatedEmployee[][];
      attrition: number[];
    };
  }>;

  constructor(private readonly store: Store<OverviewState>) {}

  public ngOnInit(): void {
    this.loading$ = this.store.pipe(select(getIsLoadingAttritionOverTime));
    this.events$ = this.store.pipe(select(getAttritionOverTimeEvents));
    this.attritionData$ = this.store.pipe(select(getAttritionOverTimeData));
  }
}
