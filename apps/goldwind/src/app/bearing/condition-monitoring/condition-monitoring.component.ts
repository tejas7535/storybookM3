import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '../../core/store/reducers';
import { MainBearing } from '../../core/store/reducers/bearing/models';
import {
  EdmGraphData,
  Message,
} from '../../core/store/reducers/condition-monitoring/models';
import { GreaseStatus } from '../../core/store/reducers/grease-status/models';
import {
  getCurrentMessage,
  getEdmGraphData,
  getGreaseStatusResult,
  getMainBearing,
  getSocketStatus,
} from '../../core/store/selectors/';

@Component({
  selector: 'goldwind-condition-monitoring',
  templateUrl: './condition-monitoring.component.html',
  styleUrls: ['./condition-monitoring.component.scss'],
})
export class ConditionMonitoringComponent implements OnInit {
  mainBearing$: Observable<MainBearing>;
  edmGraphData$: Observable<EdmGraphData>;
  currentMessage$: Observable<Message>;
  socketStatus$: Observable<number>;
  greaseStatus$: Observable<GreaseStatus>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.mainBearing$ = this.store.pipe(select(getMainBearing));
    this.edmGraphData$ = this.store.pipe(select(getEdmGraphData));
    this.currentMessage$ = this.store.pipe(select(getCurrentMessage));
    this.socketStatus$ = this.store.pipe(select(getSocketStatus));
    this.greaseStatus$ = this.store.pipe(select(getGreaseStatusResult));
  }
}
