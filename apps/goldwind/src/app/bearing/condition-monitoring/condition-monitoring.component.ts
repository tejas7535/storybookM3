import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '../../core/store/reducers';
import { MainBearing } from '../../core/store/reducers/bearing/models';
import { Message } from '../../core/store/reducers/condition-monitoring/models';
import {
  getCurrentMessage,
  getLiveStatus,
  getMainBearing,
} from '../../core/store/selectors/';

@Component({
  selector: 'goldwind-condition-monitoring',
  templateUrl: './condition-monitoring.component.html',
  styleUrls: ['./condition-monitoring.component.scss'],
})
export class ConditionMonitoringComponent implements OnInit {
  mainBearing$: Observable<MainBearing>;
  currentMessage$: Observable<Message>;
  live$: Observable<boolean>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.mainBearing$ = this.store.pipe(select(getMainBearing));
    this.currentMessage$ = this.store.pipe(select(getCurrentMessage));
    this.live$ = this.store.pipe(select(getLiveStatus));
  }
}
