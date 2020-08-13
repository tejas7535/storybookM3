import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { AppState } from '../../core/store/reducers';
import { IotThing } from '../../core/store/reducers/bearing/models';
import {
  Edm,
  Message,
} from '../../core/store/reducers/condition-monitoring/models';
import {
  getBearingResult,
  getCurrentMessage,
  getEdmResult,
  getSocketStatus,
} from '../../core/store/selectors/';

@Component({
  selector: 'goldwind-condition-monitoring',
  templateUrl: './condition-monitoring.component.html',
  styleUrls: ['./condition-monitoring.component.scss'],
})
export class ConditionMonitoringComponent implements OnInit {
  bearing$: Observable<IotThing>;
  edm$: Observable<Edm>;
  currentMessage$: Observable<Message>;
  socketStatus$: Observable<number>;

  public constructor(private readonly store: Store<AppState>) {}

  ngOnInit(): void {
    this.bearing$ = this.store.pipe(select(getBearingResult));
    this.edm$ = this.store.pipe(select(getEdmResult));
    this.currentMessage$ = this.store.pipe(select(getCurrentMessage));
    this.socketStatus$ = this.store.pipe(select(getSocketStatus));
  }
}
