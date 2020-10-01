import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '../../core/store/reducers';
import { MainBearing } from '../../core/store/reducers/bearing/models';
import { Message } from '../../core/store/reducers/condition-monitoring/models';
import { GraphData } from '../../core/store/reducers/shared/models';
import {
  getCurrentMessage,
  getGreaseStatusLatestGraphData,
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
  currentMessage$: Observable<Message>;
  socketStatus$: Observable<number>;
  greaseStatusLatestGraphData$: Observable<GraphData>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.mainBearing$ = this.store.pipe(select(getMainBearing));
    this.currentMessage$ = this.store.pipe(select(getCurrentMessage));
    this.socketStatus$ = this.store.pipe(select(getSocketStatus));
    this.greaseStatusLatestGraphData$ = this.store.pipe(
      select(getGreaseStatusLatestGraphData)
    );
  }
}
